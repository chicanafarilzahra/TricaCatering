<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class KlienController extends Controller
{
    /**
     * DASHBOARD HOME KLIEN
     */
    public function home()
    {
        $user = Auth::user();

        $orders = Order::with([
            'menu',
            'courier',
        ])
            ->where('client_id', $user->id)
            ->latest()
            ->get();

        $pesananAktif = $orders
            ->whereIn('status', [
                'pending',
                'confirmed',
                'on_delivery'
            ])->count();

        $estimasiTiba = optional(
            $orders->first()
        )->delivery_time;

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
     */
    public function pesananSaya()
    {
        $orders = Order::with([
            'menu',
            'courier',
        ])
            ->where('client_id', Auth::id())
            ->latest()
            ->get();

        return response()->json($orders);
    }

    /**
     * TRACKING PENGIRIMAN
     */
    public function lacakPengiriman()
    {
        $orders = Order::with([
            'courier',
            'menu',
        ])
            ->where('client_id', Auth::id())
            ->whereIn('status', [
                'on_delivery',
                'delivered'
            ])
            ->latest()
            ->get();

        return response()->json($orders);
    }

    /**
     * INVOICE
     */
    public function invoice()
    {
        $orders = Order::with('menu')
            ->where('client_id', Auth::id())
            ->latest()
            ->get();

        $totalTagihan = $orders->sum('total_price');

        return response()->json([
            'total_tagihan' => $totalTagihan,
            'data' => $orders,
        ]);
    }

    /**
     * ULASAN & KOMPLAIN
     */
    public function ulasan()
    {
        return response()->json([
            'message' => 'Halaman ulasan klien',
        ]);
    }

    public function storePesanan(Request $request)
{
    $user = Auth::user();

    $request->validate([
        'type' => 'required|in:harian,insidentil',
        'menu_id' => 'required|exists:menus,id',
        'quantity' => 'required|integer|min:1',
        'duration' => 'nullable|integer|min:1',
        'event_date' => 'nullable|date',
        'theme' => 'nullable|string',
        'notes' => 'nullable|string',
        'address' => 'required|string',
        'lat' => 'required|numeric',
        'lng' => 'required|numeric',
        'total_price' => 'required|numeric',
        'courier_fee' => 'required|numeric',
    ]);

    $order = Order::create([
        'client_id' => $user->id,
        'type' => $request->type,
        'menu_id' => $request->menu_id,
        'quantity' => $request->quantity,
        'duration' => $request->duration,
        'event_date' => $request->event_date,
        'theme' => $request->theme,
        'notes' => $request->notes,
        'address' => $request->address,
        'lat' => $request->lat,
        'lng' => $request->lng,
        'total_price' => $request->total_price,
        'courier_fee' => $request->courier_fee,
        'status' => 'pending',
    ]);

    return response()->json([
        'message' => 'Pesanan berhasil dibuat',
        'order' => $order,
    ]);
}

}