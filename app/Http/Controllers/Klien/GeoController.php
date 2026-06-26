<?php

namespace App\Http\Controllers\Klien;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class GeoController extends Controller
{
    /**
     * Proxy geocoding ke Nominatim.
     * GET /klien/geocode?q=alamat
     */
    public function geocode(Request $request)
    {
        $query = trim($request->query('q', ''));

        if ($query === '' || strlen($query) < 3) {
            return response()->json(['found' => false, 'message' => 'Query terlalu pendek'], 422);
        }

        // Cache 1 jam per query, biar gak spam Nominatim untuk alamat yang sama
        $cacheKey = 'geocode:' . md5(strtolower($query));

        $result = Cache::remember($cacheKey, now()->addHour(), function () use ($query) {
            $response = Http::withHeaders([
                    // Wajib: Nominatim usage policy mensyaratkan User-Agent yang jelas
                    'User-Agent' => 'TricaCatering/1.0 (contact: admin@tricacatering.test)',
                    'Accept-Language' => 'id',
                ])
                ->timeout(8)
                ->get('https://nominatim.openstreetmap.org/search', [
                    'format' => 'json',
                    'limit' => 1,
                    'countrycodes' => 'id',
                    'q' => $query,
                ]);

            if (!$response->successful()) {
                return null;
            }

            $data = $response->json();

            if (empty($data) || !isset($data[0])) {
                return null;
            }

            return [
                'lat' => (float) $data[0]['lat'],
                'lng' => (float) $data[0]['lon'],
                'display_name' => $data[0]['display_name'] ?? $query,
            ];
        });

        if (!$result) {
            return response()->json(['found' => false, 'message' => 'Alamat tidak ditemukan'], 404);
        }

        return response()->json(['found' => true] + $result);
    }

    /**
     * Proxy hitung rute ke OSRM (driving distance + duration).
     * GET /klien/route?from_lat=&from_lng=&to_lat=&to_lng=
     */
    public function route(Request $request)
    {
        $request->validate([
            'from_lat' => 'required|numeric',
            'from_lng' => 'required|numeric',
            'to_lat' => 'required|numeric',
            'to_lng' => 'required|numeric',
        ]);

        $start = $request->query('from_lng') . ',' . $request->query('from_lat');
        $end = $request->query('to_lng') . ',' . $request->query('to_lat');

        $response = Http::timeout(8)
            ->get("https://router.project-osrm.org/route/v1/driving/{$start};{$end}", [
                'overview' => 'false',
            ]);

        if (!$response->successful()) {
            return response()->json(['found' => false, 'message' => 'Gagal menghitung rute'], 502);
        }

        $data = $response->json();

        if (empty($data['routes'])) {
            return response()->json(['found' => false, 'message' => 'Rute tidak ditemukan'], 404);
        }

        return response()->json([
            'found' => true,
            'distance_km' => $data['routes'][0]['distance'] / 1000,
            'duration_minute' => round($data['routes'][0]['duration'] / 60),
        ]);
    }
}