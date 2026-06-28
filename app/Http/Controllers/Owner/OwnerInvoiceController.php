<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoicePayment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OwnerInvoiceController extends Controller
{
    /**
     * GET /owner/invoices
     */
    public function index(Request $request): JsonResponse
    {
        $query = Invoice::with([
                    'order.menu',
                    'client',
                    'payments.paymentChannel'
                ])
                ->whereHas('order', function ($q) {
                    $q->where('owner_id', Auth::id());
                })
                ->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->paginate(20));
    }

    /**
     * GET /owner/invoices/{id}
     */
    public function show(int $id): JsonResponse
    {
        $invoice = Invoice::with([
            'order.menu',
            'client',
            'payments.paymentChannel',
            'payments.confirmedBy',
        ])
        ->whereHas('order', function ($q) {
            $q->where('owner_id', Auth::id());
        })
        ->findOrFail($id);

        return response()->json([
            'data' => $invoice
        ]);
    }

    /**
     * GET /owner/invoice-payments
     */
    public function pending(): JsonResponse
    {
        $payments = InvoicePayment::with([
                'invoice.client',
                'invoice.order.menu',
                'paymentChannel'
            ])
            ->where('status', 'pending')
            ->whereHas('invoice.order', function ($q) {
                $q->where('owner_id', Auth::id());
            })
            ->latest()
            ->get();

        return response()->json([
            'data' => $payments
        ]);
    }

    /**
     * PUT /owner/invoice-payments/{id}/confirm
     */
    public function confirm(int $paymentId): JsonResponse
    {
        $payment = InvoicePayment::with('invoice')
            ->whereHas('invoice.order', function ($q) {
                $q->where('owner_id', Auth::id());
            })
            ->findOrFail($paymentId);

        if ($payment->status !== 'pending') {
            return response()->json([
                'message' => 'Pembayaran ini sudah diproses sebelumnya.'
            ], 422);
        }

        DB::transaction(function () use ($payment) {

            $invoice = $payment->invoice;

            $payment->update([
                'status'       => 'confirmed',
                'confirmed_at' => now(),
                'confirmed_by' => Auth::id(),
            ]);

            if ($payment->type === 'dp') {

                $invoice->update([
                    'status'    => Invoice::STATUS_DP_PAID,
                    'dp_amount' => $payment->amount,
                ]);

            } else {

                $invoice->update([
                    'status'  => Invoice::STATUS_PAID,
                    'paid_at' => now(),
                ]);

            }
        });

        return response()->json([
            'message' => 'Pembayaran berhasil dikonfirmasi.',
            'data' => $payment->fresh([
                'invoice',
                'paymentChannel'
            ]),
        ]);
    }

    /**
     * PUT /owner/invoice-payments/{id}/reject
     */
    public function reject(Request $request, int $paymentId): JsonResponse
    {
        $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $payment = InvoicePayment::with('invoice')
            ->whereHas('invoice.order', function ($q) {
                $q->where('owner_id', Auth::id());
            })
            ->findOrFail($paymentId);

        if ($payment->status !== 'pending') {
            return response()->json([
                'message' => 'Pembayaran ini sudah diproses sebelumnya.'
            ], 422);
        }

        DB::transaction(function () use ($payment, $request) {

            $invoice = $payment->invoice;

            $payment->update([
                'status'       => 'rejected',
                'confirmed_at' => now(),
                'confirmed_by' => Auth::id(),
                'note' => $request->reason
                    ? "[DITOLAK] {$request->reason}"
                    : "[DITOLAK] Bukti pembayaran tidak valid.",
            ]);

            $prevStatus = $payment->type === 'pelunasan'
                ? Invoice::STATUS_DP_PAID
                : Invoice::STATUS_UNPAID;

            $invoice->update([
                'status' => $prevStatus
            ]);
        });

        return response()->json([
            'message' => 'Pembayaran berhasil ditolak.',
            'data' => $payment->fresh(),
        ]);
    }
}