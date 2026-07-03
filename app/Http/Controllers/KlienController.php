<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Ulasan;
use Illuminate\Support\Facades\Auth;

class KlienController extends Controller
{
    /**
     * DASHBOARD HOME KLIEN
     */
    public function home()
    {
        $user = Auth::user();

        $orders = Order::with(['menu', 'courier'])
            ->where('client_id', $user->id)
            ->latest()
            ->get();

        $pesananAktif = $orders->whereIn('status', [
            'pending',
            'confirmed',
            'on_delivery',
        ])->count();

        $estimasiTiba = optional($orders->first())->delivery_time;

        return response()->json([
            'user' => $user,
            'summary' => [
                'pesanan_aktif' => $pesananAktif,
                'estimasi_tiba' => $estimasiTiba ?? '-',
                'sisa_langganan' => 22,
            ],
            'orders' => $orders,
        ]);
    }

    /**
     * PESANAN SAYA
     *
     * PERBAIKAN:
     * 1. Filter where('client_id', $user->id) — tiap klien cuma lihat
     *    pesanannya sendiri.
     * 2. Response dibungkus { data: [...] } sesuai kontrak frontend
     *    (Tracking.jsx, PesananSaya.jsx membaca res.data.data).
     * 3. Eager-load 'courier' supaya nama kurir ikut terkirim.
     * 4. Eager-load 'owner' + tambahkan field lat_dapur/lng_dapur —
     *    dibutuhkan Tracking.jsx (resolveDapurPos) untuk menampilkan
     *    marker dapur catering & menggambar rute di peta. Tanpa ini,
     *    peta cuma menampilkan titik kurir tanpa rute/marker dapur.
     */
    public function pesananSaya()
    {
        $user = Auth::user();

        $orders = Order::with(['menu', 'courier', 'owner:id,name,nama_catering,latitude,longitude'])
            ->where('client_id', $user->id)
            ->latest()
            ->get()
            ->map(function ($order) {
                $order->lat_dapur = $order->owner?->latitude;
                $order->lng_dapur = $order->owner?->longitude;
                return $order;
            });

        return response()->json([
            'data' => $orders,
        ]);
    }

    /**
     * TRACKING PENGIRIMAN
     *
     * Sama seperti pesananSaya(): tambah filter client_id, status yang
     * relevan untuk tracking, dan eager-load 'owner' untuk marker dapur.
     */
    public function lacakPengiriman()
    {
        $user = Auth::user();

        $orders = Order::with(['menu', 'courier', 'owner:id,name,nama_catering,latitude,longitude'])
            ->where('client_id', $user->id)
            ->whereIn('status', [
                'confirmed',
                'preparing',
                'dispatched',
                'on_delivery',
                'delivered',
            ])
            ->latest()
            ->get()
            ->map(function ($order) {
                $order->lat_dapur = $order->owner?->latitude;
                $order->lng_dapur = $order->owner?->longitude;
                return $order;
            });

        return response()->json([
            'data' => $orders,
        ]);
    }

