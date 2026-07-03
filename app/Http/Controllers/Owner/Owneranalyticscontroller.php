<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OwnerAnalyticsController extends Controller
{
    /**
     * GET /owner/revenue-analytics
     *
     * Revenue bulanan (6 bulan terakhir) milik owner yang login,
     * dihitung dari invoice_payments yang sudah dikonfirmasi (status='confirmed'),
     * dilacak lewat invoices -> orders (orders.owner_id = auth id).
     *
     * Response: [{ label: "Feb", revenue: 1250000 }, ...]
     */
    public function revenueAnalytics(Request $request)
    {
        $ownerId = auth()->id();

        $rows = DB::table('invoice_payments')
            ->join('invoices', 'invoices.id', '=', 'invoice_payments.invoice_id')
            ->join('orders', 'orders.id', '=', 'invoices.order_id')
            ->where('orders.owner_id', $ownerId)
            ->where('invoice_payments.status', 'confirmed')
            ->selectRaw("DATE_FORMAT(invoice_payments.confirmed_at, '%Y-%m') as ym, SUM(invoice_payments.amount) as total")
            ->groupBy('ym')
            ->pluck('total', 'ym');

        $bulanIndo = [
            '01' => 'Jan', '02' => 'Feb', '03' => 'Mar', '04' => 'Apr',
            '05' => 'Mei', '06' => 'Jun', '07' => 'Jul', '08' => 'Agu',
            '09' => 'Sep', '10' => 'Okt', '11' => 'Nov', '12' => 'Des',
        ];

        $result = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $ym   = $date->format('Y-m');

            $result[] = [
                'label'   => $bulanIndo[$date->format('m')],
                'revenue' => (float) ($rows[$ym] ?? 0),
            ];
        }

        return response()->json($result);
    }

    /**
     * GET /owner/latest-transactions
     *
     * Pembayaran terakhir yang DITERIMA (confirmed) oleh owner yang login,
     * diambil dari invoice_payments -> invoices -> orders (owner_id) -> users (klien).
     *
     * Response: [{ id, invoice_number, client_name, amount, type, confirmed_at }]
     */
    public function latestTransactions(Request $request)
    {
        $ownerId = auth()->id();
        $limit   = (int) $request->query('limit', 8);

        $payments = DB::table('invoice_payments')
            ->join('invoices', 'invoices.id', '=', 'invoice_payments.invoice_id')
            ->join('orders', 'orders.id', '=', 'invoices.order_id')
            ->join('users as clients', 'clients.id', '=', 'invoices.client_id')
            ->where('orders.owner_id', $ownerId)
            ->where('invoice_payments.status', 'confirmed')
            ->orderByDesc('invoice_payments.confirmed_at')
            ->limit($limit)
            ->select([
                'invoice_payments.id',
                'invoices.invoice_number',
                'clients.name as client_name',
                'invoice_payments.amount',
                'invoice_payments.type',
                'invoice_payments.confirmed_at',
            ])
            ->get();

        return response()->json($payments);
    }
}