<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use App\Models\Distribusi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Sekolah;

class DistribusiController extends Controller
{
    public function index(Request $request)
    {
        // FIX: tambahkan relasi 'kurir' — tanpa ini, frontend (item.kurir?.name)
        // selalu null sehingga kolom "Kurir" di tabel selalu "Belum ditentukan".
        $query = Distribusi::with(['sekolah', 'menu', 'kurir']);

        if ($request->user()->role !== 'admin') {
            $query->where('sppg_id', Auth::id());
        }

        return $query->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'sekolah_id'     => 'required|exists:sekolahs,id',
            'menu_id'        => 'required|exists:sppg_menus,id',
            // FIX: kurir_id sebelumnya tidak divalidasi/diterima sama sekali,
            // sehingga data kurir yang dipilih di frontend selalu dibuang.
            'kurir_id'       => 'nullable|exists:users,id',
            'tanggal'        => 'required|date',
            'jam_distribusi' => 'required',
        ]);

        $sekolah = Sekolah::findOrFail($request->sekolah_id);

        $distribusi = Distribusi::create([
            'sppg_id'        => Auth::id(),
            'sekolah_id'     => $request->sekolah_id,
            'menu_id'        => $request->menu_id,
            'kurir_id'       => $request->kurir_id, // FIX: sekarang tersimpan
            'tanggal'        => $request->tanggal,
            'jam_distribusi' => $request->jam_distribusi,
            'jumlah_porsi'   => $sekolah->jumlah_siswa,
            'status'         => 'Diproses',
        ]);

        return $distribusi->load(['sekolah', 'menu', 'kurir']);
    }

    public function show($id)
    {
        // FIX: tambahkan relasi 'kurir', sama seperti index().
        return Distribusi::with(['sekolah', 'menu', 'kurir'])
            ->where('sppg_id', Auth::id())
            ->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'sekolah_id'     => 'required|exists:sekolahs,id',
            'menu_id'        => 'required|exists:sppg_menus,id',
            // FIX: sama seperti store(), kurir_id perlu divalidasi & diterima.
            'kurir_id'       => 'nullable|exists:users,id',
            'tanggal'        => 'required|date',
            'jam_distribusi' => 'required',
        ]);

        $data = Distribusi::where('id', $id)
            ->where('sppg_id', Auth::id())
            ->firstOrFail();

        $sekolah = Sekolah::findOrFail($request->sekolah_id);

        $data->update([
            'sekolah_id'     => $request->sekolah_id,
            'menu_id'        => $request->menu_id,
            'kurir_id'       => $request->kurir_id, // FIX: sekarang tersimpan
            'tanggal'        => $request->tanggal,
            'jam_distribusi' => $request->jam_distribusi,
            'jumlah_porsi'   => $sekolah->jumlah_siswa,
            // FIX: sebelumnya 'status' => $request->status — karena frontend
            // tidak pernah mengirim field 'status' di body update, ini akan
            // menyimpan null dan menghapus status yang sudah berjalan
            // (mis. dari "Disiapkan" balik jadi kosong). Sekarang status
            // dipertahankan apa adanya; ubah status hanya lewat
            // tandaiDisiapkan() atau endpoint status lain yang eksplisit.
        ]);

        return $data->fresh(['sekolah', 'menu', 'kurir']);
    }

    public function destroy($id)
    {
        $distribusi = Distribusi::where('id', $id)
            ->where('sppg_id', Auth::id())
            ->firstOrFail();

        $distribusi->delete();

        return response()->json(['message' => 'Distribusi berhasil dihapus']);
    }

    public function tandaiDisiapkan($id)
    {
        // Catatan: sebaiknya scope ke sppg_id milik operator yang login juga,
        // supaya operator SPPG lain tidak bisa mengubah status distribusi
        // milik SPPG lain hanya dengan menebak ID.
        $distribusi = Distribusi::where('id', $id)
            ->where('sppg_id', Auth::id())
            ->firstOrFail();

        if ($distribusi->status !== 'Diproses') {
            return response()->json(['message' => 'Status harus Diproses'], 422);
        }

        $distribusi->status = 'Disiapkan';
        $distribusi->save();

        return response()->json(['message' => 'Berhasil diubah ke Disiapkan', 'data' => $distribusi->load(['sekolah', 'menu', 'kurir'])]);
    }
}