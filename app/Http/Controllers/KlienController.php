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
    $orders = Order::with('menu')
        ->latest()
        ->get();

    return response()->json($orders);
}
    /**
     * TRACKING PENGIRIMAN
     */
    public function lacakPengiriman()
{
    $orders = Order::with('menu')
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
        ->latest()
        ->get();

    return response()->json([
        'total_tagihan' => $orders->sum('total_price'),
        'data' => $orders
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
    $request->validate([
        'client_id' => 'required',
        'customer_name' => 'required|string',
        'phone' => 'required|string',

        'type' => 'required|in:harian,insidentil',
        'menu_id' => 'required|exists:menus,id',
        'quantity' => 'required|integer|min:1',

        'address' => 'required|string',
        'lat' => 'required|numeric',
        'lng' => 'required|numeric',

        'total_price' => 'required|numeric',
        'courier_fee' => 'required|numeric',
    ]);

    $order = Order::create([
        'client_id' => $request->client_id,
        'customer_name' => $request->customer_name,
        'phone' => $request->phone,
        'address' => $request->address,
        'order_date' => now()->format('Y-m-d'),

        'type' => $request->type,
        'menu_id' => $request->menu_id,
        'quantity' => $request->quantity,
        'duration' => $request->duration,
        'event_date' => $request->event_date,
        'theme' => $request->theme,
        'notes' => $request->notes,

        'lat' => $request->lat,
        'lng' => $request->lng,

        'total_price' => $request->total_price,
        'courier_fee' => $request->courier_fee,

        'status' => 'Pending',
    ]);

    return response()->json([
        'message' => 'Pesanan berhasil dibuat',
        'order' => $order
    ]);
}
}