    /**
     * INVOICE
     */
    public function invoice()
    {
        $user = Auth::user();

        $orders = Order::with('menu')
            ->where('client_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'total_tagihan' => $orders->sum('total_price'),
            'data' => $orders,
        ]);
    }

    /**
     * ULASAN & KOMPLAIN
     *
     * Daftar ulasan yang sudah pernah dikirim klien, lengkap dengan
     * relasi pesanan + menu, supaya frontend bisa menampilkan nama
     * menu, gambar, dsb (item.pesanan.menu.name).
     */
    public function ulasan()
    {
        $user = Auth::user();

        $ulasan = Ulasan::with(['pesanan.menu'])
            ->where('client_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'data' => $ulasan,
        ]);
    }

    /**
     * PESANAN SELESAI (belum diulas)
     *
     * Pesanan milik klien berstatus 'delivered' yang belum punya
     * relasi ulasan sama sekali. Dipakai oleh halaman Riwayat Ulasan
     * untuk menampilkan tombol "Beri Rating & Ulasan".
     */
    public function pesananSelesai()
    {
        $user = Auth::user();

        $orders = Order::with('menu')
            ->where('client_id', $user->id)
            ->where('status', Order::STATUS_DELIVERED)
            ->whereDoesntHave('ulasan')
            ->latest()
            ->get();

        return response()->json([
            'data' => $orders,
        ]);
    }

    /**
     * SIMPAN ULASAN BARU
     *
     * pesanan_id dari frontend dipetakan ke kolom order_id.
     * Validasi: pesanan harus milik klien yang login, statusnya
     * delivered, dan belum pernah diulas (constraint unique di DB
     * juga jadi pengaman terakhir).
     */
    public function storeUlasan(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'pesanan_id' => 'required|exists:orders,id',
            'rating'     => 'required|integer|min:1|max:5',
            'komentar'   => 'nullable|string|max:300',
            'tags'       => 'nullable|array',
            'tags.*'     => 'string',
        ]);

        $order = Order::where('id', $validated['pesanan_id'])
            ->where('client_id', $user->id)
            ->first();

        if (!$order) {
            return response()->json([
                'message' => 'Pesanan tidak ditemukan.',
            ], 404);
        }

        if ($order->status !== Order::STATUS_DELIVERED) {
            return response()->json([
                'message' => 'Pesanan belum selesai, belum bisa diulas.',
            ], 422);
        }

        if (Ulasan::where('order_id', $order->id)->exists()) {
            return response()->json([
                'message' => 'Pesanan ini sudah pernah diulas.',
            ], 422);
        }

        $ulasan = Ulasan::create([
            'order_id'  => $order->id,
            'client_id' => $user->id,
            'rating'    => $validated['rating'],
            'komentar'  => $validated['komentar'] ?? null,
            'tags'      => $validated['tags'] ?? [],
        ]);

        return response()->json([
            'message' => 'Ulasan berhasil dikirim.',
            'data'    => $ulasan->load('pesanan.menu'),
        ], 201);
    }

    /**
     * UPDATE ULASAN
     */
    public function updateUlasan(Request $request, $id)
    {
        $user = Auth::user();

        $ulasan = Ulasan::where('id', $id)
            ->where('client_id', $user->id)
            ->first();

        if (!$ulasan) {
            return response()->json([
                'message' => 'Ulasan tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate([
            'rating'   => 'required|integer|min:1|max:5',
            'komentar' => 'nullable|string|max:300',
            'tags'     => 'nullable|array',
            'tags.*'   => 'string',
        ]);

        $ulasan->update([
            'rating'   => $validated['rating'],
            'komentar' => $validated['komentar'] ?? null,
            'tags'     => $validated['tags'] ?? [],
        ]);

        return response()->json([
            'message' => 'Ulasan berhasil diperbarui.',
            'data'    => $ulasan->load('pesanan.menu'),
        ]);
    }

    /**
     * HAPUS ULASAN
     */
    public function destroyUlasan($id)
    {
        $user = Auth::user();

        $ulasan = Ulasan::where('id', $id)
            ->where('client_id', $user->id)
            ->first();

        if (!$ulasan) {
            return response()->json([
                'message' => 'Ulasan tidak ditemukan.',
            ], 404);
        }

        $ulasan->delete();

        return response()->json([
            'message' => 'Ulasan berhasil dihapus.',
        ]);
    }

    public function storePesanan(Request $request)
    {
        $request->validate([
            'client_id'     => 'required',
            'owner_id'      => 'required|exists:users,id',
            'customer_name' => 'required|string',
            'phone'         => 'required|string',
            'type'          => 'required|in:harian,insidentil',
            'menu_id'       => 'required|exists:menus,id',
            'quantity'      => 'required|integer|min:1',
            'address'       => 'required|string',
            'lat'           => 'required|numeric',
            'lng'           => 'required|numeric',
            'total_price'   => 'required|numeric',
            'courier_fee'   => 'required|numeric',
            'duration'      => 'required_if:type,harian|nullable|integer|min:1',
            'event_date'    => 'required_if:type,insidentil|nullable|date',

            'tanggal'                => 'required_if:type,harian|nullable|date',
            'jam'                    => 'required|date_format:H:i',
            'payment_method'         => 'required|in:bank,ewallet',
            'payment_account_id'     => 'required|exists:payment_accounts,id',
            'payment_provider'       => 'nullable|string',
            'payment_account_number' => 'nullable|string',
            'payment_stage'          => 'required|in:lunas,dp_50',
            'amount_paid'            => 'required|numeric|min:0',
            'payment_proof'          => 'required|file|mimes:jpg,jpeg,png|max:5120',
        ]);

        $proofPath = $request->file('payment_proof')->store('payment_proofs', 'public');

        $order = Order::create([
            'client_id'     => $request->client_id,
            'owner_id'      => $request->owner_id,
            'customer_name' => $request->customer_name,
            'phone'         => $request->phone,
            'address'       => $request->address,
            'order_date'    => now()->format('Y-m-d'),
            'type'          => $request->type,
            'menu_id'       => $request->menu_id,
            'quantity'      => $request->quantity,
            'duration'      => $request->duration,
            'event_date'    => $request->event_date,
            'theme'         => $request->theme,
            'notes'         => $request->notes,
            'lat'           => $request->lat,
            'lng'           => $request->lng,
            'total_price'   => $request->total_price,
            'courier_fee'   => $request->courier_fee,
            'status'        => 'pending',

            'tanggal'                => $request->tanggal,
            'jam'                    => $request->jam,
            'payment_method'         => $request->payment_method,
            'payment_account_id'     => $request->payment_account_id,
            'payment_provider'       => $request->payment_provider,
            'payment_account_number' => $request->payment_account_number,
            'payment_stage'          => $request->payment_stage,
            'amount_paid'            => $request->amount_paid,
            'payment_proof'          => $proofPath,
            'paid_at'                => now(),
        ]);

        return response()->json([
            'message' => 'Pesanan & bukti pembayaran berhasil dikirim. Menunggu konfirmasi catering.',
            'order'   => $order,
        ]);
    }
}