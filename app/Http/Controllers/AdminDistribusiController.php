<?php

namespace App\Http\Controllers;

use App\Models\Distribusi;
use Illuminate\Http\Request;

class AdminDistribusiController extends Controller
{
    public function index(Request $request)
    {
        $query = Distribusi::with(['sppg', 'sekolah', 'menu'])
            ->orderBy('tanggal', 'desc');

        if ($request->filled('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%$search%")
                  ->orWhereHas('sppg', fn($q) => $q->where('name', 'like', "%$search%"))
                  ->orWhereHas('sekolah', fn($q) => $q->where('nama', 'like', "%$search%"));
            });
        }

        $data = $query->get()->map(fn($d) => [
            'id'          => $d->id,
            'sppgName'    => $d->sppg?->name ?? '-',       
            'sekolah' => $d->sekolah?->nama_sekolah ?? '-',   
            'courier'     => $d->sppg?->email ?? '-',      
            'jumlahPorsi' => $d->jumlah_porsi,
            'date'        => $d->tanggal,
            'status'      => $d->status,                   
        ]);

        return response()->json($data);
    }

    private function mapStatus(string $status): string
{
    return $status;
}
}