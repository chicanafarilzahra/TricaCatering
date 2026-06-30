<?php

namespace App\Http\Controllers\Klien;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoicePayment;
use App\Models\PaymentAccount;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class InvoiceKlienController extends Controller
{
    public function index(): JsonResponse
    {
        $invoices = Invoice::with(['order.menu'])
            ->where('client_id', Auth::id())
            ->latest()
            ->get();

        $totalTagihan = $invoices
            ->whereNotIn('status', ['cancelled'])
            ->sum('total_amount');

        return response()->json([
            'data'          => $invoices,
            'total_tagihan' => $totalTagihan,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $invoice = $this->findOwned($id);

        $invoice->load([
            'order.menu',
            'client',
            'payments.paymentChannel',
        ]);

        return response()->json(['data' => $invoice]);
    }

    /**
     * GET /klien/invoice/{id}/payment-channels
     * Rekening yang dipakai untuk pelunasan = rekening yang sama
     * dengan yang dikelola owner di halaman Revenue (payment_accounts).
     */
    public function paymentChannels(int $id): JsonResponse
    {
        $invoice = $this->findOwned($id);
        $invoice->load('order');

        $ownerId = $invoice->order?->owner_id;

        $accounts = PaymentAccount::where('owner_id', $ownerId)
            ->orderByDesc('is_default')
            ->get();

        return response()->json([
            'banks'    => $accounts->where('type', 'bank')->values(),
            'ewallets' => $accounts->where('type', 'ewallet')->values(),
        ]);
    }

    /**
     * POST /klien/invoice/{id}/pay
     * Dipakai untuk kirim bukti PELUNASAN sisa 50% (DP sudah otomatis
     * masuk saat owner approve order). Status invoice akan jadi
     * "pending" menunggu konfirmasi owner di halaman Revenue.
     */
    public function pay(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'payment_channel_id' => 'required|exists:payment_accounts,id',
            'payment_proof'      => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'note'               => 'nullable|string|max:500',
            'type'               => 'required|in:dp,pelunasan,full',
            'payment_date'       => 'nullable|date',
        ]);

        $invoice = Invoice::where('client_id', Auth::id())
            ->whereIn('status', ['unpaid', 'dp_paid'])
            ->findOrFail($id);

        $amount = match ($request->type) {
            'dp'        => round($invoice->total_amount * 0.5, 2),
            'pelunasan' => round($invoice->total_amount - ($invoice->dp_amount ?? 0), 2),
            default     => $invoice->total_amount,
        };

        $path = $request->file('payment_proof')
                        ->store("payment_proofs/invoice-{$invoice->id}", 'public');

        $payment = InvoicePayment::create([
            'invoice_id'         => $invoice->id,
            'payment_channel_id' => $request->payment_channel_id,
            'type'               => $request->type,
            'amount'             => $amount,
            'proof_path'         => $path,
            'proof_url'          => Storage::url($path),
            'note'               => $request->note,
            'status'             => 'pending',
        ]);

        $invoice->update(['status' => 'pending']);

        return response()->json([
            'message' => 'Bukti pembayaran berhasil dikirim. Menunggu konfirmasi owner di halaman Revenue.',
            'data'    => $payment,
        ], 201);
    }

    public function payments(int $id): JsonResponse
    {
        $invoice = $this->findOwned($id);

        $payments = InvoicePayment::with('paymentChannel')
            ->where('invoice_id', $invoice->id)
            ->latest()
            ->get();

        return response()->json(['data' => $payments]);
    }

    public function downloadPdf(int $id)
    {
        $invoice = $this->findOwned($id);
        $invoice->load(['order.menu', 'client', 'payments']);

        if (!class_exists(\Barryvdh\DomPDF\Facade\Pdf::class)) {
            return response()->json([
                'message' => 'PDF generator belum diinstall. Jalankan: composer require barryvdh/laravel-dompdf'
            ], 501);
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.invoice', compact('invoice'))
                    ->setPaper('a4', 'portrait');

        return $pdf->download("Invoice-{$invoice->invoice_number}.pdf");
    }

    private function findOwned(int $id): Invoice
    {
        return Invoice::where('client_id', Auth::id())->findOrFail($id);
    }
}