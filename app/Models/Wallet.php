<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wallet extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'balance',
    ];

    protected $casts = [
        'balance' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(WalletTransaction::class);
    }

    /**
     * Tambah saldo wallet dan catat riwayat transaksinya.
     * Dipanggil di dalam DB transaction oleh OrderController.
     */
    public function credit(float $amount, string $category, ?int $orderId = null, ?string $description = null): WalletTransaction
    {
        $this->balance += $amount;
        $this->save();

        return $this->transactions()->create([
            'order_id'      => $orderId,
            'type'          => 'credit',
            'category'      => $category,
            'amount'        => $amount,
            'balance_after' => $this->balance,
            'description'   => $description,
        ]);
    }

    public function debit(float $amount, string $category, ?int $orderId = null, ?string $description = null): WalletTransaction
    {
        $this->balance -= $amount;
        $this->save();

        return $this->transactions()->create([
            'order_id'      => $orderId,
            'type'          => 'debit',
            'category'      => $category,
            'amount'        => $amount,
            'balance_after' => $this->balance,
            'description'   => $description,
        ]);
    }
}