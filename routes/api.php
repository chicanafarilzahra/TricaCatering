<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\User;

use App\Http\Controllers\AdminMenuController;
use App\Http\Controllers\AdminClientController;
use App\Http\Controllers\AdminStockController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\Admin\AdminInvoiceController;
use App\Http\Controllers\AdminDistribusiController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\OrderController;

use App\Http\Controllers\KurirController;
use App\Http\Controllers\LaporanHarianController;
use App\Http\Controllers\KlienController;
use App\Http\Controllers\Api\CourierController;
use App\Http\Controllers\Api\TrackingController;
use App\Http\Controllers\Klien\InvoiceKlienController;
use App\Http\Controllers\Klien\GeoController;

use App\Http\Controllers\Kurir\KurirOrderController;
use App\Http\Controllers\Kurir\KurirDistribusiController;
 

use App\Http\Controllers\Api\OwnerMenuController;
use App\Http\Controllers\Owner\MenuController as OwnerMenuController2;
use App\Http\Controllers\Api\OwnerStockController;
use App\Http\Controllers\Api\OwnerPaymentAccountController;
use App\Http\Controllers\Api\PublicMenuController;

use App\Http\Controllers\Owner\CourierController as OwnerCourierController;
use App\Http\Controllers\Owner\OrderController as OwnerOrderController;
use App\Http\Controllers\Owner\RevenueController as OwnerRevenueController;
use App\Http\Controllers\Owner\OwnerInvoiceController;
use App\Http\Controllers\Owner\OwnerAnalyticsController;

use App\Http\Controllers\SPPG\DashboardSPPGController;
use App\Http\Controllers\SPPG\MenuHarianController;
use App\Http\Controllers\SPPG\SekolahController;
use App\Http\Controllers\SPPG\SppgMenuController;
use App\Http\Controllers\SPPG\DistribusiController;
use App\Http\Controllers\SPPG\StocksSPPGController;
use App\Http\Controllers\SPPG\RiwayatSPPGController;
use App\Http\Controllers\SPPG\LaporanSPPGController;
use App\Http\Controllers\SPPG\KurirSppgController;

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

    if (
    $user->role != 'admin' &&
    $user->status == 'pending'
) {

    return response()->json([
        'message' =>
            'Akun Anda masih menunggu validasi admin'
    ], 403);

}

if (
    $user->role != 'admin' &&
    $user->status == 'rejected'
) {

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
 
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:6|confirmed',
        'role' => 'required|in:owner,klien,kurir,operator_sppg',
 
        'phone' => 'required_if:role,kurir|nullable|string|max:20',
 
        'nama_catering' => 'nullable|string|max:255',
        'alamat_catering' => 'nullable|string',
        'nama_sppg' => 'nullable|string|max:255',
        'alamat_sppg' => 'nullable|string',
 
        'latitude' => 'nullable|numeric',
        'longitude' => 'nullable|numeric',
 
        // ── Kurir: pilih daftar ke catering atau ke SPPG ──
        'kurir_type'  => 'required_if:role,kurir|nullable|in:catering,sppg',
        'employer_id' => 'required_if:role,kurir|nullable|integer',
    ]);
 
    $status = in_array($request->role, ['owner', 'kurir', 'operator_sppg'])
        ? 'pending'
        : 'approved';
 
    $latitude = null;
    $longitude = null;
 
    if ($request->role === 'owner') {
        $latitude = $request->latitude;
        $longitude = $request->longitude;
 
        Log::info('Latitude: ' . $latitude);
        Log::info('Longitude: ' . $longitude);
    }
 
    $ownerId           = null;
    $sppgId            = null;
    $namaTempatKurir   = null;
    $alamatTempatKurir = null;
 
    if ($request->role === 'kurir') {
 
        if ($request->kurir_type === 'catering') {
 
            $employer = User::where('role', 'owner')
                ->where('status', 'approved')
                ->find($request->employer_id);
 
            if (!$employer) {
                return response()->json([
                    'message' => 'Catering yang dipilih tidak ditemukan'
                ], 422);
            }
 
            $ownerId           = $employer->id;
            $namaTempatKurir   = $employer->nama_catering;
            $alamatTempatKurir = $employer->alamat_catering;
 
        } else { // kurir_type === 'sppg'
 
            $employer = User::where('role', 'operator_sppg')
                ->where('status', 'approved')
                ->find($request->employer_id);
 
            if (!$employer) {
                return response()->json([
                    'message' => 'SPPG yang dipilih tidak ditemukan'
                ], 422);
            }
 
            $sppgId            = $employer->id;
            $namaTempatKurir   = $employer->nama_sppg;
            $alamatTempatKurir = $employer->alamat_sppg;
        }
    }
 
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => $request->role,
 
        'phone' => $request->phone,
 
        'nama_catering' => $request->nama_catering,
        'alamat_catering' => $request->alamat_catering,
 
        'owner_id' => $ownerId,
        'sppg_id'  => $sppgId,
 
        'nama_tempat_kurir' => $namaTempatKurir,
        'alamat_tempat_kurir' => $alamatTempatKurir,
 
        'nama_sppg' => $request->nama_sppg,
        'alamat_sppg' => $request->alamat_sppg,
 
        'latitude' => $latitude,
        'longitude' => $longitude,
 
        'status' => $status,
    ]);
 
    // jika status approved, buat token otomatis untuk auto-login
    $token = null;
    if ($status === 'approved') {
        $token = $user->createToken('auth-token')->plainTextToken;
    }
 
    return response()->json([
        'message' => 'Register berhasil',
        'user' => $user,
        'token' => $token, // token null jika pending/rejected
    ]);
});
    Route::get('/owners/list', function () {
    return User::where('role', 'owner')
        ->where('status', 'approved')
        ->select('id', 'nama_catering', 'alamat_catering')
        ->get();
});

