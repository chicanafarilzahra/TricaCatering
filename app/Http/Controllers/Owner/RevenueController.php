<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoicePayment;
use App\Models\Order;
use App\Models\Wallet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RevenueController extends Controller
{
    /* GET /owner/payments
     * Daftar pembayaran pelunasan/DP/full yang masuk untuk pesanan
     * milik owner yang sedang login (pending & confirmed tercampur,
     * difilter di frontend lewat tab).
     */
    public function index(): JsonResponse
    {
        $ownerId = Auth::id();

        $payments = InvoicePayment::with([
                'paymentChannel',
                'invoice.client:id,name',
                'invoice.order.courier:id,name,phone',
                'invoice.order.menu:id,name',
            ])
            ->whereHas('invoice.order', fn ($q) => $q->where('owner_id', $ownerId))
            ->latest()
            ->get();

        return response()->json(['data' => $payments]);
    }

    /* PUT /owner/payments/{id}/confirm
     * Owner menyetujui bukti pembayaran (umumnya pelunasan DP 50%).
     * Uang masuk ke wallet owner, invoice otomatis berubah jadi lunas.
     */
    public function confirm(int $id): JsonResponse
    {
        $ownerId = Auth::id();

        $payment = InvoicePayment::with('invoice.order')
            ->whereHas('invoice.order', fn ($q) => $q->where('owner_id', $ownerId))
            ->where('status', 'pending')
            ->findOrFail($id);

        DB::transaction(function () use ($payment) {
            $invoice = $payment->invoice;

            $payment->update([
                'status'       => 'confirmed',
                'confirmed_at' => now(),
                'confirmed_by' => Auth::id(),
            ]);

            if ((float) $payment->amount > 0) {
                $wallet = Wallet::firstOrCreate(['user_id' => $invoice->order->owner_id]);
                $wallet->credit(
                    amount: (float) $payment->amount,
                    category: $payment->type === 'pelunasan' ? 'pelunasan_payment' : 'dp_payment',
                    orderId: $invoice->order_id,
                    description: "Pelunasan invoice {$invoice->invoice_number}",
                );
            }

            $newDpAmount = (float) $invoice->dp_amount + (float) $payment->amount;
            $isLunas     = $newDpAmount >= (float) $invoice->total_amount - 0.5; // toleransi pembulatan

            $invoice->update([
                'dp_amount' => $isLunas ? $invoice->total_amount : $newDpAmount,
                'status'    => $isLunas ? 'paid' : 'dp_paid',
                'paid_at'   => $isLunas ? now() : $invoice->paid_at,
            ]);
        });

        return response()->json(['message' => 'Pembayaran dikonfirmasi. Invoice diperbarui dan revenue bertambah.']);
    }

    /* PUT /owner/payments/{id}/reject
     * Owner menolak bukti pembayaran. Tidak ada uang yang masuk ke
     * revenue, dan status invoice otomatis jadi gagal.
     */
    public function reject(int $id): JsonResponse
    {
        $ownerId = Auth::id();

        $payment = InvoicePayment::with('invoice')
            ->whereHas('invoice.order', fn ($q) => $q->where('owner_id', $ownerId))
            ->where('status', 'pending')
            ->findOrFail($id);

        DB::transaction(function () use ($payment) {
            $payment->update(['status' => 'rejected']);
            $payment->invoice->update(['status' => 'failed']);
        });

        return response()->json(['message' => 'Pembayaran ditolak. Status invoice klien otomatis gagal.']);
    }

    /* GET /owner/transactions
     * Riwayat semua transaksi yang sudah dikonfirmasi (DP otomatis saat
     * approve + pelunasan yang dikonfirmasi manual).
     */
    public function transactions(): JsonResponse
    {
        $ownerId = Auth::id();

        $confirmedPelunasan = InvoicePayment::with(['invoice.client:id,name', 'invoice:id,invoice_number,order_id'])
            ->whereHas('invoice.order', fn ($q) => $q->where('owner_id', $ownerId))
            ->where('status', 'confirmed')
            ->get()
            ->map(fn ($p) => [
                'id'             => 'payment-' . $p->id,
                'type'           => $p->type,
                'client_name'    => $p->invoice?->client?->name,
                'invoice_number' => $p->invoice?->invoice_number,
                'amount'         => $p->amount,
                'confirmed_at'   => $p->confirmed_at ?? $p->updated_at,
            ]);

        $autoApproved = Invoice::with(['client:id,name', 'order:id,owner_id,type'])
            ->whereHas('order', fn ($q) => $q->where('owner_id', $ownerId))
            ->whereIn('status', ['dp_paid', 'paid'])
            ->get()
            ->map(function ($inv) {
                $isHarian = $inv->order?->type === 'harian';
                return [
                    'id'             => 'invoice-' . $inv->id,
                    'type'           => $isHarian ? 'full' : 'dp',
                    'client_name'    => $inv->client?->name,
                    'invoice_number' => $inv->invoice_number,
                    'amount'         => $isHarian ? $inv->total_amount : $inv->dp_amount,
                    'confirmed_at'   => $inv->paid_at ?? $inv->created_at,
                ];
            });

        $all = $confirmedPelunasan->concat($autoApproved)
            ->sortByDesc('confirmed_at')
            ->values();

        return response()->json(['data' => $all]);
    }

    /* POST /owner/orders/{id}/dispatch-courier-fee
     * Kirim uang jasa kurir setelah pesanan terkirim & invoice lunas.
     */
    public function dispatchCourierFee(int $orderId): JsonResponse
    {
        $ownerId = Auth::id();

        $order = Order::where('owner_id', $ownerId)->findOrFail($orderId);

        if ($order->courier_fee_dispatched) {
            return response()->json(['message' => 'Uang jasa kurir untuk pesanan ini sudah pernah dikirim.'], 422);
        }

        if (!$order->kurir_id) {
            return response()->json(['message' => 'Pesanan ini belum punya kurir.'], 422);
        }

        $fee = (float) ($order->courier_fee ?? 0);

        DB::transaction(function () use ($order, $fee) {
            if ($fee > 0) {
                $courierWallet = Wallet::firstOrCreate(['user_id' => $order->kurir_id]);
                $courierWallet->credit(
                    amount: $fee,
                    category: 'courier_fee',
                    orderId: $order->id,
                    description: "Jasa kurir pesanan #{$order->id}",
                );
            }

            $order->update([
                'courier_fee_dispatched'    => true,
                'courier_fee_dispatched_at' => now(),
            ]);
        });

        return response()->json(['message' => 'Uang jasa kurir berhasil dikirim.']);
    }
}