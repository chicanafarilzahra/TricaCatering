<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
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
        $orders = Order::with(['menu', 'kurir', 'owner'])->latest()->get();
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
                    $stock      = $ingredient->stock;
                    $needed     = $ingredient->qty_per_portion * $quantity;
                    $currentQty = (float) $stock->qty;

                    if ($currentQty < $needed) {
                        DB::rollBack();
                        return response()->json([
                            'message' => "Stok '{$stock->name}' tidak cukup. " .
                                         "Dibutuhkan: {$needed} {$stock->unit}, " .
                                         "tersedia: {$currentQty} {$stock->unit}.",
                            'stock'     => $stock->name,
                            'needed'    => $needed,
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

    /* PUT /owner/orders/{id}/process — confirmed -> preparing, TANPA pilih kurir manual */
    public function process(Request $request, Order $order): JsonResponse
    {
        if ($order->status !== 'confirmed') {
            return response()->json(['message' => 'Pesanan tidak dalam status confirmed.'], 422);
        }

        $order->update(['status' => 'preparing']);

        return response()->json([
            'message' => 'Pesanan sedang diproses.',
            'order'   => $order->fresh(['menu', 'owner']),
        ]);
    }

    /* PUT /owner/orders/{id}/dispatch — preparing -> dispatched, KURIR DIPILIH OTOMATIS (round-robin) */
    public function dispatch(Request $request, Order $order): JsonResponse
    {
        if ($order->status !== 'preparing') {
            return response()->json(['message' => 'Pesanan belum siap dikirim.'], 422);
        }

        $ownerId = $order->owner_id;

        // semua user dengan role kurir, milik owner ini, urutan tetap (id ascending)
        $kurirIds = User::where('role', 'kurir')
            ->where('owner_id', $ownerId) // sesuaikan nama kolom ini kalau scoping kurir->owner kamu beda
            ->orderBy('id')
            ->pluck('id');

        if ($kurirIds->isEmpty()) {
            return response()->json(['message' => 'Belum ada kurir terdaftar untuk toko ini.'], 422);
        }

        // round-robin: lanjut dari kurir yang TERAKHIR dapat giliran dispatch dari owner ini
        $lastDispatched = Order::where('owner_id', $ownerId)
            ->whereNotNull('kurir_id')
            ->whereNotNull('dispatched_at')
            ->orderByDesc('dispatched_at')
            ->first();

        $nextIndex = 0;
        if ($lastDispatched && $kurirIds->contains($lastDispatched->kurir_id)) {
            $nextIndex = ($kurirIds->search($lastDispatched->kurir_id) + 1) % $kurirIds->count();
        }

        $order->update([
            'kurir_id'       => $kurirIds[$nextIndex],
            'status'         => 'dispatched',
            'dispatched_at'  => now(),
            'estimasi_menit' => $request->input('estimasi', 20),
        ]);

        $order->load('kurir');

        return response()->json([
            'message' => 'Pesanan dikirim.',
            'data'    => ['kurir' => $order->kurir->name],
        ]);
    }
}