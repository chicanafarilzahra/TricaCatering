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

public function store(Request $request)
{
    try {

        $validated = $request->validate([
            'client_id' => 'required',
            'customer_name' => 'required',
            'phone' => 'required',
            'menu_id' => 'required',
            'quantity' => 'required',
            'total_price' => 'required',
        ]);

        $order = Order::create([
            'client_id' => $request->client_id,
            'customer_name' => $request->customer_name,
            'phone' => $request->phone,

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
        'status' => 'Dikirim'
    ]);

    return response()->json([
        'message' => 'Order berhasil dikirim'
    ]);
}

public function ownerOrders(int $ownerId)
{
    $orders = Order::with('menu')
        ->whereHas('menu', function ($query) use ($ownerId) {
            $query->where('owner_id', $ownerId);
        })
        ->latest()
        ->get();

    return response()->json($orders);
}}