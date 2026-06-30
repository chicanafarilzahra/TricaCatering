<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Invoice;
use App\Models\PaymentAccount;
use App\Models\User;

class InvoicePayment extends Model
{
    protected $fillable = [
        'invoice_id',
        'payment_channel_id',
        'type',
        'amount',
        'proof_path',
        'proof_url',
        'note',
        'status',
        'confirmed_at',
        'confirmed_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'confirmed_at' => 'datetime',
    ];

    /* ───────── RELATION ───────── */

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function paymentChannel()
    {
        return $this->belongsTo(PaymentAccount::class, 'payment_channel_id');
    }

    public function confirmedBy()
    {
        return $this->belongsTo(User::class, 'confirmed_by');
    }
}