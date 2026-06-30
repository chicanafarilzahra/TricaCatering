<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Invoice extends Model
{
    use HasFactory;

    protected $table = 'invoices';

    const STATUS_PENDING   = 'pending';
    const STATUS_UNPAID    = 'unpaid';
    const STATUS_DP_PAID   = 'dp_paid';
    const STATUS_PARTIAL   = 'partial';
    const STATUS_PAID      = 'paid';
    const STATUS_FAILED    = 'failed';
    const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'invoice_number',
        'order_id',
        'client_id',
        'subtotal',
        'tax',
        'discount',
        'total_amount',
        'dp_amount',
        'status',
        'due_date',
        'paid_at',
        'notes',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'discount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'dp_amount' => 'decimal:2',
        'due_date' => 'date',
        'paid_at' => 'datetime',
    ];

    /*
    |-----------------------------------------
    | RELATIONSHIP
    |-----------------------------------------
    */

    // Invoice milik order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Invoice milik client/user
    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    // Invoice punya banyak payment
    public function payments()
    {
        return $this->hasMany(InvoicePayment::class);
    }

    /*
    |-----------------------------------------
    | HELPER
    |-----------------------------------------
    */

    public function isPaid()
    {
        return $this->status === self::STATUS_PAID;
    }

    public function isPending()
    {
        return $this->status === self::STATUS_PENDING;
    }
}