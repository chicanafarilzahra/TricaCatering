<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

use App\Models\User;

use App\Http\Controllers\AdminMenuController;
use App\Http\Controllers\AdminClientController;
use App\Http\Controllers\AdminStockController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\OrderController;

use App\Http\Controllers\KurirController;
use App\Http\Controllers\LaporanHarianController;
use App\Http\Controllers\KlienController;
use App\Http\Controllers\Api\CourierController;
use App\Http\Controllers\Api\TrackingController;

use App\Http\Controllers\Api\OwnerMenuController;

use App\Http\Controllers\SPPG\DashboardSPPGController;
use App\Http\Controllers\SPPG\MenuHarianController;
use App\Http\Controllers\SPPG\SekolahController;

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/

Route::post('/login', function (Request $request) {

    $user = User::where(
        'email',
        $request->email
    )->first();

    if (
        !$user ||
        !Hash::check(
            $request->password,
            $user->password
        )
    ) {
        return response()->json([
            'message' =>
                'Email atau password salah'
        ], 401);
    }

    if ($user->status === 'pending') {

    return response()->json([
        'message' =>
            'Akun Anda masih menunggu validasi admin'
    ], 403);

}

if ($user->status === 'rejected') {

    return response()->json([
        'message' =>
            'Pendaftaran Anda ditolak admin'
    ], 403);

}

    $token = $user
        ->createToken('auth-token')
        ->plainTextToken;

    return response()->json([
        'token' => $token,
        'user' => $user,
    ]);
});

Route::post('/register', function (Request $request) {

    $request->validate([

    'name' =>
        'required|string|max:255',

    'email' =>
        'required|email|unique:users,email',

    'password' =>
        'required|string|min:6|confirmed',

    'role' =>
        'required|in:owner,klien,kurir,operator_sppg',

    'nama_catering' =>
        'nullable|string|max:255',

    'alamat_catering' =>
        'nullable|string',

    'nama_sppg' =>
        'nullable|string|max:255',

    'alamat_sppg' =>
        'nullable|string',
]);

    $status = in_array(
        $request->role,
        ['owner', 'kurir', 'operator_sppg']
    )
        ? 'pending'
        : 'approved';

    $latitude = null;
$longitude = null;

if (
    $request->role === 'owner' &&
    !empty($request->alamat_catering)
) {

    try {

        $response = Http::withHeaders([
            'User-Agent' => 'WebCatering'
        ])->get(
            'https://nominatim.openstreetmap.org/search',
            [
                'q' => $request->alamat_catering,
                'format' => 'json',
                'limit' => 1,
            ]
        );

        $location = $response->json();

        if (!empty($location)) {

            $latitude =
                $location[0]['lat'];

            $longitude =
                $location[0]['lon'];
        }

    } catch (\Exception $e) {

        $latitude = null;
        $longitude = null;

    }
}

$user = User::create([
    'name' => $request->name,
    'email' => $request->email,
    'password' => Hash::make(
        $request->password
    ),
    'role' => $request->role,
    'nama_catering' =>
        $request->nama_catering,
   'alamat_catering' =>
        $request->alamat_catering,

        'latitude' => $latitude,
        'longitude' => $longitude,

'status' => $status,
    
    'nama_sppg' =>
        $request->nama_sppg,

    'alamat_sppg' =>
        $request->alamat_sppg,
]);
    return response()->json([
        'message' =>
            'Register berhasil',

        'user' => $user,
    ]);
});

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

Route::apiResource(
    'menus',
    AdminMenuController::class
);

Route::apiResource(
    'clients',
    AdminClientController::class
);

Route::apiResource(
    'customers',
    AdminClientController::class
);

Route::apiResource(
    'stocks',
    AdminStockController::class
);

Route::apiResource(
    'packages',
    PackageController::class
);

Route::apiResource(
    'orders',
    OrderController::class
);

Route::put(
    '/orders/{id}/approve',
    [OrderController::class, 'approve']
);

