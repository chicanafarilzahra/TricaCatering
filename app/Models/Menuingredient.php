<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenuIngredient extends Model
{
    protected $fillable = [
        'menu_id',
        'stock_id',
        'qty_per_portion',
    ];

    protected $casts = [
        'qty_per_portion' => 'decimal:3',
    ];

    /* ── relations ── */

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }

    public function stock(): BelongsTo
    {
        return $this->belongsTo(Stock::class);
    }
}