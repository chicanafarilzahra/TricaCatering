<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class KurirLocationUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $orderId;
    public float $latitude;
    public float $longitude;

    public function __construct(int $orderId, float $latitude, float $longitude)
    {
        $this->orderId   = $orderId;
        $this->latitude  = $latitude;
        $this->longitude = $longitude;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('orders.' . $this->orderId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'kurir.location.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'order_id'  => $this->orderId,
            'latitude'  => $this->latitude,
            'longitude' => $this->longitude,
        ];
    }
}