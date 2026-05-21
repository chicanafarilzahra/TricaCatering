<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{

    public function index()
    {
        return Order::latest()->get();
    }


    public function store(Request $request)
    {
        $request->validate([

            'client_id' =>
                'required',

            'package_id' =>
                'required',

            'total_price' =>
                'required',

            'delivery_date' =>
                'required',
        ]);

        $order = Order::create([

            'client_id' =>
                $request->client_id,

            'package_id' =>
                $request->package_id,

            'total_price' =>
                $request->total_price,

            'delivery_date' =>
                $request->delivery_date,

            'status' =>
                'pending',
        ]);

        return response()->json([
            'message' =>
                'Order berhasil dibuat',

            'data' => $order
        ]);
    }

   

    public function show($id)
    {
        return Order::findOrFail($id);
    }


    public function update(
        Request $request,
        $id
    ) {

        $order = Order::findOrFail($id);

        $order->update($request->all());

        return response()->json([
            'message' =>
                'Order berhasil diupdate',

            'data' => $order
        ]);
    }

    

    public function destroy($id)
    {
        Order::destroy($id);

        return response()->json([
            'message' =>
                'Order berhasil dihapus'
        ]);
    }


    public function approve($id)
    {
        $order = Order::findOrFail($id);

        $order->update([
            'status' => 'approved'
        ]);

        return response()->json([
            'message' =>
                'Order berhasil diapprove'
        ]);
    }


    public function reject($id)
    {
        $order = Order::findOrFail($id);

        $order->update([
            'status' => 'rejected'
        ]);

        return response()->json([
            'message' =>
                'Order berhasil direject'
        ]);
    }

   

    public function productions()
    {
        return Order::where(
            'status',
            'approved'
        )->get();
    }

    

    public function deliveries()
    {
        return Order::where(
            'status',
            'delivery'
        )->get();
    }

  

    public function reports()
    {
        return Order::latest()->get();
    }
}