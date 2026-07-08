<?php

namespace App\Http\Controllers\Kurir;

use App\Http\Controllers\Controller;
use App\Models\Distribusi;
use App\Models\DistribusiReport;
use Illuminate\Http\Request;

class DistribusiLaporanController extends Controller
{
    // GET /api/kurir/distribusi/{id} — buat prefill form (readonly fields)
    public function show(Request $request, int $id)
    {
        $kurir = $request->user();

        $d = Distribusi::with(['sekolah', 'menu'])
            ->where('id', $id)
            ->where('sppg_id', $kurir->sppg_id)
            ->where('kurir_id', $kurir->id)
            ->firstOrFail();

        return response()->json([
            'id'            => $d->id,
            'nama_sekolah'  => $d->sekolah->nama_sekolah ?? '—',
            'menu' => $d->menu->nama_menu ?? '—',
            'jumlah_porsi'  => $d->jumlah_porsi,
            'jam_berangkat' => $d->jam_distribusi,
            'status'        => $d->status,
        ]);
    }

    // POST /api/kurir/distribusi/{id}/laporan
    public function store(Request $request, int $id)
    {
        $kurir = $request->user();

        $distribusi = Distribusi::with(['sekolah', 'menu'])
            ->where('id', $id)
            ->where('sppg_id', $kurir->sppg_id)
            ->where('kurir_id', $kurir->id)
            ->firstOrFail();

        if ($distribusi->status !== 'Selesai') {
            return response()->json(['message' => 'Distribusi belum ditandai selesai.'], 422);
        }

        $request->validate([
            'jam_tiba'           => 'required|string|max:10',
            'status_distribusi'  => 'required|in:Berhasil,Gagal',
            'nama_penerima'      => 'required|string|max:255',
            'status_penerimaan'  => 'required|in:Diterima,Ditolak',
            'kondisi_makanan'    => 'required|in:Baik,Rusak,Sebagian',
            'catatan'            => 'nullable|string',
            'photo'              => 'nullable|image|max:4096',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('distribusi_reports', 'public');
        }

        dd([
    'menu_relation' => $distribusi->menu,
    'nama_menu' => $distribusi->menu?->nama_menu,
]);
        $laporan = DistribusiReport::create([
            'distribusi_id'      => $distribusi->id,
            'kurir_id'           => $kurir->id,
            'nama_sekolah'       => $distribusi->sekolah->nama_sekolah ?? null,
           'menu' => optional($distribusi->menu)->nama_menu,
            'jumlah_porsi'       => $distribusi->jumlah_porsi,
            'jam_berangkat'      => $distribusi->jam_distribusi,
            'jam_tiba'           => $request->jam_tiba,
            'status_distribusi'  => $request->status_distribusi,
            'nama_penerima'      => $request->nama_penerima,
            'status_penerimaan'  => $request->status_penerimaan,
            'kondisi_makanan'    => $request->kondisi_makanan,
            'catatan'            => $request->catatan,
            'photo'              => $photoPath,
        ]);

        return response()->json(['message' => 'Laporan distribusi berhasil disimpan.', 'data' => $laporan], 201);
    }

    // GET /api/kurir/distribusi_laporan — riwayat, buat tabel di halaman
    public function index(Request $request)
    {
        $laporan = DistribusiReport::where('kurir_id', $request->user()->id)
            ->whereDate('created_at', now()->toDateString())
            ->orderByDesc('created_at')
            ->get();

        return response()->json($laporan);
    }
    public function tanpaLaporan(Request $request)
{
    $kurir = $request->user();

    $distribusi = Distribusi::with(['sekolah', 'menu'])
        ->where('sppg_id', $kurir->sppg_id)
        ->where('kurir_id', $kurir->id)
        ->where('status', 'Selesai')
        ->whereNotIn('id', DistribusiReport::pluck('distribusi_id'))
        ->orderByDesc('updated_at')
        ->get();

    return response()->json(['data' => $distribusi]);
}
}
