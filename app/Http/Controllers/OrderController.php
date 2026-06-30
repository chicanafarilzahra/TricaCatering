<?php

namespace App\Http\Controllers;

use App\Events\OrderDispatched;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // ──────────────────────────────────────────────────────────
    // GET /api/orders/{id}
    // Dipakai halaman klien untuk load data awal order +
    // posisi kurir terakhir (last_kurir_lat/lng)
    // ──────────────────────────────────────────────────────────
    public function show(Request $request, int $id): JsonResponse
    {
        $user  = $request->user();
        $order = Order::with([
            'courier:id,name,phone',
            'menu:id,name',
            'owner:id,name,lat,lng',
        ])->findOrFail($id);

        if ($user->role === 'klien' && $order->client_id !== $user->id) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        return response()->json([
            'data' => [
                'id'            => $order->id,
                'status'        => $order->status,
                'tanggal'       => $order->tanggal,
                'jam'           => $order->jam,
                'address'       => $order->address,
                'customer_name' => $order->customer_name,
                'phone'         => $order->phone,
                'type'          => $order->type,
                'quantity'      => $order->quantity,
                'notes'         => $order->notes,
                'total_price'   => $order->total_price,
                'courier_fee'   => $order->courier_fee,
                'menu'          => $order->menu?->name,
                'lat_klien'     => $order->lat,
                'lng_klien'     => $order->lng,
                'lat_dapur'     => $order->owner?->lat,
                'lng_dapur'     => $order->owner?->lng,
                'kurir_lat'     => $order->last_kurir_lat,
                'kurir_lng'     => $order->last_kurir_lng,
                'last_update'   => $order->last_location_at,
                'kurir' => $order->courier ? [
                    'name'  => $order->courier->name,
                    'phone' => $order->courier->phone,
                ] : null,
            ],
        ]);
    }

    // ──────────────────────────────────────────────────────────
    // PUT /api/orders/{id}/dispatch
    // Owner klik tombol "Kirim" → sistem PILIH KURIR OTOMATIS
    // via round-robin (tidak ada lagi assign manual), cairkan
    // ongkir ke wallet kurir, lalu broadcast.
    // ──────────────────────────────────────────────────────────
    public function dispatch(Request $request, int $id): JsonResponse
    {
        $owner = $request->user();
 
        if (!in_array($owner->role, ['owner', 'admin'])) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }
 
        $order = Order::findOrFail($id);
 
        if ($order->owner_id !== $owner->id && $owner->role !== 'admin') {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }
 
        // Hanya order yang sudah diproses (preparing) yang boleh dikirim
        if ($order->status !== 'preparing') {
            return response()->json([
                'message' => "Order status '{$order->status}' tidak bisa dikirim. "
                           . "Harus dalam status preparing terlebih dahulu.",
            ], 422);
        }
 
        $courier = $this->pickNextAvailableCourier($order->owner_id);
 
        if (!$courier) {
            return response()->json([
                'message' => 'Tidak ada kurir yang tersedia saat ini.',
            ], 422);
        }
 
        DB::transaction(function () use ($order, $courier) {
            $courierFee = (float) ($order->courier_fee ?? 0);
 
            if ($courierFee > 0) {
                $courierWallet = Wallet::firstOrCreate(['user_id' => $courier->id]);
                $courierWallet->credit(
                    amount: $courierFee,
                    category: 'courier_fee',
                    orderId: $order->id,
                    description: "Jasa kurir untuk pesanan #{$order->id}",
                );
            }
 
            $order->update([
                'status'   => 'dispatched',
                'kurir_id' => $courier->id,
                'courier_fee_dispatched'    => $courierFee > 0,
                'courier_fee_dispatched_at' => $courierFee > 0 ? now() : null,
            ]);
 
            // Kurir jadi tidak available sampai pesanan ini selesai diantar
            $courier->update(['is_available' => false]);
        });
 
        $order->refresh()->load('courier');
 
        // Broadcast langsung ke kurir & klien via WebSocket
        broadcast(new OrderDispatched($order));
 
        return response()->json([
            'message' => 'Order berhasil dikirim. Kurir sudah ditugaskan otomatis.',
            'data'    => [
                'order_id' => $order->id,
                'status'   => $order->status,
                'kurir'    => $order->courier->name,
            ],
        ]);
    }

    // ──────────────────────────────────────────────────────────
    // GET /api/kurir/list
    // Masih dipertahankan untuk keperluan lain (misal lihat
    // daftar kurir di dashboard owner), TIDAK dipakai lagi untuk
    // assign manual ke order.
    // ──────────────────────────────────────────────────────────
    public function kurirList(Request $request): JsonResponse
    {
        $owner = $request->user();

        if (!in_array($owner->role, ['owner', 'admin'])) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $kurirList = User::where('role', 'kurir')
            ->where('owner_id', $owner->id)
            ->select('id', 'name', 'phone', 'is_available')
            ->orderBy('name')
            ->get();

        return response()->json(['data' => $kurirList]);
    }

    public function ownerOrders(Request $request): JsonResponse
    {
        $owner = $request->user();

        if ($owner->role !== 'owner') {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $orders = Order::with([
            'client:id,name,phone',
            'courier:id,name,phone',
        ])
            ->where('owner_id', $owner->id)
            ->orderBy('tanggal', 'desc')
            ->orderBy('jam', 'desc')
            ->get();

        return response()->json(['data' => $orders]);
    }

    // ──────────────────────────────────────────────────────────
    // PUT /api/orders/{id}/approve
    // Owner approve order → uang harga menu cair ke wallet owner,
    // dan invoice dibuat otomatis (1 order = 1 invoice).
    // ──────────────────────────────────────────────────────────
    public function approve(Request $request, int $id): JsonResponse
    {
        $owner = $request->user();

        if (!in_array($owner->role, ['owner', 'admin'])) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $order = Order::findOrFail($id);

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Order bukan status pending'], 422);
        }

        $invoice = DB::transaction(function () use ($order) {
            $courierFee = (float) ($order->courier_fee ?? 0);
            $menuAmount = (float) $order->total_price - $courierFee;

            // 1. Uang menu cair ke wallet owner
            if ($menuAmount > 0) {
                $ownerWallet = Wallet::firstOrCreate(['user_id' => $order->owner_id]);
                $ownerWallet->credit(
                    amount: $menuAmount,
                    category: 'menu_payment',
                    orderId: $order->id,
                    description: "Pembayaran menu pesanan #{$order->id}",
                );
            }

            // 2. Generate invoice otomatis (kalau belum ada untuk order ini)
            $invoice = Invoice::firstOrCreate(
                ['order_id' => $order->id],
                [
                    'invoice_number' => $this->generateInvoiceNumber($order->id),
                    'client_id'      => $order->client_id,
                    'subtotal'       => $menuAmount,
                    'tax'            => 0,
                    'discount'       => 0,
                    'total_amount'   => (float) $order->total_price,
                    'status'         => 'pending',
                    'due_date'       => $order->event_date ?? $order->tanggal ?? null,
                ]
            );

            // 3. Order pindah status
            $order->update(['status' => 'confirmed']);

            return $invoice;
        });

        return response()->json([
            'message' => 'Order disetujui. Invoice dibuat dan saldo menu masuk ke wallet Anda.',
            'data'    => [
                'status'  => $order->status,
                'invoice' => $invoice,
            ],
        ]);
    }

    // PUT /api/orders/{id}/reject
    public function reject(Request $request, int $id): JsonResponse
    {
        $owner = $request->user();

        if (!in_array($owner->role, ['owner', 'admin'])) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $order = Order::findOrFail($id);

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Order bukan status pending'], 422);
        }

        $order->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'Order ditolak',
            'data'    => ['status' => $order->status],
        ]);
    }

    

    // ──────────────────────────────────────────────────────────
    // Pilih kurir selanjutnya secara round-robin, hanya dari
    // kurir yang role='kurir', owner_id=milik owner ini, dan
    // is_available=true. Urut berdasar id terkecil -> terbesar,
    // lanjut dari kurir terakhir yang dipakai owner ini.
    // ──────────────────────────────────────────────────────────
    private function pickNextAvailableCourier(int $ownerId): ?User
    {
        return DB::transaction(function () use ($ownerId) {
            $availableCouriers = User::where('owner_id', $ownerId)
                ->where('role', 'kurir')
                ->where('is_available', true)
                ->orderBy('id')
                ->lockForUpdate()
                ->get();

            if ($availableCouriers->isEmpty()) {
                return null;
            }

            $lastCourierId = Order::where('owner_id', $ownerId)
                ->whereNotNull('kurir_id')
                ->where('status', 'dispatched')
                ->orderByDesc('id')
                ->value('kurir_id');

            if (!$lastCourierId) {
                return $availableCouriers->first();
            }

            $next = $availableCouriers->first(fn ($c) => $c->id > $lastCourierId);

            return $next ?? $availableCouriers->first();
        });
    }

    private function generateInvoiceNumber(int $orderId): string
    {
        return 'INV-' . now()->format('Ym') . '-' . $orderId;
    }

    // OrderController.php
 public function process(Request $request, int $id): JsonResponse
    {
        $owner = $request->user();
 
        if (!in_array($owner->role, ['owner', 'admin'])) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }
 
        $order = Order::findOrFail($id);
 
        if ($order->owner_id !== $owner->id && $owner->role !== 'admin') {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }
 
        // Hanya order yang sudah confirmed yang boleh diproses
        if ($order->status !== 'confirmed') {
            return response()->json([
                'message' => "Order status '{$order->status}' tidak bisa diproses. "
                           . "Harus dalam status confirmed terlebih dahulu.",
            ], 422);
        }
 
        $order->update(['status' => 'preparing']);
 
        return response()->json([
            'message' => 'Pesanan sedang disiapkan.',
            'data'    => [
                'order_id' => $order->id,
                'status'   => $order->status,
            ],
        ]);
    }
}