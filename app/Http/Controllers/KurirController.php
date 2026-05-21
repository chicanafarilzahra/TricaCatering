<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

/**
 * Controller untuk role Kurir
 */
class KurirController extends Controller
{
    // =========================
    // 1️⃣ List order untuk kurir
    // =========================
    public function index()
    {
        // Semua order yang ditugaskan kurir dan status pending atau on_delivery
        $orders = Order::with('menu','client')
            ->whereIn('status', ['pending','on_delivery'])
            ->get();

        return response()->json($orders);
    }

    // =========================
    // 2️⃣ Detail order
    // =========================
    public function show(Order $order)
    {
        return response()->json($order->load('menu','client'));
    }

    // =========================
    // 3️⃣ Update status order (ambil/antar/selesai)
    // =========================
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:on_delivery,delivered',
        ]);

        $order->status = $request->status;
        $order->save();

        return response()->json($order);
    }

    // =========================
    // 4️⃣ Rute hari ini untuk Leaflet
    // =========================
    public function ruteHariIni()
    {
        $orders = Order::with('menu','client')
            ->where('status','on_delivery')
            ->get();

        return $orders->map(fn($o)=>[
            'order_id' => $o->id,
            'lat' => -7.765,          // bisa ganti sesuai data GPS
            'lng' => 112.936,
            'address' => $o->delivery_address
        ]);
    }

    // =========================
    // 5️⃣ Laporan kurir (order selesai)
    // =========================
    public function laporan()
    {
        $orders = Order::with('menu','client')
            ->where('status','delivered')
            ->get();

        return response()->json($orders);
    }
}