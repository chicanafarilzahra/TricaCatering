<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Admin;

use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login()
    {
        return view('auth.login');
    }

    public function authenticate(Request $request)
    {
        $admin = Admin::where(
            'email',
            $request->email
        )->first();

        if ($admin &&
            Hash::check(
                $request->password,
                $admin->password
            )) {

            session([
                'admin_id' => $admin->id,
                'admin_name' => $admin->name
            ]);

            return redirect('/admin');
        }

        return back()->with(
            'error',
            'Email atau password salah'
        );
    }

    public function logout()
    {
        session()->flush();

        return redirect('/');
    }
}