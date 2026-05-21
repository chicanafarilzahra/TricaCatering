<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * @method void middleware(string $name)
 */
class KlienController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('klien'); // role klien
    }

    public function index()
    {
        $user = Auth::user();
        $orders = Order::with('menu','kurir')
            ->where('client_id', $user->id)
            ->get();

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'menu_id'=>'required|exists:menus,id',
            'quantity'=>'required|integer|min:1',
            'delivery_address'=>'required|string'
        ]);

        $order = Order::create([
            'client_id'=>Auth::id(),
            'menu_id'=>$request->menu_id,
            'quantity'=>$request->quantity,
            'delivery_address'=>$request->delivery_address,
            'status'=>'pending'
        ]);

        return response()->json($order);
    }

    public function show(Order $order)
    {
        return response()->json([
            'order'=>$order->load('menu','kurir'),
            'lat'=>-7.765,
            'lng'=>112.936
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $order->update($request->only(['quantity','delivery_address']));
        return response()->json($order);
    }
}