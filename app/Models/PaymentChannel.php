<?php

namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
 
class PaymentChannel extends Model
{
    protected $fillable = [
        'owner_id', 'type', 'bank_name', 'wallet_name',
        'account_number', 'account_name', 'is_active',
    ];
 
    protected $casts = ['is_active' => 'boolean'];
 
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}