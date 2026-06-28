<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminInvoiceController extends Controller
{
    /**
     * GET /admin/invoices
     * Admin melihat seluruh invoice.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Invoice::with([
            'order.menu',
            'client',
            'payments.paymentChannel',
        ])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->paginate(20));
    }

    /**
     * GET /admin/invoices/{id}
     * Detail invoice.
     */
    public function show(int $id): JsonResponse
    {
        $invoice = Invoice::with([
            'order.menu',
            'client',
            'payments.paymentChannel',
            'payments.confirmedBy',
        ])->findOrFail($id);

        return response()->json([
            'data' => $invoice,
        ]);
    }
}