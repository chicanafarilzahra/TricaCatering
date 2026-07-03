<?php

namespace App\Http\Controllers\Kurir;

use App\Http\Controllers\Controller;
use App\Models\Distribusi;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class KurirDistribusiController extends Controller
{
    // ──────────────────────────────────────────────────────────
    // GET /api/kurir/distribusi
    // Daftar jadwal distribusi yang relevan buat kurir SPPG ini:
    // - yang sudah dia klaim sendiri (kurir_id = miliknya), status apapun
    // - yang masih tersedia untuk diambil (status Disiapkan, belum ada kurir)
    //   dan berasal dari SPPG yang sama dengan kurir ini
    // ──────────────────────────────────────────────────────────
    public function index(Request $request): JsonResponse
    {
        $kurir = $request->user();

        if (!$kurir->sppg_id) {
            return response()->json(['message' => 'Akun ini bukan kurir SPPG.'], 403);
        }

        $distribusi = Distribusi::with(['sekolah', 'menu'])
            ->where('sppg_id', $kurir->sppg_id)
            ->where(function ($q) use ($kurir) {
                $q->where('kurir_id', $kurir->id)
                  ->orWhere(function ($q2) {
                      $q2->where('status', 'Disiapkan')
                         ->whereNull('kurir_id');
                  });
            })
            ->orderByDesc('tanggal')
            ->orderBy('jam_distribusi')
            ->get()
            ->map(fn ($d) => $this->normalize($d, $kurir->id));

        return response()->json(['data' => $distribusi]);
    }

    // ──────────────────────────────────────────────────────────
    // GET /api/kurir/distribusi/rute
    // Sama seperti index(), tapi dipersempit ke jadwal hari ini saja
    // dan hanya status yang relevan untuk "sedang berjalan".
    // ──────────────────────────────────────────────────────────
    public function rute(Request $request): JsonResponse
    {
        $kurir = $request->user();

        if (!$kurir->sppg_id) {
            return response()->json(['message' => 'Akun ini bukan kurir SPPG.'], 403);
        }

        $distribusi = Distribusi::with(['sekolah', 'menu'])
            ->where('sppg_id', $kurir->sppg_id)
            ->whereDate('tanggal', now()->toDateString())
            ->where(function ($q) use ($kurir) {
                $q->where('kurir_id', $kurir->id)
                  ->orWhere(function ($q2) {
                      $q2->where('status', 'Disiapkan')
                         ->whereNull('kurir_id');
                  });
            })
            ->orderBy('jam_distribusi')
            ->get()
            ->map(fn ($d) => $this->normalize($d, $kurir->id));

        return response()->json(['data' => $distribusi]);
    }

    // ──────────────────────────────────────────────────────────
    // PUT /api/kurir/distribusi/{id}/mulai-antar
    // Kurir mengklaim distribusi yang masih "Disiapkan" & belum ada
    // kurirnya, lalu status berubah jadi "Dikirim".
    // ──────────────────────────────────────────────────────────
    public function mulaiAntar(Request $request, int $id): JsonResponse
    {
        $kurir = $request->user();

        if (!$kurir->sppg_id) {
            return response()->json(['message' => 'Akun ini bukan kurir SPPG.'], 403);
        }

        $distribusi = Distribusi::where('id', $id)
            ->where('sppg_id', $kurir->sppg_id)
            ->first();

        if (!$distribusi) {
            return response()->json(['message' => 'Jadwal distribusi tidak ditemukan.'], 404);
        }

        if ($distribusi->kurir_id && $distribusi->kurir_id !== $kurir->id) {
            return response()->json(['message' => 'Distribusi ini sudah diambil kurir lain.'], 422);
        }

        if ($distribusi->status !== 'Disiapkan') {
            return response()->json(['message' => 'Distribusi ini belum siap diantar atau statusnya sudah berubah.'], 422);
        }

        $distribusi->update([
            'kurir_id' => $kurir->id,
            'status'   => 'Dikirim',
        ]);

        return response()->json([
            'message' => 'Pengiriman dimulai.',
            'data'    => $this->normalize($distribusi->fresh(['sekolah', 'menu']), $kurir->id),
        ]);
    }

    // ──────────────────────────────────────────────────────────
    // PUT /api/kurir/distribusi/{id}/selesai
    // Kurir menandai distribusi yang dia bawa sebagai selesai diantar.
    // ──────────────────────────────────────────────────────────
    public function selesai(Request $request, int $id): JsonResponse
    {
        $kurir = $request->user();

        $distribusi = Distribusi::where('id', $id)
            ->where('sppg_id', $kurir->sppg_id)
            ->where('kurir_id', $kurir->id)
            ->first();

        if (!$distribusi) {
            return response()->json(['message' => 'Distribusi tidak ditemukan atau bukan milik Anda.'], 404);
        }

        if ($distribusi->status !== 'Dikirim') {
            return response()->json(['message' => 'Status distribusi tidak valid untuk aksi ini.'], 422);
        }

        $distribusi->update(['status' => 'Selesai']);

        return response()->json([
            'message' => 'Pengiriman selesai.',
            'data'    => $this->normalize($distribusi->fresh(['sekolah', 'menu']), $kurir->id),
        ]);
    }

    // ──────────────────────────────────────────────────────────
    // Ubah 1 row Distribusi jadi bentuk seragam yang dipakai frontend
    // kurir (sama field-nya dengan data Order, supaya JadwalPengiriman.jsx
    // & PengirimanAktif.jsx bisa render kedua sumber data tanpa cabang UI).
    // ──────────────────────────────────────────────────────────
    private function normalize(Distribusi $d, int $kurirId): array
    {
        return [
            'id'            => $d->id,
            'source'        => 'distribusi',
            'customer_name' => $d->sekolah->nama_sekolah ?? '—',
            'address'       => $d->sekolah->alamat ?? null,
            'menu'          => ['name' => $d->menu->nama_menu ?? null],
            'quantity'      => $d->jumlah_porsi,
            'jam'           => $d->jam_distribusi,
            'tanggal'       => $d->tanggal,
            'courier_fee'   => 0,
            'status'        => $this->mapStatus($d->status),
            'raw_status'    => $d->status,
            'claimable'     => $d->status === 'Disiapkan' && is_null($d->kurir_id),
            'is_mine'       => $d->kurir_id === $kurirId,
        ];
    }

    private function mapStatus(string $status): string
    {
        return match ($status) {
            'Diproses'  => 'preparing',
            'Disiapkan' => 'dispatched',
            'Dikirim'   => 'on_delivery',
            'Selesai'   => 'delivered',
            default     => 'preparing',
        };
    }
}