<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Order;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('orders.{orderId}', function ($user, $orderId) {
    $order = Order::find($orderId);
    if (!$order) return false;

    return $user->role === 'admin'
        || $order->kurir_id === $user->id
        || $order->client_id === $user->id;
});