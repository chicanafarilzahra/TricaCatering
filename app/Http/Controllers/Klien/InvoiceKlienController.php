<?php

namespace App\Http\Controllers\Klien;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoicePayment;
use App\Models\PaymentChannel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class InvoiceKlienController extends Controller
{
    /* ───────── LIST INVOICE ───────── */
    public function index()
    {
        $user = Auth::user();

        $invoices = Invoice::where('client_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'data' => $invoices,
            'total_tagihan' => $invoices->sum('total_amount'),
        ]);
    }

    /* ───────── DETAIL INVOICE ───────── */
    public function show(int $id)
    {
        $user = Auth::user();

        $invoice = Invoice::where('client_id', $user->id)
            ->findOrFail($id);

        return response()->json([
            'data' => $invoice
        ]);
    }

    /* ───────── PAYMENT CHANNELS ───────── */
    public function paymentChannels(int $id)
    {
        $user = Auth::user();

        $invoice = Invoice::where('client_id', $user->id)
            ->findOrFail($id);

        $channels = PaymentChannel::query()->get();

        return response()->json([
            'banks' => $channels->where('type', 'bank')->values(),
            'ewallets' => $channels->where('type', 'ewallet')->values(),
        ]);
    }

    /* ───────── PAY INVOICE ───────── */
    public function pay(Request $request, int $id)
    {
        $request->validate([
            'payment_channel_id' => 'required|exists:payment_channels,id',
            'payment_proof' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'note' => 'nullable|string|max:500',
            'type' => 'required|in:dp,pelunasan,full',
        ]);

        $user = Auth::user();

        $invoice = Invoice::where('client_id', $user->id)
            ->whereIn('status', ['pending', 'partial'])
            ->findOrFail($id);

        $path = $request->file('payment_proof')
            ->store("payment_proofs/{$invoice->id}", 'public');

        $amount = match ($request->type) {
            'dp' => $invoice->total_amount * 0.5,
            'pelunasan' => $invoice->total_amount,
            default => $invoice->total_amount,
        };

        $payment = InvoicePayment::create([
            'invoice_id' => $invoice->id,
            'payment_channel_id' => $request->payment_channel_id,
            'type' => $request->type,
            'amount' => $amount,
            'proof_path' => $path,
            'proof_url' => Storage::url($path),
            'note' => $request->note,
            'status' => 'pending',
        ]);

        $invoice->update([
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Payment berhasil dikirim, menunggu konfirmasi.',
            'data' => $payment
        ]);
    }

    /* ───────── PAYMENT HISTORY ───────── */
    public function payments(int $id)
    {
        $user = Auth::user();

        $invoice = Invoice::where('client_id', $user->id)
            ->findOrFail($id);

        $payments = InvoicePayment::where('invoice_id', $invoice->id)
            ->latest()
            ->get();

        return response()->json([
            'data' => $payments
        ]);
    }
}