<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\TrackingLog;

class Order extends Model
{
    protected $fillable = [
        'owner_id',
        'client_id',
        'kurir_id',
        'customer_name',
        'phone',
        'address',
        'order_date',
        'total_price',
        'status',
        'type',
        'menu_id',
        'quantity',
        'duration',
        'event_date',
        'theme',
        'notes',
        'lat',              // koordinat klien
        'lng',              // koordinat klien
        'courier_fee',
        'tanggal',          // jadwal tanggal kirim
        'jam',              // jadwal jam kirim
        'last_kurir_lat',   // cache posisi kurir
        'last_kurir_lng',
        'last_location_at',
    ];

    protected $casts = [
        'order_date'       => 'date',
        'event_date'       => 'date',
        'tanggal'          => 'date',
        'last_location_at' => 'datetime',
        'last_kurir_lat'   => 'float',
        'last_kurir_lng'   => 'float',
        'lat'              => 'float',
        'lng'              => 'float',
        'total_price'      => 'float',
        'courier_fee'      => 'float',
    ];

    const STATUS_PENDING     = 'pending';
    const STATUS_CONFIRMED   = 'confirmed';
    const STATUS_PREPARING   = 'preparing';
    const STATUS_DISPATCHED  = 'dispatched';
    const STATUS_ON_DELIVERY = 'on_delivery';
    const STATUS_DELIVERED   = 'delivered';
    const STATUS_CANCELLED   = 'cancelled';

    // Owner catering (users dengan role owner)
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    // Klien pemesan (users dengan role klien)
    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    // Kurir — relasi yang sebelumnya tidak ada
    public function courier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'kurir_id');
    }

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class, 'menu_id');
    }

    public function trackingLogs(): HasMany
    {
        return $this->hasMany(TrackingLog::class, 'order_id');
    }

    public function isActiveDelivery(): bool
    {
        return in_array($this->status, [
            self::STATUS_DISPATCHED,
            self::STATUS_ON_DELIVERY,
        ]);
    }

    public function deliverySchedules()
    {
        return $this->hasMany(DeliverySchedule::class);
    }

    // Ulasan klien untuk pesanan ini (1 pesanan = 1 ulasan)
    public function ulasan(): HasOne
    {
        return $this->hasOne(Ulasan::class, 'order_id');
    }
}