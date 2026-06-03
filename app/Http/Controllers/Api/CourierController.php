<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourierLocation;
use Illuminate\Http\Request;

class CourierController extends Controller
{
    public function updateLocation(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
        ]);

        $location = CourierLocation::updateOrCreate(
            ['order_id' => $request->order_id],
            ['lat' => $request->lat, 'lng' => $request->lng]
        );

        return response()->json($location);
    }
}