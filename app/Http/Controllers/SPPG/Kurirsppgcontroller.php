<?php

namespace App\Http\Controllers\SPPG;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KurirSppgController extends Controller
{
    // ──────────────────────────────────────────────────────────
    // GET /api/sppg/kurir
    // Daftar kurir yang mendaftar ke SPPG yang sedang login
    // (kurir_type = 'sppg' saat register, employer_id disimpan
    // sebagai sppg_id pada tabel users)
    // ──────────────────────────────────────────────────────────
    public function index(Request $request): JsonResponse
    {
        $sppg = $request->user();

        if ($sppg->role !== 'operator_sppg') {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $query = User::where('role', 'kurir')
            ->where('sppg_id', $sppg->id);

        if ($request->filled('status') && in_array($request->status, ['pending', 'approved', 'rejected'])) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $kurirs = $query
            ->select('id', 'name', 'email', 'phone', 'status', 'created_at')
            ->orderBy('name')
            ->get();

        return response()->json(['data' => $kurirs]);
    }

    // ──────────────────────────────────────────────────────────
    // PUT /api/sppg/kurir/{id}/approve
    // Setujui pendaftaran kurir yang memilih SPPG ini sebagai tempat kerja
    // ──────────────────────────────────────────────────────────
    public function approve(Request $request, int $id): JsonResponse
    {
        $sppg = $request->user();

        $kurir = User::where('id', $id)
            ->where('role', 'kurir')
            ->where('sppg_id', $sppg->id)
            ->firstOrFail();

        if ($kurir->status !== 'pending') {
            return response()->json(['message' => 'Kurir ini sudah diproses sebelumnya'], 422);
        }

        $kurir->update(['status' => 'approved']);

        return response()->json(['message' => 'Kurir disetujui', 'data' => $kurir]);
    }

    // ──────────────────────────────────────────────────────────
    // PUT /api/sppg/kurir/{id}/reject
    // ──────────────────────────────────────────────────────────
    public function reject(Request $request, int $id): JsonResponse
    {
        $sppg = $request->user();

        $kurir = User::where('id', $id)
            ->where('role', 'kurir')
            ->where('sppg_id', $sppg->id)
            ->firstOrFail();

        if ($kurir->status !== 'pending') {
            return response()->json(['message' => 'Kurir ini sudah diproses sebelumnya'], 422);
        }

        $kurir->update(['status' => 'rejected']);

        return response()->json(['message' => 'Pendaftaran kurir ditolak', 'data' => $kurir]);
    }

    // ──────────────────────────────────────────────────────────
    // DELETE /api/sppg/kurir/{id}
    // Menghapus akun kurir dari daftar SPPG ini secara permanen.
    // Hanya bisa menghapus kurir yang memang terdaftar di sppg_id milik SPPG ini.
    // ──────────────────────────────────────────────────────────
    public function destroy(Request $request, int $id): JsonResponse
    {
        $sppg = $request->user();

        $kurir = User::where('id', $id)
            ->where('role', 'kurir')
            ->where('sppg_id', $sppg->id)
            ->firstOrFail();

        $kurir->delete();

        return response()->json(['message' => 'Kurir berhasil dihapus dari daftar']);
    }
}