Route::put(
    '/orders/{id}/reject',
    [OrderController::class, 'reject']
);

Route::get(
    '/productions',
    [OrderController::class, 'productions']
);

Route::get(
    '/deliveries',
    [OrderController::class, 'deliveries']
);

Route::get(
    '/reports',
    [OrderController::class, 'reports']
);

Route::get(
    '/users',
    [AdminUserController::class, 'index']
);

Route::put(
    '/users/{id}/approve',
    [AdminUserController::class, 'approve']
);

Route::put(
    '/users/{id}/reject',
    [AdminUserController::class, 'reject']
);
/*
|--------------------------------------------------------------------------
| KURIR
|--------------------------------------------------------------------------
*/

Route::get(
    'kurir/orders',
    [KurirController::class, 'index']
);

Route::get(
    'kurir/orders/{id}',
    [KurirController::class, 'show']
);

Route::put(
    'kurir/orders/{id}/update-status',
    [KurirController::class, 'updateStatus']
);

Route::get(
    'kurir/rute',
    [KurirController::class, 'ruteHariIni']
);

Route::get('/kurir/laporan_harian', [LaporanHarianController::class, 'index']);
Route::post('/kurir/laporan_harian', [LaporanHarianController::class, 'store']);

/*
|--------------------------------------------------------------------------
| KLIEN
|--------------------------------------------------------------------------
*/

Route::get(
    'klien',
    [KlienController::class, 'home']
);

Route::get(
    'klien/pesanan',
    [KlienController::class, 'pesananSaya']
);

Route::get(
    'klien/lacak-pengiriman',
    [KlienController::class, 'lacakPengiriman']
);

Route::get(
    'klien/invoice',
    [KlienController::class, 'invoice']
);

Route::get(
    'klien/ulasan',
    [KlienController::class, 'ulasan']
);

Route::get(
    'klien/pesan',
    [KlienController::class, 'PesanMakan']
);

Route::get('/klien/menus', function () {

    return \App\Models\Menu::with('owner')
        ->where('is_active', true)
        ->get()
        ->map(function ($menu) {

            return [

                'id' => $menu->id,

                'name' => $menu->name,

                'description' => $menu->description,

                'price' => $menu->price,

                'image' => $menu->image,

                // kategori menu
                'category' => $menu->jenis_catering,

                // data owner
                'owner' => $menu->owner?->nama_catering,

                'ownerAddress' => $menu->owner?->alamat_catering,

                'cateringLat' => $menu->owner?->latitude,

                'cateringLng' => $menu->owner?->longitude,

            ];

        });

});

Route::post('klien/orders', [KlienController::class, 'storePesanan']);
Route::get('klien/orders', [KlienController::class, 'pesananSaya']); // histori
Route::post('/kurir/update-lokasi', [CourierController::class, 'updateLocation']);
Route::get('/klien/lacak/{order_id}', [TrackingController::class, 'show']);


/*
|--------------------------------------------------------------------------
| OWNER MENU MANAGEMENT
|--------------------------------------------------------------------------
*/

Route::prefix('owner')->group(function () {

    Route::get(
        '/menus',
        [OwnerMenuController::class, 'index']
    );

    Route::post(
        '/menus',
        [OwnerMenuController::class, 'store']
    );

    Route::put(
        '/menus/{id}',
        [OwnerMenuController::class, 'update']
    );

    Route::delete(
        '/menus/{id}',
        [OwnerMenuController::class, 'destroy']
    );

/*
|--------------------------------------------------------------------------
| SPPG
|--------------------------------------------------------------------------
*/

    Route::prefix('sppg')->group(function () {

    Route::get(
        '/dashboard',
        [DashboardSPPGController::class, 'index']
    );

    Route::get(
        '/menus',
        [MenuHarianController::class, 'index']
    );

    Route::get(
        '/sekolah',
        [SekolahController::class, 'index']
    );
});

});