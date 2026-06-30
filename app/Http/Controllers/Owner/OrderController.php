<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\Stock;
use App\Models\MenuIngredient;
use App\Models\DeliverySchedule;
use App\Models\Invoice;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OrderController extends Controller
{
    /* GET /owner/orders */
    public function ownerOrders(): JsonResponse
    {
        $ownerId = auth()->id();

        $orders = Order::with(['menu', 'courier', 'owner'])
            ->where('owner_id', $ownerId)
            ->latest()
            ->get();

        return response()->json(['data' => $orders]);
    }

    /* PUT /owner/orders/{id}/approve
     *
     * 1. Ubah status → confirmed
     * 2. Kurangi stok bahan sesuai resep menu × qty pesanan
     * 3. Generate jadwal kirim (delivery_schedules) sesuai tanggal pemesanan
     * 4. Buat/ambil invoice untuk order ini, lalu cairkan uang ke wallet owner
     *    (revenue):
     *      - harian      -> lunas penuh, invoice langsung "paid"
     *      - insidentil  -> DP 50% otomatis "dp_paid", sisanya menyusul lewat
     *                       alur pelunasan klien (invoice_payments)
     * 5. Jika stok tidak cukup → rollback & return 422
     */
    public function approve(Request $request, int $id): JsonResponse
    {
        $order = Order::findOrFail($id);

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

            // ── Revenue: buat invoice & cairkan uang ke wallet owner ──
            $invoice = $this->generateInvoiceAndCreditRevenue($order);

            DB::commit();
            return response()->json([
                'message' => 'Pesanan disetujui, stok dikurangi, jadwal kirim dibuat, dan revenue diperbarui.',
                'order'   => $order->fresh(['menu', 'courier', 'deliverySchedules']),
                'invoice' => $invoice,
            ]);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Buat invoice (kalau belum ada) untuk order ini, lalu masukkan uang
     * ke wallet owner sesuai tipe pesanan.
     *   - harian      : lunas 100% langsung saat approve
     *   - insidentil  : DP 50% otomatis masuk saat approve, sisanya
     *                   menyusul lewat alur pelunasan klien di Invoice
     *                   Klien -> dikonfirmasi owner di halaman Revenue.
     */
    private function generateInvoiceAndCreditRevenue(Order $order): Invoice
    {
        $courierFee = (float) ($order->courier_fee ?? 0);
        $totalPrice = (float) ($order->total_price ?? 0);
        $menuAmount = max($totalPrice - $courierFee, 0);

        $isHarian = $order->type === 'harian';
        $dpAmount = $isHarian ? $totalPrice : round($totalPrice * 0.5, 2);

        $invoice = Invoice::firstOrCreate(
            ['order_id' => $order->id],
            [
                'invoice_number' => 'INV-' . now()->format('Ym') . '-' . $order->id,
                'client_id'      => $order->client_id,
                'subtotal'       => $menuAmount,
                'tax'            => 0,
                'discount'       => 0,
                'total_amount'   => $totalPrice,
                'dp_amount'      => 0,
                'status'         => 'unpaid',
                'due_date'       => $order->event_date ?? $order->tanggal ?? null,
            ]
        );

        // Kalau sebelumnya sudah pernah diproses (invoice sudah ada & sudah
        // tercatat dp/paid), jangan dobel kreditkan uang.
        if (in_array($invoice->status, ['dp_paid', 'paid'])) {
            return $invoice;
        }

        $creditAmount = $isHarian ? $menuAmount : round($menuAmount * 0.5, 2);

        if ($creditAmount > 0) {
            $ownerWallet = Wallet::firstOrCreate(['user_id' => $order->owner_id]);
            $ownerWallet->credit(
                amount: $creditAmount,
                category: $isHarian ? 'menu_payment' : 'dp_payment',
                orderId: $order->id,
                description: $isHarian
                    ? "Pembayaran lunas pesanan harian #{$order->id}"
                    : "DP 50% pesanan insidentil #{$order->id}",
            );
        }

        $invoice->update([
            'dp_amount' => $dpAmount,
            'status'    => $isHarian ? 'paid' : 'dp_paid',
            'paid_at'   => $isHarian ? now() : $invoice->paid_at,
        ]);

        return $invoice->fresh();
    }

    /* PUT /owner/orders/{id}/reject */
    public function reject(int $id): JsonResponse
    {
        $order = Order::findOrFail($id);

        if (!in_array($order->status, ['pending', 'confirmed'])) {
            return response()->json(['message' => 'Tidak bisa menolak pesanan ini.'], 422);
        }

        $order->update(['status' => 'cancelled']);

        // Kalau ada invoice nyangkut & belum dibayar, tandai gagal —
        // tidak ada uang yang masuk ke revenue.
        $invoice = Invoice::where('order_id', $order->id)->first();
        if ($invoice && !in_array($invoice->status, ['dp_paid', 'paid'])) {
            $invoice->update(['status' => 'cancelled']);
        }

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

        $kurirIds = User::where('role', 'kurir')
            ->where('owner_id', $ownerId)
            ->orderBy('id')
            ->pluck('id');

        if ($kurirIds->isEmpty()) {
            return response()->json(['message' => 'Belum ada kurir terdaftar untuk toko ini.'], 422);
        }

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

        $order->load('courier');

        return response()->json([
            'message' => 'Pesanan dikirim.',
            'data'    => ['kurir' => $order->courier->name],
            'order'   => $order,
        ]);
    }
}