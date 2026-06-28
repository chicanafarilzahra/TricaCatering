<?php

namespace App\Http\Controllers\Klien;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class GeoController extends Controller
{

   public function geocode(Request $request)
{
    $request->validate(['q' => 'required|string|min:5']);
    $original = trim($request->query('q'));
    $cacheKey = 'geocode_' . md5($original);

    $result = Cache::remember($cacheKey, now()->addDays(7), function () use ($original) {
        foreach ($this->buildFallbackQueries($original) as $query) {
            $hit = $this->callNominatim($query);
            if ($hit) return $hit;
        }
        return null;
    });

    if (!$result) {
        return response()->json(['found' => false]);
    }

    return response()->json(['found' => true] + $result);
}

private function buildFallbackQueries(string $address): array
{
    $queries = [$address];

    // 1. Hilangkan kode pos (5 digit di akhir)
    $noPostal = trim(preg_replace('/\s*\d{5}\s*$/', '', $address), " ,");
    if ($noPostal !== $address) $queries[] = $noPostal;

    // 2. Hilangkan "No.xxx" (nomor rumah)
    $noHouseNo = preg_replace('/\bNo\.?\s*\S+\b/i', '', $noPostal);
    $noHouseNo = trim(preg_replace('/\s{2,}/', ' ', $noHouseNo), " ,");
    $queries[] = $noHouseNo;

    // 3. Ambil 3 bagian terakhir saja (kelurahan, kecamatan, kota)
    $parts = array_map('trim', explode(',', $address));
    if (count($parts) >= 3) $queries[] = implode(', ', array_slice($parts, -3));
    if (count($parts) >= 2) $queries[] = implode(', ', array_slice($parts, -2));

    return array_values(array_unique(array_filter($queries)));
}

private function callNominatim(string $query): ?array
{
    $response = Http::withHeaders([
        'User-Agent' => 'AppCatering/1.0 (kontak@domainanda.com)',
    ])->get('https://nominatim.openstreetmap.org/search', [
        'q' => $query,
        'format' => 'jsonv2',
        'limit' => 1,
        'countrycodes' => 'id',
        'addressdetails' => 1,
    ]);

    if ($response->failed() || empty($response->json())) return null;

    $data = $response->json()[0];
    $type = $data['addresstype'] ?? $data['type'] ?? '';

    return [
        'lat' => (float) $data['lat'],
        'lng' => (float) $data['lon'],
        'display_name' => $data['display_name'] ?? null,
        // kasih tahu frontend apakah ini titik akurat atau cuma perkiraan area
        'precision' => in_array($type, ['house', 'building']) ? 'exact' : 'approx',
    ];
}    public function route(Request $request)
    {
        $request->validate([
            'from_lat' => 'required|numeric',
            'from_lng' => 'required|numeric',
            'to_lat'   => 'required|numeric',
            'to_lng'   => 'required|numeric',
        ]);

        $fromLat = $request->query('from_lat');
        $fromLng = $request->query('from_lng');
        $toLat   = $request->query('to_lat');
        $toLng   = $request->query('to_lng');

        try {
            $response = Http::timeout(5)->get(
                "https://router.project-osrm.org/route/v1/driving/{$fromLng},{$fromLat};{$toLng},{$toLat}",
                ['overview' => 'false']
            );

            if ($response->successful() && $response->json('code') === 'Ok') {
                $route = $response->json('routes.0');
                return response()->json([
                    'found' => true,
                    'distance_km' => round($route['distance'] / 1000, 2),
                    'duration_minute' => round($route['duration'] / 60),
                ]);
            }
        } catch (\Throwable $e) {
            // lanjut ke fallback di bawah
        }

        // Fallback: haversine + asumsi rata-rata 30km/jam dalam kota
        $distanceKm = $this->haversine($fromLat, $fromLng, $toLat, $toLng);
        return response()->json([
            'found' => true,
            'distance_km' => round($distanceKm, 2),
            'duration_minute' => round(($distanceKm / 30) * 60),
        ]);
    }

    private function haversine($lat1, $lng1, $lat2, $lng2)
    {
        $earthRadius = 6371;
        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);
        $a = sin($dLat / 2) ** 2 + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLng / 2) ** 2;
        return $earthRadius * (2 * atan2(sqrt($a), sqrt(1 - $a)));
    }
}