<?php

namespace App\Http\Controllers;

use App\Events\OrderDispatched;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

        // Klien hanya bisa lihat order miliknya sendiri
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

                // Koordinat klien — dari kolom lat & lng di orders
                'lat_klien'     => $order->lat,
                'lng_klien'     => $order->lng,

                // Koordinat dapur — dari users.lat & users.lng milik owner
                'lat_dapur'     => $order->owner?->lat,
                'lng_dapur'     => $order->owner?->lng,

                // Posisi kurir terakhir — null jika belum berangkat
                // Ini yang langsung ditampilkan di peta saat klien buka halaman
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
    // Owner klik tombol "Kirim" → ubah status + broadcast
    //
    // Ganti semua pemanggilan lama di React:
    //   PUT /api/orders/{id}/send    → PUT /api/orders/{id}/dispatch
    //   PUT /api/orders/{id}/process → PUT /api/orders/{id}/dispatch
    // ──────────────────────────────────────────────────────────
    public function dispatch(Request $request, int $id): JsonResponse
    {
        $owner = $request->user();

        if (!in_array($owner->role, ['owner', 'admin'])) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $order = Order::with('courier')->findOrFail($id);

        // Guard: harus sudah ada kurir sebelum dispatch
        if (!$order->kurir_id) {
            return response()->json([
                'message' => 'Belum ada kurir yang ditugaskan ke order ini.',
            ], 422);
        }

        // Guard: hanya dari status confirmed atau preparing
        if (!in_array($order->status, [
            Order::STATUS_CONFIRMED,
            Order::STATUS_PREPARING,
        ])) {
            return response()->json([
                'message' => "Order status '{$order->status}' tidak bisa dikirim. "
                           . "Harus confirmed atau preparing terlebih dahulu.",
            ], 422);
        }

        $order->update(['status' => Order::STATUS_DISPATCHED]);

        // Broadcast langsung ke kurir & klien via WebSocket
        broadcast(new OrderDispatched($order));

        return response()->json([
            'message' => 'Order berhasil dikirim. Kurir sudah diberitahu.',
            'data'    => [
                'order_id' => $order->id,
                'status'   => $order->status,
                'kurir'    => $order->courier->name,
            ],
        ]);
    }

    // ──────────────────────────────────────────────────────────
    // PUT /api/orders/{id}/assign-kurir
    // Owner tugaskan kurir ke order sebelum dispatch
    // ──────────────────────────────────────────────────────────
    public function assignKurir(Request $request, int $id): JsonResponse
    {
        $owner = $request->user();

        if (!in_array($owner->role, ['owner', 'admin'])) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $validated = $request->validate([
            'kurir_id' => 'required|exists:users,id',
        ]);

        // Pastikan user yang dipilih memang role kurir
        $kurir = User::where('id', $validated['kurir_id'])
            ->where('role', 'kurir')
            ->firstOrFail();

        $order = Order::findOrFail($id);
        $order->update(['kurir_id' => $kurir->id]);

        return response()->json([
            'message' => "Kurir {$kurir->name} berhasil ditugaskan.",
            'data'    => [
                'kurir_id'   => $kurir->id,
                'kurir_name' => $kurir->name,
            ],
        ]);
    }

    // ──────────────────────────────────────────────────────────
    // GET /api/kurir/list
    // Fetch daftar kurir — untuk dropdown assign di halaman owner
    // ──────────────────────────────────────────────────────────
    public function kurirList(Request $request): JsonResponse
    {
        $owner = $request->user();

        if (!in_array($owner->role, ['owner', 'admin'])) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $kurirList = User::where('role', 'kurir')
            ->select('id', 'name', 'phone')
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
])        // ✅ users tidak punya phone, jadi tidak diambil
        ->where('owner_id', $owner->id)
        ->orderBy('tanggal', 'desc')
        ->orderBy('jam', 'desc')
        ->get();

    return response()->json(['data' => $orders]);
}
// PUT /api/orders/{id}/approve
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

    $order->update(['status' => 'confirmed']);

    return response()->json([
        'message' => 'Order disetujui',
        'data'    => ['status' => $order->status],
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
}