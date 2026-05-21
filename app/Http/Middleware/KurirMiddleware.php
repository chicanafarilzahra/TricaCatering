<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KurirMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if (!$user) {
            abort(401, 'Unauthorized'); // user belum login
        }

        if ($user->role !== 'kurir') {
            abort(403, 'Forbidden'); // bukan kurir
        }

        return $next($request);
    }
}