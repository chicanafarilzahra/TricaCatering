<?php

namespace App\Http\Controllers;

use App\Events\KurirLocationUpdated;
use App\Events\OrderDelivered;
use App\Models\Order;
use App\Models\TrackingLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KurirController extends Controller
{
    // ──────────────────────────────────────────────────────────
    // GET /api/kurir/orders
    // ──────────────────────────────────────────────────────────
    public function index(Request $request): JsonResponse
    {
        $kurir = $request->user();

        if ($kurir->role !== 'kurir') {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        // FIX: tambahkan relasi 'menu' — tanpa ini, frontend (o.menu?.name)
        // selalu null sehingga kolom "Pesanan" tampil "—" di panel kurir.
        $orders = Order::with(['client:id,name', 'courier:id,name', 'menu:id,name'])
            ->where('kurir_id', $kurir->id)
            ->orderBy('tanggal', 'asc')
            ->orderBy('jam', 'asc')
            ->get();

        return response()->json(['data' => $orders]);
    }

    // ──────────────────────────────────────────────────────────
    // GET /api/kurir/orders/{id}
    // ──────────────────────────────────────────────────────────
    public function show(Request $request, int $id): JsonResponse
    {
        $kurir = $request->user();

        // FIX: sama seperti index(), tambahkan relasi 'menu'.
        $order = Order::with(['client:id,name', 'courier:id,name', 'menu:id,name'])
            ->where('id', $id)
            ->where('kurir_id', $kurir->id)
            ->firstOrFail();

        return response()->json(['data' => $order]);
    }

    // ──────────────────────────────────────────────────────────
    // GET /api/kurir/rute
    // Order hari ini milik kurir — untuk halaman "Rute Hari Ini"
    // ──────────────────────────────────────────────────────────
    public function ruteHariIni(Request $request): JsonResponse
    {
        $kurir = $request->user();

        if ($kurir->role !== 'kurir') {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $orders = Order::with(['client:id,name,phone', 'owner:id,name,lat,lng'])
            ->where('kurir_id', $kurir->id)
            ->whereDate('tanggal', today())
            ->whereNotIn('status', ['delivered', 'cancelled'])
            ->orderBy('jam', 'asc')
            ->get()
            ->map(function (Order $order) {
                return [
                    'id'        => $order->id,
                    'status'    => $order->status,
                    'jam'       => $order->jam,
                    'tanggal'   => $order->tanggal,
                    'address'   => $order->address,
                    'lat_klien' => $order->lat,
                    'lng_klien' => $order->lng,
                    'lat_dapur' => $order->owner?->lat,
                    'lng_dapur' => $order->owner?->lng,
                    'klien'     => [
                        'name'  => $order->customer_name ?? $order->client?->name,
                        'phone' => $order->phone ?? $order->client?->phone,
                    ],
                ];
            });

        return response()->json(['data' => $orders]);
    }

    // ──────────────────────────────────────────────────────────
    // PUT /api/kurir/orders/{id}/update-status
    // dispatched → on_delivery → delivered
    // ──────────────────────────────────────────────────────────
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $kurir = $request->user();

        $validated = $request->validate([
            'status' => 'required|in:on_delivery,delivered',
        ]);

        $order = Order::where('id', $id)
            ->where('kurir_id', $kurir->id)
            ->firstOrFail();

        $allowedTransitions = [
            'dispatched'  => ['on_delivery'],
            'on_delivery' => ['delivered'],
        ];

        $allowed = $allowedTransitions[$order->status] ?? [];

        if (!in_array($validated['status'], $allowed)) {
            return response()->json([
                'message' => "Status tidak bisa diubah dari '{$order->status}' ke '{$validated['status']}'",
            ], 422);
        }

        $order->update(['status' => $validated['status']]);

        if ($validated['status'] === 'delivered') {
            broadcast(new OrderDelivered($order))->toOthers();
        }

        return response()->json([
            'message' => 'Status berhasil diperbarui',
            'data'    => ['status' => $order->status],
        ]);
    }

    // ──────────────────────────────────────────────────────────
    // POST /api/kurir/orders/{id}/location
    // Terima koordinat GPS dari watchPosition React
    // Dipanggil setiap ~5 detik saat kurir aktif bergerak
    // ──────────────────────────────────────────────────────────
    public function updateLocation(Request $request, int $id): JsonResponse
    {
        $kurir = $request->user();

        $validated = $request->validate([
            'latitude'  => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'accuracy'  => 'nullable|numeric|min:0',
        ]);

        $order = Order::where('id', $id)
            ->where('kurir_id', $kurir->id)
            ->whereIn('status', ['dispatched', 'on_delivery'])
            ->firstOrFail();

        // ── Throttle: simpan ke tracking_logs maks tiap 10 detik ──
        $shouldLog = is_null($order->last_location_at)
            || $order->last_location_at->diffInSeconds(now()) >= 10;

        if ($shouldLog) {
            TrackingLog::create([
                'order_id'    => $order->id,
                'kurir_id'    => $kurir->id,
                'latitude'    => $validated['latitude'],
                'longitude'   => $validated['longitude'],
                'accuracy'    => $validated['accuracy'] ?? null,
                'recorded_at' => now(),
            ]);
        }

        // ── Update cache koordinat di tabel orders ──────────────
        $order->update([
            'last_kurir_lat'   => $validated['latitude'],
            'last_kurir_lng'   => $validated['longitude'],
            'last_location_at' => now(),
            'status'           => $order->status === 'dispatched'
                                    ? 'on_delivery'
                                    : $order->status,
        ]);

        // ── Broadcast ke semua listener channel orders.{id} ─────
        broadcast(new KurirLocationUpdated(
            orderId:   $order->id,
            latitude:  (float) $validated['latitude'],
            longitude: (float) $validated['longitude'],
        ))->toOthers();

        return response()->json(['message' => 'Lokasi diperbarui'], 200);
    }
}