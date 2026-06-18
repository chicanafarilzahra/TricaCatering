<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OwnerStockController extends Controller
{
    public function index()
{
    dd(Auth::id());
}

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'qty' => 'required|numeric',
            'unit' => 'required',
            'minimum_stock' => 'required|numeric',
        ]);

        $stock = Stock::create([
            'owner_id' => Auth::id(),
            'name' => $request->name,
            'qty' => $request->qty,
            'unit' => $request->unit,
            'minimum_stock' => $request->minimum_stock,
        ]);

        return response()->json($stock,201);
    }

    public function update(Request $request, int $id)
    {
        $stock = Stock::findOrFail($id);

        $stock->update([
            'name'=>$request->name,
            'qty'=>$request->qty,
            'unit'=>$request->unit,
            'minimum_stock'=>$request->minimum_stock,
        ]);

        return response()->json($stock);
    }

    public function destroy(int $id)
    {
        Stock::findOrFail($id)->delete();

        return response()->json([
            'message'=>'deleted'
        ]);
    }
}