<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Stock;
use App\Models\MenuIngredient;
use App\Models\DeliverySchedule;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OrderController extends Controller
{
    /* GET /owner/orders */
    public function index(): JsonResponse
    {
        $orders = Order::with(['menu', 'kurir'])->latest()->get();
        return response()->json(['data' => $orders]);
    }

    /* PUT /owner/orders/{id}/approve
     *
     * 1. Ubah status → confirmed
     * 2. Kurangi stok bahan sesuai resep menu × qty pesanan
     * 3. Generate jadwal kirim (delivery_schedules) sesuai tanggal pemesanan
     * 4. Jika stok tidak cukup → rollback & return 422
     */
    public function approve(Request $request, Order $order): JsonResponse
    {
        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Pesanan tidak dalam status pending.'], 422);
        }

        DB::beginTransaction();
        try {
            $menu     = $order->menu;
            $quantity = (int) $order->quantity; // jumlah porsi yang dipesan

            if ($menu) {
                $ingredients = MenuIngredient::where('menu_id', $menu->id)->with('stock')->get();

                foreach ($ingredients as $ingredient) {
                    $stock       = $ingredient->stock;
                    $needed      = $ingredient->qty_per_portion * $quantity;
                    $currentQty  = (float) $stock->qty;

                    if ($currentQty < $needed) {
                        DB::rollBack();
                        return response()->json([
                            'message' => "Stok '{$stock->name}' tidak cukup. " .
                                         "Dibutuhkan: {$needed} {$stock->unit}, " .
                                         "tersedia: {$currentQty} {$stock->unit}.",
                            'stock'   => $stock->name,
                            'needed'  => $needed,
                            'available' => $currentQty,
                        ], 422);
                    }

                    // kurangi stok
                    $stock->decrement('qty', $needed);
                }
            }

            $order->update([
                'status'      => 'confirmed',
                'approved_at' => now(),
            ]);

            // ── Generate jadwal kirim sesuai tanggal pemesanan ──
            if ($order->type === 'harian') {
                if (!$order->tanggal || !$order->duration) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'Tanggal mulai atau durasi pesanan harian belum diisi. Tidak bisa membuat jadwal kirim.',
                    ], 422);
                }

                $tanggalMulai = Carbon::parse($order->tanggal);
                $jumlahHari   = (int) $order->duration;

                for ($i = 0; $i < $jumlahHari; $i++) {
                    DeliverySchedule::create([
                        'order_id'      => $order->id,
                        'tanggal_kirim' => $tanggalMulai->copy()->addDays($i)->format('Y-m-d'),
                        'jam_kirim'     => $order->jam,
                        'status'        => 'scheduled',
                    ]);
                }
            } else {
                // insidentil
                if (!$order->event_date) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'Tanggal event pesanan insidentil belum diisi. Tidak bisa membuat jadwal kirim.',
                    ], 422);
                }

                DeliverySchedule::create([
                    'order_id'      => $order->id,
                    'tanggal_kirim' => $order->event_date,
                    'jam_kirim'     => $order->jam,
                    'status'        => 'scheduled',
                ]);
            }

            DB::commit();
            return response()->json([
                'message' => 'Pesanan disetujui, stok dikurangi, dan jadwal kirim dibuat.',
                'order'   => $order->fresh(['menu', 'kurir', 'deliverySchedules']),
            ]);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }

    /* PUT /owner/orders/{id}/reject */
    public function reject(Order $order): JsonResponse
    {
        if (!in_array($order->status, ['pending', 'confirmed'])) {
            return response()->json(['message' => 'Tidak bisa menolak pesanan ini.'], 422);
        }

        $order->update(['status' => 'cancelled']);
        return response()->json(['message' => 'Pesanan ditolak.']);
    }

    /* PUT /owner/orders/{id}/process */
    public function process(Request $request, Order $order): JsonResponse
    {
        $request->validate(['kurir_id' => 'required|exists:kurirs,id']);

        $order->update([
            'status'   => 'preparing',
            'kurir_id' => $request->kurir_id,
        ]);

        return response()->json(['message' => 'Pesanan sedang diproses.', 'order' => $order->fresh(['menu', 'kurir'])]);
    }

    /* PUT /owner/orders/{id}/send */
    public function send(Request $request, Order $order): JsonResponse
    {
        $estimasi = $request->input('estimasi', 20);

        $order->update([
            'status'         => 'dispatched',
            'estimasi_menit' => $estimasi,
        ]);

        return response()->json(['message' => 'Pesanan dikirim.', 'order' => $order->fresh(['menu', 'kurir'])]);
    }
}