<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use App\Models\Distribusi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class DistribusiController extends Controller
{
    // Menampilkan semua distribusi milik SPPG
    public function index()
{
    return Distribusi::with([
        'sekolah',
        'menu'
    ])
    ->where(
        'sppg_id',
        Auth::id()
    )
    ->latest()
    ->get();
}

    // Menambahkan distribusi
    public function store(Request $request)
{
    $request->validate([
        'sekolah_id'=>'required|exists:sekolahs,id',
        'menu_id'=>'required|exists:sppg_menus,id',
        'tanggal'=>'required|date',
        'jumlah_porsi'=>'required|integer|min:1'
    ]);

    return Distribusi::create([
        'sppg_id'=>Auth::id(),
        'sekolah_id'=>$request->sekolah_id,
        'menu_id'=>$request->menu_id,
        'tanggal'=>$request->tanggal,
        'jumlah_porsi'=>$request->jumlah_porsi,
        'status'=>$request->status ?? 'Menunggu',
    ]);
}
    // Detail distribusi
    public function show($id)
{
    return Distribusi::with([
        'sekolah',
        'menu'
    ])
    ->where(
        'sppg_id',
        Auth::id()
    )
    ->findOrFail($id);
}

    // Update distribusi
    public function update(Request $request,$id)
{
    $data=Distribusi::where(
        'id',$id
    )
    ->where(
        'sppg_id',
        Auth::id()
    )
    ->firstOrFail();

    $data->update([
        'sekolah_id'=>$request->sekolah_id,
        'menu_id'=>$request->menu_id,
        'tanggal'=>$request->tanggal,
        'jumlah_porsi'=>$request->jumlah_porsi,
        'status'=>$request->status,
    ]);

    return $data;
}
    // Hapus distribusi
    public function destroy($id)
    {
        $distribusi = Distribusi::where(
            'id',
            $id
        )
        ->where(
            'sppg_id',
            Auth::id()
        )
        ->firstOrFail();

        $distribusi->delete();

        return response()->json([
            'message' => 'Distribusi berhasil dihapus'
        ]);
    }
}