Route::get('/sppgs/list', function () {
    return User::where('role', 'operator_sppg')
        ->where('status', 'approved')
        ->select('id', 'nama_sppg', 'alamat_sppg')
        ->get();
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

Route::get(
        '/stocks/owner/{id}',
        [AdminStockController::class, 'detailOwner']
    );

    Route::get(
        '/stocks/sppg/{id}',
        [AdminStockController::class, 'detailSPPG']
    );

    Route::get('/admin/distribusis', [AdminDistribusiController::class, 'index']);

Route::apiResource(
    'packages',
    PackageController::class
);

Route::apiResource(
    'orders',
    OrderController::class
);

Route::put('/orders/{id}/approve',  [OrderController::class, 'approve'])->middleware('auth:sanctum');
Route::put('/orders/{id}/reject',   [OrderController::class, 'reject'])->middleware('auth:sanctum');
Route::put('/orders/{id}/kirim',    [OrderController::class, 'kirim'])->middleware('auth:sanctum');
Route::put('/orders/{id}/dispatch', [OrderController::class, 'dispatch'])->middleware('auth:sanctum');

    Route::get('/productions', [OrderController::class, 'productions']);
    Route::get('/deliveries',  [OrderController::class, 'deliveries']);
    Route::get('/reports',     [OrderController::class, 'reports']);

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

Route::delete(
    '/users/{id}',
    [AdminUserController::class, 'destroy']
);

Route::get('/admin/invoices', [AdminInvoiceController::class, 'index'])->middleware('auth:sanctum');
Route::get('/admin/invoices/{id}', [AdminInvoiceController::class, 'show'])->middleware('auth:sanctum');

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/owner/couriers', [OwnerCourierController::class, 'index']);
});

/*
|--------------------------------------------------------------------------
| KURIR
|--------------------------------------------------------------------------
*/

