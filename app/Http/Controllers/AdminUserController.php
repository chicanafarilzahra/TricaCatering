<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Mail;
use App\Models\User;

class AdminUserController extends Controller
{
    public function index()
{
    return User::latest()->get();
}

    public function approve($id)
{
    $user = User::findOrFail($id);

    $user->status = 'approved';
    $user->save();

    Mail::raw(
        'Akun Anda telah disetujui oleh admin TriCa Catering.',
        function ($message) use ($user) {

            $message->to($user->email);

            $message->subject(
                'Akun Disetujui'
            );
        }
    );

    return response()->json([
        'message' => 'User berhasil disetujui'
    ]);
}

    public function reject($id)
{
    $user = User::findOrFail($id);

    $user->status = 'rejected';
    $user->save();

    Mail::raw(
        'Mohon maaf, pendaftaran Anda ditolak oleh admin TriCa Catering.',
        function ($message) use ($user) {

            $message->to($user->email);

            $message->subject(
                'Pendaftaran Ditolak'
            );
        }
    );

    return response()->json([
        'message' => 'User berhasil ditolak'
    ]);
}

    
}