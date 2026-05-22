<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use App\Models\User;

use App\Http\Controllers\AdminMenuController;
use App\Http\Controllers\AdminClientController;
use App\Http\Controllers\AdminStockController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\OrderController;

use App\Http\Controllers\KurirController;
use App\Http\Controllers\KlienController;

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
    ]);

    $user = User::create([
        'name' =>
            $request->name,

        'email' =>
            $request->email,

        'password' =>
            Hash::make(
                $request->password
            ),

        'role' =>
            $request->role,
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

/*
|--------------------------------------------------------------------------
| KURIR
|--------------------------------------------------------------------------
*/

// Daftar semua orders
Route::get('kurir/orders', [KurirController::class, 'index']);

// Detail order tertentu
Route::get('kurir/orders/{id}', [KurirController::class, 'show']);

// Update status order
Route::put('kurir/orders/{id}/update-status', [KurirController::class, 'updateStatus']);

// Rute kurir hari ini
Route::get('kurir/rute', [KurirController::class, 'ruteHariIni']);

// Laporan kurir
Route::get('kurir/laporan', [KurirController::class, 'laporan']);

// Tambahkan route baru untuk menyimpan laporan harian
Route::post('kurir/laporan', [KurirController::class, 'storeLaporan']);
/*
|--------------------------------------------------------------------------
| KLIEN
|--------------------------------------------------------------------------
*/

Route::middleware([
    'auth:sanctum',
    'klien'
])->group(function () {

    Route::apiResource(
        'klien/orders',
        KlienController::class
    );

});

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