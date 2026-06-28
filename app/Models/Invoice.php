<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Invoice extends Model
{
    use HasFactory;

    protected $table = 'invoices';

    protected $fillable = [
        'invoice_number',
        'order_id',
        'client_id',
        'subtotal',
        'tax',
        'discount',
        'total_amount',
        'dp_amount',        // jumlah DP yang sudah terkonfirmasi
        'status',
        'due_date',
        'paid_at',
        'notes',
    ];

    protected $casts = [
        'subtotal'     => 'decimal:2',
        'tax'          => 'decimal:2',
        'discount'     => 'decimal:2',
        'total_amount' => 'decimal:2',
        'dp_amount'    => 'decimal:2',
        'due_date'     => 'date',
        'paid_at'      => 'datetime',
    ];

    /*
    |─────────────────────────────────────────────
    | Status constants — sesuai frontend STATUS_MAP
    |─────────────────────────────────────────────
    | unpaid    → belum dibayar sama sekali
    | pending   → bukti sudah diupload, menunggu konfirmasi admin
    | dp_paid   → DP sudah dikonfirmasi, menunggu pelunasan
    | paid      → lunas (dikonfirmasi admin)
    | selesai   → pesanan selesai & lunas
    | cancelled → dibatalkan
    */
    const STATUS_UNPAID    = 'unpaid';
    const STATUS_PENDING   = 'pending';
    const STATUS_DP_PAID   = 'dp_paid';
    const STATUS_PAID      = 'paid';
    const STATUS_SELESAI   = 'selesai';
    const STATUS_CANCELLED = 'cancelled';

    /* ─────────────────────────────────────────────
     | AUTO-GENERATE invoice_number saat create
     ───────────────────────────────────────────── */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Invoice $invoice) {
            if (empty($invoice->invoice_number)) {
                $year  = now()->format('Y');
                $month = now()->format('m');

                // Hitung invoice bulan ini, lalu +1
                $count = static::whereYear('created_at', $year)
                               ->whereMonth('created_at', $month)
                               ->count() + 1;

                $invoice->invoice_number = sprintf('INV-%s%s-%04d', $year, $month, $count);
                // contoh: INV-202606-0023
            }
        });
    }

    /* ─────────────────────────────────────────────
     | RELATIONSHIPS
     ───────────────────────────────────────────── */

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function payments()
    {
        return $this->hasMany(InvoicePayment::class);
    }

    /* ─────────────────────────────────────────────
     | HELPERS
     ───────────────────────────────────────────── */

    public function isPaid(): bool
    {
        return in_array($this->status, [self::STATUS_PAID, self::STATUS_SELESAI]);
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isDpPaid(): bool
    {
        return $this->status === self::STATUS_DP_PAID;
    }

    public function remainingAmount(): float
    {
        return max(0, (float) $this->total_amount - (float) $this->dp_amount);
    }
}