<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{

   public function index()
{
    return Order::with('menu')
        ->latest()
        ->get();
}

public function ownerOrders()
{
    $ownerId = auth()->id();

    return Order::with('menu')
        ->where('owner_id', $ownerId)
        ->latest()
        ->get();
}

public function store(Request $request)
{
    try {

        $menu = \App\Models\Menu::findOrFail($request->menu_id);

        $order = Order::create([
            'client_id' => $request->client_id,
            'customer_name' => $request->customer_name,
            'phone' => $request->phone,

            'owner_id' => $menu->owner_id, // ✅ INI YANG PENTING

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

            'order_date' => now(),
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Order berhasil dibuat',
            'data' => $order
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error',
            'error' => $e->getMessage()
        ], 500);
    }
}
   public function show(int $id)
{
    return Order::findOrFail($id);
}

public function update(
    Request $request,
    int $id
)
{
    $order = Order::findOrFail($id);

    $order->update($request->all());

    return response()->json([
        'message' => 'Order berhasil diupdate',
        'data' => $order
    ]);
}

public function destroy(int $id)
{
    Order::destroy($id);

    return response()->json([
        'message' => 'Order berhasil dihapus'
    ]);
}

public function kirim(int $id)
{
    $order = Order::findOrFail($id);

    $order->update([
        'status' => 'on_delivery'
    ]);

    return response()->json([
        'message' => 'Order berhasil dikirim'
    ]);
}

public function approve(int $id)
{
    $order = Order::findOrFail($id);

    $order->update([
        'status' => 'approved'
    ]);

    return response()->json([
        'message' => 'Order approved',
        'data' => $order
    ]);
}

public function reject(int $id)
{
    $order = Order::findOrFail($id);

    $order->update([
        'status' => 'rejected'
    ]);

    return response()->json([
        'message' => 'Order rejected',
        'data' => $order
    ]);
}

public function process(int $id)
{
    $order = Order::findOrFail($id);

    $order->update([
        'status' => 'processed'
    ]);

    return response()->json([
        'message' => 'Order processed'
    ]);
}

public function send(int $id)
{
    $order = Order::findOrFail($id);

    $order->update([
        'status' => 'sent'
    ]);

    return response()->json([
        'message' => 'Order sent'
    ]);
}

public function productions()
{
    return Order::with('menu')
        ->whereIn('status', [
            'confirmed',
            'approved',
            'processed',
            'on_delivery',
            'delivered'
        ])
        ->latest()
        ->get()
        ->map(function ($order) {

            return [
                'id' => $order->id,

                'code' =>
                    'PROD-' . str_pad(
                        $order->id,
                        4,
                        '0',
                        STR_PAD_LEFT
                    ),

                'package' => $order->menu?->name,
                'quantity' => $order->quantity,
                'date' => $order->order_date,
                'status' => $order->status,
            ];
        });
}