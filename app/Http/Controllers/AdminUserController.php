<?php

namespace App\Http\Controllers;

use App\Models\User;

class AdminUserController extends Controller
{
    public function index()
    {
        return User::whereIn(
            'role',
            ['owner', 'kurir', 'operator_sppg']
        )->get();
    }

    public function approve($id)
    {
        $user = User::findOrFail($id);

        $user->update([
            'status' => 'approved'
        ]);

        return response()->json([
            'message' => 'User berhasil disetujui'
        ]);
    }

    public function reject($id)
    {
        $user = User::findOrFail($id);

        $user->update([
            'status' => 'rejected'
        ]);

        return response()->json([
            'message' => 'User ditolak'
        ]);
    }
}