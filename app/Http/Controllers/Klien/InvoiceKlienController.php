<?php

namespace App\Http\Controllers\Klien;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoicePayment;
use App\Models\PaymentChannel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class InvoiceKlienController extends Controller
{
    /* ══════════════════════════════════════════════════
     * GET /klien/invoice
     * Daftar semua invoice milik klien yang login.
     * ══════════════════════════════════════════════════ */
    public function index(): JsonResponse
    {
        $invoices = Invoice::with(['order.menu'])
            ->where('client_id', Auth::id())
            ->latest()
            ->get();

        // total_tagihan: exclude invoice yang dibatalkan
        $totalTagihan = $invoices
            ->whereNotIn('status', ['cancelled'])
            ->sum('total_amount');

        return response()->json([
            'data'          => $invoices,
            'total_tagihan' => $totalTagihan,
        ]);
    }

    /* ══════════════════════════════════════════════════
     * GET /klien/invoice/{id}
     * Detail satu invoice (termasuk relasi order & payments).
     * ══════════════════════════════════════════════════ */
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

    /* ══════════════════════════════════════════════════
     * GET /klien/invoice/{id}/payment-channels
     * Daftar rekening bank & ewallet yang tersedia.
     *
     * Prioritas: channel milik owner catering → channel global (owner_id null)
     * ══════════════════════════════════════════════════ */
    public function paymentChannels(int $id): JsonResponse
    {
        $invoice = $this->findOwned($id);
        $invoice->load('order');

        $ownerId = $invoice->order?->owner_id;

        // Ambil channel milik owner tersebut + channel global (owner_id = null)
        $channels = PaymentChannel::where('is_active', true)
            ->where(function ($q) use ($ownerId) {
                $q->whereNull('owner_id');
                if ($ownerId) {
                    $q->orWhere('owner_id', $ownerId);
                }
            })
            ->get();

        return response()->json([
            'banks'    => $channels->where('type', 'bank')->values(),
            'ewallets' => $channels->where('type', 'ewallet')->values(),
        ]);
    }

    /* ══════════════════════════════════════════════════
     * POST /klien/invoice/{id}/pay
     * Klien upload bukti pembayaran.
     *
     * Status flow:
     *   unpaid  → [klien bayar DP]      → pending
     *   dp_paid → [klien bayar pelunasan] → pending
     *   unpaid  → [klien bayar full]    → pending
     * Setelah admin konfirmasi:
     *   pending → dp_paid (kalau type=dp)
     *   pending → paid    (kalau type=full atau pelunasan)
     * ══════════════════════════════════════════════════ */
    public function pay(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'payment_channel_id' => 'required|exists:payment_channels,id',
            'payment_proof'      => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'note'               => 'nullable|string|max:500',
            'type'               => 'required|in:dp,pelunasan,full',
        ]);

        // Hanya invoice yg belum lunas yang bisa dibayar
        $invoice = Invoice::where('client_id', Auth::id())
            ->whereIn('status', ['unpaid', 'dp_paid'])
            ->findOrFail($id);

        // Hitung jumlah yang harus dibayar sesuai tipe
        $amount = match ($request->type) {
            'dp'        => round($invoice->total_amount * 0.5, 2),
            'pelunasan' => round($invoice->total_amount - ($invoice->dp_amount ?? 0), 2),
            default     => $invoice->total_amount,   // full
        };

        // Simpan file bukti pembayaran
        $path = $request->file('payment_proof')
                        ->store("payment_proofs/invoice-{$invoice->id}", 'public');

        // Buat record pembayaran
        $payment = InvoicePayment::create([
            'invoice_id'         => $invoice->id,
            'payment_channel_id' => $request->payment_channel_id,
            'type'               => $request->type,
            'amount'             => $amount,
            'proof_path'         => $path,
            'proof_url'          => Storage::url($path),
            'note'               => $request->note,
            'status'             => 'pending',  // menunggu konfirmasi admin
        ]);

        // Invoice berubah ke 'pending' (menunggu konfirmasi admin)
        $invoice->update(['status' => 'pending']);

        return response()->json([
            'message' => 'Bukti pembayaran berhasil dikirim. Menunggu konfirmasi admin.',
            'data'    => $payment,
        ], 201);
    }

    /* ══════════════════════════════════════════════════
     * GET /klien/invoice/{id}/payments
     * Riwayat semua pembayaran untuk invoice ini.
     * ══════════════════════════════════════════════════ */
    public function payments(int $id): JsonResponse
    {
        $invoice = $this->findOwned($id);

        $payments = InvoicePayment::with('paymentChannel')
            ->where('invoice_id', $invoice->id)
            ->latest()
            ->get();

        return response()->json(['data' => $payments]);
    }

    /* ══════════════════════════════════════════════════
     * GET /klien/invoice/{id}/pdf
     * Download invoice sebagai PDF.
     * ══════════════════════════════════════════════════ */
    public function downloadPdf(int $id)
    {
        $invoice = $this->findOwned($id);
        $invoice->load(['order.menu', 'client', 'payments']);

        // Cek apakah DomPDF tersedia
        if (!class_exists(\Barryvdh\DomPDF\Facade\Pdf::class)) {
            return response()->json([
                'message' => 'PDF generator belum diinstall. Jalankan: composer require barryvdh/laravel-dompdf'
            ], 501);
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.invoice', compact('invoice'))
                    ->setPaper('a4', 'portrait');

        $filename = "Invoice-{$invoice->invoice_number}.pdf";

        return $pdf->download($filename);
    }

    /* ══════════════════════════════════════════════════
     * PRIVATE HELPER
     * Pastikan invoice milik user yang sedang login.
     * Kalau bukan → 404 (bukan 403, supaya tidak bocorkan keberadaan data).
     * ══════════════════════════════════════════════════ */
    private function findOwned(int $id): Invoice
    {
        return Invoice::where('client_id', Auth::id())
                      ->findOrFail($id);
    }
}