<?php

namespace App\Models;
use App\Models\User;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Menu extends Model
{
    protected $fillable = [
    'owner_id',
    'name',
    'description',
    'category',
    'price',
    'min_pax',
    'status',
    'image',
    'is_active',
];

    protected $casts = [
        'price'   => 'decimal:2',
        'min_pax' => 'integer',
    ];

    /* ── relations ── */

    public function ingredients(): HasMany
    {
        return $this->hasMany(MenuIngredient::class);
    }

    public function owner(): BelongsTo
{
    return $this->belongsTo(User::class, 'owner_id');
}

    /* ── appended ── */

    protected $appends = ['ingredients_count'];

    public function getIngredientsCountAttribute(): int
    {
        // uses already-loaded relation to avoid N+1
        return $this->ingredients->count();
    }
}