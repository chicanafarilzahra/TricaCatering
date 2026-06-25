<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderDispatched implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Order $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('orders.' . $this->order->id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'order.dispatched';
    }

    public function broadcastWith(): array
    {
        return [
            'order_id'  => $this->order->id,
            'status'    => $this->order->status,
            'kurir_id'  => $this->order->kurir_id,
        ];
    }
}