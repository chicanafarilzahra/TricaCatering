<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Distribusi;
use Carbon\Carbon;

class UpdateStatusDistribusi extends Command
{
    protected $signature   = 'distribusi:update-status';
    protected $description = 'Auto update status distribusi berdasarkan waktu';

    public function handle()
    {
        $now = Carbon::now();

        // Diproses → Dikirim saat jam distribusi tiba
        Distribusi::where('status', 'Disiapkan')
            ->whereDate('tanggal', $now->toDateString())
            ->whereTime('jam_distribusi', '<=', $now->format('H:i:s'))
            ->update(['status' => 'Dikirim']);

        // Dikirim → Selesai setelah 1 jam
        Distribusi::where('status', 'Dikirim')
            ->whereDate('tanggal', $now->toDateString())
            ->whereRaw("ADDTIME(jam_distribusi, '01:00:00') <= ?", [$now->format('H:i:s')])
            ->update(['status' => 'Selesai']);

        $this->info('Status distribusi berhasil diupdate: ' . $now->toDateTimeString());
    }
}