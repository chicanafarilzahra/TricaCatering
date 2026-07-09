<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class UpdateStatusDistribusi extends Command
{
    protected $signature   = 'distribusi:update-status';
    protected $description = 'DINONAKTIFKAN — status distribusi sekarang diubah manual oleh kurir (mulai-antar & selesai), bukan otomatis berdasar waktu.';

    public function handle()
    {
        $this->info('Command ini sudah dinonaktifkan. Status distribusi diubah lewat aksi kurir di halaman Kurir (Ambil & Antar → Dikirim, Selesai → Selesai), bukan otomatis lagi.');
    }
}