// Endpoint khusus kurir (panel "Jadwal Pengiriman", "Rute Hari Ini", update status & lokasi GPS)
Route::middleware('auth:sanctum')
    ->prefix('kurir')
    ->group(function () {
        Route::get('/orders', [KurirController::class, 'index']);
        Route::get('/orders/{id}', [KurirController::class, 'show']);
        Route::get('/rute', [KurirController::class, 'ruteHariIni']);
        Route::put('/orders/{id}/update-status', [KurirController::class, 'updateStatus']);
        Route::post('/orders/{id}/location', [KurirController::class, 'updateLocation']);

        // ── Laporan Harian ──
        Route::get('/laporan_harian', [LaporanHarianController::class, 'index']);
        Route::post('/laporan_harian', [LaporanHarianController::class, 'store']);

        Route::get('/distribusi',      [KurirDistribusiController::class, 'index']);
        Route::get('/distribusi/rute', [KurirDistribusiController::class, 'rute']);
        Route::put('/distribusi/{id}/mulai-antar', [KurirDistribusiController::class, 'mulaiAntar']);
        Route::put('/distribusi/{id}/selesai',     [KurirDistribusiController::class, 'selesai']);
    });

Route::get('/klien/menus', function () {
 
    return \App\Models\Menu::with('owner.paymentAccounts')
        ->where('is_active', true)
        ->get()
        ->map(function ($menu) {
 
            return [
 
                'id' => $menu->id,
                'name' => $menu->name,
                'description' => $menu->description,
                'price' => $menu->price,
                'image' => $menu->image,
 
                'category'  => $menu->jenis_catering,
                'min_porsi' => $menu->min_pax,
 
                // PENTING: dibutuhkan saat submit pesanan
                'catering_id' => $menu->owner_id,
 
                'owner' => $menu->owner?->nama_catering,
                'ownerAddress' => $menu->owner?->alamat_catering,
                'cateringLat' => $menu->owner?->latitude,
                'cateringLng' => $menu->owner?->longitude,
 
                // PENTING: ini yang ditampilkan di form pemesanan klien
                'payment_accounts' => $menu->owner?->paymentAccounts->map(function ($acc) {
                    return [
                        'id' => $acc->id,
                        'type' => $acc->type,
                        'provider_name' => $acc->provider_name,
                        'account_number' => $acc->account_number,
                        'account_name' => $acc->account_name,
                        'is_default' => $acc->is_default,
                    ];
                }) ?? [],
 
            ];
 
        });
 
});
 
Route::middleware('auth:sanctum')->group(function () {
 
    Route::get('klien',                    [KlienController::class, 'home']);
    Route::get('klien/pesanan',             [KlienController::class, 'pesananSaya']);
    Route::get('klien/lacak-pengiriman',    [KlienController::class, 'lacakPengiriman']);
    Route::get('klien/invoice',             [KlienController::class, 'invoice']);
    Route::get('klien/ulasan',              [KlienController::class, 'ulasan']);
    Route::get('klien/pesanan-selesai',     [KlienController::class, 'pesananSelesai']);
    Route::post('klien/ulasan',             [KlienController::class, 'storeUlasan']);
    Route::put('klien/ulasan/{id}',         [KlienController::class, 'updateUlasan']);
    Route::delete('klien/ulasan/{id}',      [KlienController::class, 'destroyUlasan']);
    Route::get('klien/pesan',               [KlienController::class, 'PesanMakan']);
 
    Route::post('klien/orders', [KlienController::class, 'storePesanan']);
    Route::get('klien/orders',  [KlienController::class, 'pesananSaya']); // histori — dipakai Tracking.jsx & PesananSaya.jsx
 
    Route::get('/klien/lacak/{order_id}', [TrackingController::class, 'show']);
 
    Route::prefix('klien')->group(function () {
 
        // Invoice list & detail
        Route::get('invoice',              [InvoiceKlienController::class, 'index']);
        Route::get('invoice/{id}',         [InvoiceKlienController::class, 'show']);
 
        // Payment channels (bank/ewallet) untuk invoice tertentu
        Route::get('invoice/{id}/payment-channels', [InvoiceKlienController::class, 'paymentChannels']);
 
        // Kirim bukti pembayaran
        Route::post('invoice/{id}/pay',    [InvoiceKlienController::class, 'pay']);
 
        // Riwayat pembayaran
        Route::get('invoice/{id}/payments',[InvoiceKlienController::class, 'payments']);
 
        // Download PDF
        Route::get('invoice/{id}/pdf',     [InvoiceKlienController::class, 'downloadPdf']);
    });
 
    Route::get('/klien/geocode', [GeoController::class, 'geocode']);
    Route::get('/klien/route',   [GeoController::class, 'route']);

 
});

