<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentAccount;
use Illuminate\Http\Request;

class OwnerPaymentAccountController extends Controller
{
    public function index(Request $request)
{
    $accounts = PaymentAccount::where('owner_id', $request->user()->id)
        ->latest()
        ->get();

    return response()->json($accounts);
}

    public function store(Request $request)
{
    $request->validate([
        'type' => 'required|in:bank,ewallet',
        'provider_name' => 'required|string',
        'account_number' => 'required|string',
        'account_name' => 'nullable|string',
    ]);

    $ownerId = $request->user()->id;

    $isFirst = !PaymentAccount::where('owner_id', $ownerId)->exists();

    $account = PaymentAccount::create([
        'owner_id' => $ownerId,
        'type' => $request->type,
        'provider_name' => $request->provider_name,
        'account_number' => $request->account_number,
        'account_name' => $request->account_name,
        'is_default' => $isFirst,
    ]);

    return response()->json([
        'message' => 'Akun pembayaran berhasil ditambahkan',
        'data' => $account,
    ]);
}
   public function update(Request $request, int $id)
{
    $account = PaymentAccount::where('id', $id)
        ->where('owner_id', $request->user()->id)
        ->firstOrFail();

    $request->validate([
        'type' => 'required|in:bank,ewallet',
        'provider_name' => 'required|string',
        'account_number' => 'required|string',
        'account_name' => 'nullable|string',
    ]);

    $account->update([
        'type' => $request->type,
        'provider_name' => $request->provider_name,
        'account_number' => $request->account_number,
        'account_name' => $request->account_name,
    ]);

    return response()->json([
        'message' => 'Akun pembayaran berhasil diupdate',
        'data' => $account,
    ]);
}
    public function setDefault(Request $request, int $id)
{
    $ownerId = $request->user()->id;

    PaymentAccount::where('owner_id', $ownerId)
        ->update(['is_default' => false]);

    $account = PaymentAccount::where('id', $id)
        ->where('owner_id', $ownerId)
        ->firstOrFail();

    $account->update(['is_default' => true]);

    return response()->json([
        'message' => 'Akun utama berhasil diubah',
        'data' => $account,
    ]);
}
public function destroy(Request $request, int $id)
{
    $ownerId = $request->user()->id;

    $account = PaymentAccount::where('id', $id)
        ->where('owner_id', $ownerId)
        ->first();

    if (!$account) {
        return response()->json(['message' => 'Akun tidak ditemukan'], 404);
    }

    $wasDefault = $account->is_default;

    $account->delete();

    if ($wasDefault) {
        $next = PaymentAccount::where('owner_id', $ownerId)->first();

        if ($next) {
            $next->update(['is_default' => true]);
        }
    }

    return response()->json([
        'message' => 'Akun pembayaran berhasil dihapus'
    ]);
}
}