<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DeliveryScheduleResource extends JsonResource
{
    /**
     * Bentuk JSON satu baris jadwal kirim (delivery_schedules)
     * yang dikonsumsi oleh halaman kurir: RuteHariIni.jsx,
     * JadwalPengiriman.jsx, dan PengirimanAktif.jsx.
     *
     * PENTING: resource ini TIDAK memfilter berdasarkan kurir.
     * Filter "ini jadwal milik kurir siapa" dilakukan SEBELUM
     * resource ini dipanggil, di KurirOrderController::rute()
     * dan KurirOrderController::schedules() lewat:
     *
     *   whereHas('order', fn ($q) => $q->where('kurir_id', $kurirId))
     *
     * Resource ini hanya membentuk ulang setiap baris yang sudah
     * lolos filter itu jadi struktur JSON yang seragam.
     */
    public function toArray($request): array
    {
        return [
            'id'            => $this->id,            // ID JADWAL — dipakai di endpoint update-status & location
            'order_id'      => $this->order_id,
            'status'        => $this->status,         // scheduled | on_delivery | delivered
            'tanggal_kirim' => $this->tanggal_kirim,
            'jam_kirim'     => $this->jam_kirim,

            // data customer — flat column di tabel orders, BUKAN relasi
            'customer_name' => $this->order->customer_name,
            'phone'         => $this->order->phone,
            'address'       => $this->order->address,

            // koordinat untuk peta
            'lat_klien'     => $this->order->lat_klien,
            'lng_klien'     => $this->order->lng_klien,
            'lat_dapur'     => $this->order->lat_dapur,
            'lng_dapur'     => $this->order->lng_dapur,

            'quantity'      => $this->order->quantity,
            'delivery_fee'  => $this->order->delivery_fee,
            'menu'          => ['name' => $this->order->menu?->name],
        ];
    }
}