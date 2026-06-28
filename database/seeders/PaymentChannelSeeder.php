<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PaymentChannel;

/**
 * PaymentChannelSeeder
 *
 * Isi data rekening bank & ewallet default (global, owner_id = null).
 * Jalankan: php artisan db:seed --class=PaymentChannelSeeder
 */
class PaymentChannelSeeder extends Seeder
{
    public function run(): void
    {
        $channels = [
            // ─── Bank Transfer ───
            [
                'type'           => 'bank',
                'name'           => 'BCA',
                'bank_name'      => 'BCA',
                'account_number' => '1234567890',
                'account_name'   => 'PT Trica Catering',
                'is_active'      => true,
            ],
            [
                'type'           => 'bank',
                'name'           => 'BRI',
                'bank_name'      => 'BRI',
                'account_number' => '0987654321',
                'account_name'   => 'PT Trica Catering',
                'is_active'      => true,
            ],
            [
                'type'           => 'bank',
                'name'           => 'Mandiri',
                'bank_name'      => 'Mandiri',
                'account_number' => '1122334455',
                'account_name'   => 'PT Trica Catering',
                'is_active'      => true,
            ],
            [
                'type'           => 'bank',
                'name'           => 'BNI',
                'bank_name'      => 'BNI',
                'account_number' => '9988776655',
                'account_name'   => 'PT Trica Catering',
                'is_active'      => true,
            ],

            // ─── E-Wallet ───
            [
                'type'           => 'ewallet',
                'name'           => 'GoPay',
                'wallet_name'    => 'GoPay',
                'account_number' => '081234567890',
                'account_name'   => 'Trica Catering',
                'is_active'      => true,
            ],
            [
                'type'           => 'ewallet',
                'name'           => 'OVO',
                'wallet_name'    => 'OVO',
                'account_number' => '081234567890',
                'account_name'   => 'Trica Catering',
                'is_active'      => true,
            ],
            [
                'type'           => 'ewallet',
                'name'           => 'Dana',
                'wallet_name'    => 'Dana',
                'account_number' => '081234567890',
                'account_name'   => 'Trica Catering',
                'is_active'      => true,
            ],
            [
                'type'           => 'ewallet',
                'name'           => 'ShopeePay',
                'wallet_name'    => 'ShopeePay',
                'account_number' => '081234567890',
                'account_name'   => 'Trica Catering',
                'is_active'      => true,
            ],
        ];

        foreach ($channels as $ch) {
            // firstOrCreate agar tidak duplikasi kalau seeder dijalankan ulang
            PaymentChannel::firstOrCreate(
                [
                    'type'           => $ch['type'],
                    'account_number' => $ch['account_number'],
                    'name'           => $ch['name'],
                ],
                array_merge($ch, ['owner_id' => null])
            );
        }

        $this->command->info('PaymentChannel seeder selesai: ' . count($channels) . ' channel ditambahkan.');
    }
}