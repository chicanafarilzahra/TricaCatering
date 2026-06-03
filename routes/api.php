<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
]);

    $status =
    $request->role === 'klien'
        ? 'approved'
        : 'pending';

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
    'status' => $status,
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

});