/*
|--------------------------------------------------------------------------
| OWNER MENU MANAGEMENT
|--------------------------------------------------------------------------
*/


Route::middleware('auth:sanctum')
    ->prefix('owner')
    ->group(function () {
        
       Route::get('/dashboard', function () {

    $ownerId = auth()->id();

    return response()->json([
        'totalOrders' => \App\Models\Order::where('owner_id', $ownerId)->count(),

        'packages' => \App\Models\Menu::where('owner_id', $ownerId)->count(),

        'revenue' => \App\Models\Order::where('owner_id', $ownerId)
            ->where('status', 'delivered')
            ->sum('total_price'),
    ]);
});


    Route::get(
        '/stocks',
        [OwnerStockController::class,'index']
    );

    Route::post(
        '/stocks',
        [OwnerStockController::class,'store']
    );

    Route::put(
        '/stocks/{id}',
        [OwnerStockController::class,'update']
    );

    Route::delete(
        '/stocks/{id}',
        [OwnerStockController::class,'destroy']
    );

    Route::get('/menus', [OwnerMenuController2::class, 'index']);
    Route::post('/menus', [OwnerMenuController2::class, 'store']);
    Route::put('/menus/{menu}', [OwnerMenuController2::class, 'update']);
    Route::delete('/menus/{menu}', [OwnerMenuController2::class, 'destroy']);
    Route::get('/menus/{menu}/ingredients', [OwnerMenuController2::class, 'ingredients']);


    // ── Orders (FIX: parameter {order} harus sama dengan nama variabel
    // di method controller agar route model binding bekerja otomatis) ──
Route::get('/orders',                  [OwnerOrderController::class, 'ownerOrders']);
Route::put('/orders/{order}/approve',  [OwnerOrderController::class, 'approve']);
Route::put('/orders/{order}/reject',   [OwnerOrderController::class, 'reject']);
Route::put('/orders/{order}/process',  [OwnerOrderController::class, 'process']);
Route::put('/orders/{order}/dispatch', [OwnerOrderController::class, 'dispatch']);


    Route::get('/payment-accounts', [OwnerPaymentAccountController::class, 'index']);
    Route::post('/payment-accounts', [OwnerPaymentAccountController::class, 'store']);
    Route::put('/payment-accounts/{id}', [OwnerPaymentAccountController::class, 'update']);
    Route::put('/payment-accounts/{id}/set-default', [OwnerPaymentAccountController::class, 'setDefault']);
    Route::delete('/payment-accounts/{id}', [OwnerPaymentAccountController::class, 'destroy']);

    // ── Revenue: konfirmasi pembayaran masuk, riwayat transaksi, fee kurir ──
    Route::get('/payments',                          [OwnerRevenueController::class, 'index']);
    Route::put('/payments/{id}/confirm',              [OwnerRevenueController::class, 'confirm']);
    Route::put('/payments/{id}/reject',                [OwnerRevenueController::class, 'reject']);
    Route::get('/transactions',                       [OwnerRevenueController::class, 'transactions']);
    Route::post('/orders/{id}/dispatch-courier-fee',  [OwnerRevenueController::class, 'dispatchCourierFee']);


    Route::get('/invoices', [OwnerInvoiceController::class, 'index']);
    Route::get('/invoices/{id}', [OwnerInvoiceController::class, 'show']);

    Route::get('/invoice-payments', [OwnerInvoiceController::class, 'pending']);

    Route::put('/invoice-payments/{paymentId}/confirm',
        [OwnerInvoiceController::class, 'confirm']);

    Route::put('/invoice-payments/{paymentId}/reject',
        [OwnerInvoiceController::class, 'reject']);

    Route::get('/kurirs', [OwnerCourierController::class, 'index']);
    Route::get('/revenue-analytics', [OwnerAnalyticsController::class, 'revenueAnalytics']);
    Route::get('/latest-transactions', [OwnerAnalyticsController::class, 'latestTransactions']);

});

