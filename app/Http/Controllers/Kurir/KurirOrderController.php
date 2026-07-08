<?php

namespace App\Http\Controllers\Kurir;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\TrackingLog;
use App\Models\DeliveryReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class KurirOrderController extends Controller
{
    public function rute(Request $request)
    {
        $kurirId = $request->user()->id;

        $orders = Order::with('menu:id,name')
            ->where('kurir_id', $kurirId)
            ->whereIn('status', ['dispatched', 'on_delivery', 'delivered'])
            ->whereDate('tanggal', now()->toDateString())
            ->orderBy('jam')
            ->get();

        return response()->json(['data' => $orders]);
    }

    public function orders(Request $request)
    {
        $kurirId = $request->user()->id;

        $orders = Order::with('menu:id,name')
            ->where('kurir_id', $kurirId)
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['data' => $orders]);
    }

    // Kurir klik "Menuju Lokasi" → dispatched jadi on_delivery
    public function mulaiAntar(Request $request, Order $order)
    {
        if ($order->kurir_id !== $request->user()->id) {
            return response()->json(['message' => 'Order ini bukan milik Anda.'], 403);
        }

        if ($order->status !== 'dispatched') {
            return response()->json(['message' => 'Status order tidak valid untuk aksi ini.'], 422);
        }

        $order->status = 'on_delivery';
        $order->save();

        return response()->json([
            'message' => 'Status berhasil diubah ke on_delivery.',
            'data'    => $order,
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:dispatched,on_delivery,delivered,cancelled',
        ]);

        if ($order->kurir_id !== $request->user()->id) {
            return response()->json(['message' => 'Order ini bukan milik Anda.'], 403);
        }

        $order->status = $request->status;
        $order->save();

        return response()->json([
            'message' => 'Status order berhasil diperbarui.',
            'data'    => $order,
        ]);
    }

    public function updateLocation(Request $request, Order $order)
    {
        $request->validate([
            'latitude'  => 'required|numeric',
            'longitude' => 'required|numeric',
            'accuracy'  => 'nullable|numeric',
        ]);

        if ($order->kurir_id !== $request->user()->id) {
            return response()->json(['message' => 'Order ini bukan milik Anda.'], 403);
        }

        $order->update([
            'last_kurir_lat'   => $request->latitude,
            'last_kurir_lng'   => $request->longitude,
            'last_location_at' => now(),
        ]);

        TrackingLog::create([
            'order_id'  => $order->id,
            'kurir_id'  => $request->user()->id,
            'latitude'  => $request->latitude,
            'longitude' => $request->longitude,
            'accuracy'  => $request->accuracy,
        ]);

        return response()->json(['message' => 'Lokasi berhasil dikirim.']);
    }

    // Ambil laporan harian kurir yang login
    public function laporanHarian(Request $request)
    {
        $kurirId = $request->user()->id;

        $laporan = DeliveryReport::where('kurir_id', $kurirId)
            ->whereDate('created_at', now()->toDateString())
            ->orderByDesc('created_at')
            ->get();

        return response()->json($laporan);
    }

    // Simpan laporan setelah pengiriman selesai
    public function simpanLaporan(Request $request)
{
    $request->validate([
        'order_id' => 'required|exists:orders,id',
        'customer' => 'required|string|max:255',
        'pesanan'  => 'nullable|string|max:255',
        'quantity' => 'nullable|integer',
        'waktu'    => 'nullable|string|max:10',   // jam kirim (auto)
        'jam_tiba' => 'required|string|max:10',   // BARU
        'diterima' => 'required|boolean',
        'alasan'   => 'nullable|string',           // dipakai sebagai catatan kurir
        'photo'    => 'nullable|image|max:4096',
    ]);

    $order = \App\Models\Order::where('id', $request->order_id)
        ->where('kurir_id', $request->user()->id)
        ->firstOrFail(); // pastikan order ini memang milik kurir yang login

    $photoPath = null;
    if ($request->hasFile('photo')) {
        $photoPath = $request->file('photo')->store('delivery_reports', 'public');
    }

    $laporan = DeliveryReport::create([
        'order_id' => $order->id,
        'kurir_id' => $request->user()->id,
        'customer' => $request->customer,
        'pesanan'  => $request->pesanan,
        'quantity' => $request->quantity,
        'waktu'    => $request->waktu,
        'jam_tiba' => $request->jam_tiba,
        'diterima' => $request->diterima,
        'alasan'   => $request->alasan,
        'photo'    => $photoPath,
    ]);

    return response()->json(['message' => 'Laporan berhasil disimpan.', 'data' => $laporan], 201);
}

// tambahan: buat prefill form (readonly fields) dari order yang baru selesai
public function orderDetail(Request $request, $id)
{
    $order = \App\Models\Order::with('menu:id,name', 'client:id,name,alamat')
        ->where('id', $id)
        ->where('kurir_id', $request->user()->id)
        ->firstOrFail();

    return response()->json([
        'id'       => $order->id,
        'customer' => $order->client->name ?? '—',
        'alamat'   => $order->address,
        'pesanan'  => $order->menu->name ?? '—',
        'quantity' => $order->quantity,
        'jam'      => $order->jam,
    ]);
}
public function tanpaLaporan(Request $request)
{
    $kurirId = $request->user()->id;

    $orders = Order::where('kurir_id', $kurirId)
        ->where('status', 'delivered')
        ->whereNotIn('id', DeliveryReport::pluck('order_id'))
        ->with('menu:id,name')
        ->orderByDesc('updated_at')
        ->get();

    return response()->json(['data' => $orders]);
}
    }