<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;

class TrackingController extends Controller
{
    public function show($order_id)
    {
        $order = Order::with([
            'menu',
            'client',
            'courier'
        ])->findOrFail($order_id);

        return response()->json([
            'id' => $order->id,

            'menu' => $order->menu?->name,
            'quantity' => $order->quantity,

            'status' => $order->status,

            'courier_name' => $order->courier?->name ?? 'Belum Ada Kurir',

            'distance_left' => $order->distance_left ?? 0,
            'estimated_time' => $order->estimated_time ?? '-',

            'courier_fee' => $order->courier_fee ?? 0,

            'catering' => [
                'lat' => $order->menu?->owner?->latitude,
                'lng' => $order->menu?->owner?->longitude,
            ],

            'courier' => [
                'lat' => $order->courier_lat,
                'lng' => $order->courier_lng,
            ],

            'client' => [
                'lat' => $order->lat,
                'lng' => $order->lng,
            ],
        ]);     
    }
}