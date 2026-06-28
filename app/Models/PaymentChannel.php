<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentChannel extends Model
{
    protected $fillable = [
        'type',             // 'bank' | 'ewallet'
        'name',             // kolom lama (dari migration awal) — tetap dipertahankan
        'bank_name',        // untuk type = 'bank' (BCA, BRI, Mandiri, ...)
        'wallet_name',      // untuk type = 'ewallet' (GoPay, OVO, Dana, ...)
        'account_number',
        'account_name',
        'logo',             // path logo (opsional)
        'is_active',
        'owner_id',         // null = channel global; isi = channel milik owner tertentu
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /* ─────────────────────────────────────
     | Helper: nama tampilan yang konsisten
     ───────────────────────────────────── */

    /**
     * Nama yang ditampilkan ke frontend:
     * pakai bank_name jika type=bank, wallet_name jika type=ewallet,
     * fallback ke kolom 'name' lama.
     */
    public function getDisplayNameAttribute(): string
    {
        return $this->bank_name ?? $this->wallet_name ?? $this->name ?? '';
    }

    /* ─────────────────────────────────────
     | Relationships
     ───────────────────────────────────── */

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function invoicePayments()
    {
        return $this->hasMany(InvoicePayment::class);
    }
}