Route::get(
    '/distribusi',
    [DistribusiController::class,'index']
);
Route::get('/menus-sppg', [PublicMenuController::class, 'index']);


/*
|--------------------------------------------------------------------------
| SPPG
|--------------------------------------------------------------------------
*/

    Route::middleware('auth:sanctum')
    ->prefix('sppg')
    ->group(function () {

    Route::get(
        '/dashboard',
        [DashboardSPPGController::class, 'index']
    );

    Route::get(
        '/sekolah',
        [SekolahController::class,'index']
    );

    Route::post(
        '/sekolah',
        [SekolahController::class,'store']
    );

    Route::get(
        '/sekolah/{id}',
        [SekolahController::class,'show']
    );

    Route::put(
        '/sekolah/{id}',
        [SekolahController::class,'update']
    );

    Route::delete(
        '/sekolah/{id}',
        [SekolahController::class,'destroy']
    );

    Route::get(
        '/menus',
        [SppgMenuController::class, 'index']
    );

    Route::post(
        '/menus',
        [SppgMenuController::class, 'store']
    );

    Route::put(
        '/menus/{id}',
        [SppgMenuController::class, 'update']
    );

    Route::delete(
        '/menus/{id}',
        [SppgMenuController::class, 'destroy']
    );

    Route::get(
        '/menu-harian',
        [MenuHarianController::class,'index']
    );

    Route::post(
        '/menu-harian',
        [MenuHarianController::class,'store']
    );

    Route::get(
    '/stocks',
    [StocksSPPGController::class, 'index']
);

Route::post(
    '/stocks',
    [StocksSPPGController::class, 'store']
);

Route::put(
    '/stocks/{id}',
    [StocksSPPGController::class, 'update']
);

Route::delete(
    '/stocks/{id}',
    [StocksSPPGController::class, 'destroy']
);
    Route::get(
    '/distribusi',
    [DistribusiController::class,'index']
);

Route::post(
    '/distribusi',
    [DistribusiController::class,'store']
);

Route::put(
    '/distribusi/{id}',
    [DistribusiController::class,'update']
);

Route::delete(
    '/distribusi/{id}',
    [DistribusiController::class,'destroy']
);

Route::get(
    '/distribusi/{id}',
    [DistribusiController::class,'show']
);

Route::patch(
    '/distribusi/{id}/disiapkan',
    [DistribusiController::class, 'tandaiDisiapkan']
);

Route::get(
        '/riwayat',
        [RiwayatSPPGController::class,'index']
    );

    Route::get(
        '/laporan',
        [LaporanSPPGController::class,'index']
    );

Route::get(
        '/kurir',
        [KurirSppgController::class, 'index']
    );

    Route::put(
        '/kurir/{id}/approve',
        [KurirSppgController::class, 'approve']
    );

    Route::put(
        '/kurir/{id}/reject',
        [KurirSppgController::class, 'reject']
    );

    Route::delete(
        '/kurir/{id}',
        [KurirSppgController::class, 'destroy']
    );

});

Route::get('/dashboard-stats', function () {

    return response()->json([

    'customers' => User::where('role','klien')->count(),

    'kurirs' => User::where('role','kurir')
        ->where('status','approved')
        ->count(),

    'owners' => User::where('role','owner')
        ->where('status','approved')
        ->count(),

    'sppgs' => User::where('role','operator_sppg')
        ->where('status','approved')
        ->count(),

    ]);

});

Route::middleware(['auth:sanctum'])->prefix('kurir')->group(function () {
    Route::get('/rute', [KurirOrderController::class, 'rute']);
    Route::get('/orders', [KurirOrderController::class, 'orders']);
    Route::put('/orders/{order}/update-status', [KurirOrderController::class, 'updateStatus']);
    Route::post('/orders/{order}/location', [KurirOrderController::class, 'updateLocation']);
    Route::put('/orders/{order}/mulai-antar', [KurirOrderController::class, 'mulaiAntar']);

    Route::get('/laporan_harian',  [KurirOrderController::class, 'laporanHarian']);
    Route::post('/laporan_harian', [KurirOrderController::class, 'simpanLaporan']);
});