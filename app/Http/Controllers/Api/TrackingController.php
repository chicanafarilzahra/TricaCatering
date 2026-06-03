<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class TrackingController extends Controller
{
    public function show()
    {
        return response()->json([
            "menu" => "Nasi Ayam Geprek",
            "courier_name" => "Kurir ABC",
            "distance_left" => 2.3,
            "estimated_time" => "11:30 WIB",
            "courier_fee" => 10000,
            "status" => "on_delivery",
            "catering" => [
                "lat" => -7.284905,
                "lng" => 112.739792
            ],
            "courier" => [
                "lat" => -7.295000,
                "lng" => 112.741000
            ],
            "client" => [
                "lat" => -7.301000,
                "lng" => 112.748000
            ]
        ]);
    }
}