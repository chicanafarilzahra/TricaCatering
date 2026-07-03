<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\TrackingLog;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    /**
     * Daftar order.
     * - owner  : melihat semua order miliknya (owner_id)
     * - client : melihat semua order yang ia buat (client_id)
     * - kurir  : melihat order yang ditugaskan padanya (kurir_id)
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        $query = Order::query()->with(['owner', 'client', 'courier', 'menu']);

        switch ($user->role) {
            case 'owner':
                $query->where('owner_id', $user->id);
                break;
            case 'client':
                $query->where('client_id', $user->id);
                break;
            case 'kurir':
                $query->where('kurir_id', $user->id);
                break;
            default:
                // admin / role lain: lihat semua
                break;
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $orders = $query->orderByDesc('created_at')->paginate($request->get('per_page', 15));

        return response()->json($orders);
    }

    /**
     * Detail satu order.
     */
    public function show(Order $order)
    {
        $this->authorizeAccess($order);

        $order->load(['owner', 'client', 'courier', 'menu', 'trackingLogs', 'deliverySchedules', 'ulasan']);

        return response()->json($order);
    }

    /**
     * Buat order baru.
     * Biasanya dibuat oleh client, tapi owner juga bisa membuatkan untuk client.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'owner_id'     => ['required', 'exists:users,id'],
            'client_id'    => ['nullable', 'exists:users,id'],
            'kurir_id'     => ['nullable', 'exists:users,id'],
            'customer_name'=> ['required', 'string', 'max:255'],
            'phone'        => ['required', 'string', 'max:20'],
            'address'      => ['required', 'string'],
            'order_date'   => ['required', 'date'],
            'total_price'  => ['required', 'numeric', 'min:0'],
            'status'       => ['nullable', Rule::in($this->statusList())],
            'type'         => ['required', 'string', 'max:50'],
            'menu_id'      => ['nullable', 'exists:menus,id'],
            'quantity'     => ['nullable', 'integer', 'min:1'],
            'duration'     => ['nullable', 'string', 'max:100'],
            'event_date'   => ['nullable', 'date'],
            'theme'        => ['nullable', 'string', 'max:255'],
            'notes'        => ['nullable', 'string'],
            'lat'          => ['nullable', 'numeric'],
            'lng'          => ['nullable', 'numeric'],
            'courier_fee'  => ['nullable', 'numeric', 'min:0'],
            'tanggal'      => ['nullable', 'date'],
            'jam'          => ['nullable', 'string'],
        ]);

        // Kalau client yang membuat order sendiri, paksa client_id = dirinya
        if ($user->role === 'client') {
            $validated['client_id'] = $user->id;
        }

        $validated['status'] = $validated['status'] ?? Order::STATUS_PENDING;

        $order = Order::create($validated);

        return response()->json([
            'message' => 'Order berhasil dibuat',
            'data'    => $order,
        ], 201);
    }

    /**
     * Update data order (data umum, bukan status/lokasi).
     */
    public function update(Request $request, Order $order)
    {
        $this->authorizeAccess($order, ['owner']);

        $validated = $request->validate([
            'customer_name' => ['sometimes', 'string', 'max:255'],
            'phone'         => ['sometimes', 'string', 'max:20'],
            'address'       => ['sometimes', 'string'],
            'order_date'    => ['sometimes', 'date'],
            'total_price'   => ['sometimes', 'numeric', 'min:0'],
            'type'          => ['sometimes', 'string', 'max:50'],
            'menu_id'       => ['nullable', 'exists:menus,id'],
            'quantity'      => ['nullable', 'integer', 'min:1'],
            'duration'      => ['nullable', 'string', 'max:100'],
            'event_date'    => ['nullable', 'date'],
            'theme'         => ['nullable', 'string', 'max:255'],
            'notes'         => ['nullable', 'string'],
            'lat'           => ['nullable', 'numeric'],
            'lng'           => ['nullable', 'numeric'],
            'courier_fee'   => ['nullable', 'numeric', 'min:0'],
            'tanggal'       => ['nullable', 'date'],
            'jam'           => ['nullable', 'string'],
            'kurir_id'      => ['nullable', 'exists:users,id'],
        ]);

        $order->update($validated);

        return response()->json([
            'message' => 'Order berhasil diperbarui',
            'data'    => $order,
        ]);
    }

    /**
     * Hapus order.
     */
    public function destroy(Order $order)
    {
        $this->authorizeAccess($order, ['owner']);

        $order->delete();

        return response()->json([
            'message' => 'Order berhasil dihapus',
        ]);
    }

    /**
     * Assign / ganti kurir untuk order (owner saja).
     */
    public function assignCourier(Request $request, Order $order)
    {
        $this->authorizeAccess($order, ['owner']);

        $validated = $request->validate([
            'kurir_id' => ['required', 'exists:users,id'],
        ]);

        $order->update([
            'kurir_id' => $validated['kurir_id'],
            'status'   => Order::STATUS_DISPATCHED,
        ]);

        return response()->json([
            'message' => 'Kurir berhasil ditugaskan',
            'data'    => $order,
        ]);
    }

    /**
     * Update status order (owner atau kurir, tergantung alur bisnis).
     */
    public function updateStatus(Request $request, Order $order)
    {
        $this->authorizeAccess($order, ['owner', 'kurir']);

        $validated = $request->validate([
            'status' => ['required', Rule::in($this->statusList())],
        ]);

        $order->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Status order berhasil diperbarui',
            'data'    => $order,
        ]);
    }

    /**
     * Kurir mengirim update lokasi terkini.
     * Menyimpan cache posisi terakhir di order + mencatat riwayat ke tracking_logs.
     */
    public function updateLocation(Request $request, Order $order)
    {
        $user = Auth::user();

        if ($user->role !== 'kurir' || $order->kurir_id !== $user->id) {
            return response()->json(['message' => 'Tidak diizinkan'], 403);
        }

        $validated = $request->validate([
            'lat' => ['required', 'numeric'],
            'lng' => ['required', 'numeric'],
        ]);

        DB::transaction(function () use ($order, $validated) {
            $order->update([
                'last_kurir_lat'   => $validated['lat'],
                'last_kurir_lng'   => $validated['lng'],
                'last_location_at' => now(),
            ]);

            TrackingLog::create([
                'order_id'   => $order->id,
                'kurir_id'   => $order->kurir_id,
                'lat'        => $validated['lat'],
                'lng'        => $validated['lng'],
                'recorded_at'=> now(),
            ]);
        });

        return response()->json([
            'message' => 'Lokasi berhasil diperbarui',
            'data'    => $order->only(['id', 'last_kurir_lat', 'last_kurir_lng', 'last_location_at']),
        ]);
    }

    /**
     * Daftar order yang sedang dalam proses pengantaran aktif.
     */
    public function activeDeliveries(Request $request)
    {
        $user = Auth::user();

        $query = Order::query()
            ->whereIn('status', [Order::STATUS_DISPATCHED, Order::STATUS_ON_DELIVERY]);

        if ($user->role === 'kurir') {
            $query->where('kurir_id', $user->id);
        } elseif ($user->role === 'owner') {
            $query->where('owner_id', $user->id);
        } elseif ($user->role === 'client') {
            $query->where('client_id', $user->id);
        }

        return response()->json($query->with(['courier', 'client'])->get());
    }

    /**
     * Helper: cek apakah user yang login berhak mengakses order ini.
     * $allowedRolesForWrite dipakai khusus untuk aksi tulis (update/delete/dll).
     */
    protected function authorizeAccess(Order $order, array $allowedRolesForWrite = [])
    {
        $user = Auth::user();

        $isOwner  = $order->owner_id === $user->id;
        $isClient = $order->client_id === $user->id;
        $isKurir  = $order->kurir_id === $user->id;

        abort_unless($isOwner || $isClient || $isKurir || $user->role === 'admin', 403, 'Tidak diizinkan mengakses order ini');

        if (!empty($allowedRolesForWrite)) {
            $roleMap = [
                'owner' => $isOwner,
                'client'=> $isClient,
                'kurir' => $isKurir,
            ];

            $allowed = collect($allowedRolesForWrite)->contains(fn ($role) => $roleMap[$role] ?? false)
                || $user->role === 'admin';

            abort_unless($allowed, 403, 'Tidak diizinkan melakukan aksi ini');
        }
    }

    /**
     * Daftar status valid, diambil dari konstanta di model Order.
     */
    protected function statusList(): array
    {
        return [
            Order::STATUS_PENDING,
            Order::STATUS_CONFIRMED,
            Order::STATUS_PREPARING,
            Order::STATUS_DISPATCHED,
            Order::STATUS_ON_DELIVERY,
            Order::STATUS_DELIVERED,
            Order::STATUS_CANCELLED,
        ];
    }
}