<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Invoice {{ $invoice->invoice_number }}</title>
<style>
  body {
    font-family: DejaVu Sans, sans-serif;
    font-size: 13px;
    color: #333;
    margin: 0;
    padding: 40px 50px;
    background: #fff;
  }

  /* ── Top bar ── */
  .topbar {
    background: #1e3a5f;
    color: #fff;
    padding: 18px 28px;
    margin: -40px -50px 36px -50px;
    display: table;
    width: calc(100% + 100px);
  }
  .topbar-left  { display: table-cell; vertical-align: middle; }
  .topbar-right { display: table-cell; vertical-align: middle; text-align: right; }
  .company-name { font-size: 20px; font-weight: bold; letter-spacing: 0.5px; }
  .company-tagline { font-size: 11px; color: #a8c4e0; margin-top: 2px; }
  .invoice-label { font-size: 22px; font-weight: bold; letter-spacing: 1px; }
  .invoice-num   { font-size: 12px; color: #a8c4e0; margin-top: 3px; }

  /* ── Meta row ── */
  .meta-row {
    display: table;
    width: 100%;
    margin-bottom: 28px;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 22px;
  }
  .meta-cell { display: table-cell; width: 25%; vertical-align: top; }
  .meta-label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
  .meta-value { font-size: 13px; font-weight: bold; color: #1e3a5f; }

  /* ── Badge ── */
  .badge { display: inline-block; padding: 3px 11px; border-radius: 12px; font-size: 11px; font-weight: bold; }
  .badge-unpaid    { background: #fff3cd; color: #856404; }
  .badge-pending   { background: #cff4fc; color: #055160; }
  .badge-dp_paid   { background: #d1ecf1; color: #0c5460; }
  .badge-paid      { background: #d4edda; color: #155724; }
  .badge-selesai   { background: #d4edda; color: #155724; }
  .badge-cancelled { background: #f8d7da; color: #721c24; }

  /* ── Billing ── */
  .billing-row { display: table; width: 100%; margin-bottom: 28px; }
  .billing-col { display: table-cell; width: 50%; vertical-align: top; }
  .billing-title { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
  .billing-name  { font-size: 15px; font-weight: bold; color: #1e3a5f; margin-bottom: 3px; }
  .billing-detail { font-size: 12px; color: #555; line-height: 1.8; }

  /* ── Table ── */
  table.items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  table.items thead tr { background: #1e3a5f; color: #fff; }
  table.items th {
    padding: 11px 14px;
    text-align: left;
    font-size: 11px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  table.items th:last-child { text-align: right; }
  table.items td { padding: 12px 14px; border-bottom: 1px solid #eee; font-size: 13px; }
  table.items td:last-child { text-align: right; font-weight: bold; }
  table.items tbody tr:last-child td { border-bottom: none; }
  table.items tbody tr:nth-child(even) td { background: #f9f9f9; }

  /* ── Summary box ── */
  .summary-wrap { text-align: right; margin-bottom: 28px; }
  .summary-table { display: inline-table; min-width: 260px; border: 1px solid #e5e5e5; border-radius: 6px; overflow: hidden; }
  .summary-row { display: table-row; }
  .summary-label, .summary-value { display: table-cell; padding: 8px 16px; font-size: 13px; }
  .summary-label { color: #666; }
  .summary-value { font-weight: 600; text-align: right; }
  .summary-divider { border-top: 1px solid #e5e5e5; }
  .summary-total .summary-label { font-size: 14px; font-weight: bold; color: #1e3a5f; background: #eef3f9; }
  .summary-total .summary-value { font-size: 14px; font-weight: bold; color: #1e3a5f; background: #eef3f9; }
  .summary-dp     .summary-value { color: #28a745; }
  .summary-sisa   .summary-label { font-weight: bold; }
  .summary-sisa   .summary-value { color: #d97706; font-weight: bold; }

  /* ── Notes ── */
  .notes { background: #f8f9fa; border-left: 3px solid #1e3a5f; padding: 12px 16px; font-size: 12px; color: #555; margin-bottom: 28px; line-height: 1.7; }

  /* ── Footer ── */
  .footer {
    border-top: 1px solid #e5e5e5;
    padding-top: 16px;
    text-align: center;
    font-size: 11px;
    color: #aaa;
    margin-top: 20px;
  }
  .footer strong { color: #555; }
</style>
</head>
<body>

{{-- ── Top bar ── --}}
<div class="topbar">
  <div class="topbar-left">
    <div class="company-name">🍽 Trica Catering</div>
    <div class="company-tagline">Solusi Catering Profesional</div>
  </div>
  <div class="topbar-right">
    <div class="invoice-label">INVOICE</div>
    <div class="invoice-num">{{ $invoice->invoice_number }}</div>
  </div>
</div>

{{-- ── Meta row ── --}}
<div class="meta-row">
  <div class="meta-cell">
    <div class="meta-label">Tanggal Dibuat</div>
    <div class="meta-value">{{ \Carbon\Carbon::parse($invoice->created_at)->format('d M Y') }}</div>
  </div>
  <div class="meta-cell">
    <div class="meta-label">Jatuh Tempo</div>
    <div class="meta-value" style="color: #c0392b;">
      {{ $invoice->due_date ? \Carbon\Carbon::parse($invoice->due_date)->format('d M Y') : '—' }}
    </div>
  </div>
  <div class="meta-cell">
    <div class="meta-label">Tipe Pesanan</div>
    <div class="meta-value" style="text-transform: capitalize;">{{ $invoice->order->type ?? '—' }}</div>
  </div>
  <div class="meta-cell">
    <div class="meta-label">Status</div>
    @php
      $statusMap = [
        'unpaid'    => ['label' => 'Belum Dibayar',       'class' => 'badge-unpaid'],
        'pending'   => ['label' => 'Menunggu Konfirmasi', 'class' => 'badge-pending'],
        'dp_paid'   => ['label' => 'DP Terbayar',         'class' => 'badge-dp_paid'],
        'paid'      => ['label' => 'Lunas',               'class' => 'badge-paid'],
        'selesai'   => ['label' => 'Selesai',             'class' => 'badge-selesai'],
        'cancelled' => ['label' => 'Dibatalkan',          'class' => 'badge-cancelled'],
      ];
      $s = $statusMap[$invoice->status] ?? ['label' => $invoice->status, 'class' => 'badge-pending'];
    @endphp
    <span class="badge {{ $s['class'] }}">{{ $s['label'] }}</span>
  </div>
</div>

{{-- ── Billing ── --}}
<div class="billing-row">
  <div class="billing-col">
    <div class="billing-title">Dari</div>
    <div class="billing-name">Trica Catering</div>
    <div class="billing-detail">
      Jl. Raya Catering No. 1<br>
      info@tricacatering.com<br>
      (021) 1234-5678
    </div>
  </div>
  <div class="billing-col">
    <div class="billing-title">Ditagihkan Kepada</div>
    <div class="billing-name">{{ $invoice->client->name ?? '—' }}</div>
    <div class="billing-detail">
      {{ $invoice->client->email ?? '' }}<br>
      {{ $invoice->client->phone ?? '' }}
    </div>
  </div>
</div>

{{-- ── Items table ── --}}
<table class="items">
  <thead>
    <tr>
      <th style="width:5%">No</th>
      <th>Deskripsi</th>
      <th style="width:10%; text-align:center">Qty</th>
      <th style="width:20%; text-align:right">Harga Satuan</th>
      <th style="width:20%">Total</th>
    </tr>
  </thead>
  <tbody>
    @php
      $qty       = $invoice->order->quantity ?? 1;
      $unitPrice = $qty > 0 ? ($invoice->subtotal / $qty) : $invoice->subtotal;
    @endphp
    <tr>
      <td style="color:#888">1</td>
      <td>
        <strong>{{ $invoice->order->menu->name ?? 'Layanan Catering' }}</strong>
        @if($invoice->order->event_date)
          <br><span style="font-size:11px; color:#888">
            Tanggal: {{ \Carbon\Carbon::parse($invoice->order->event_date)->format('d M Y') }}
          </span>
        @endif
        @if($invoice->notes)
          <br><span style="font-size:11px; color:#888">{{ $invoice->notes }}</span>
        @endif
      </td>
      <td style="text-align:center">{{ $qty }}</td>
      <td style="text-align:right">Rp {{ number_format($unitPrice, 0, ',', '.') }}</td>
      <td>Rp {{ number_format($invoice->subtotal, 0, ',', '.') }}</td>
    </tr>
  </tbody>
</table>

{{-- ── Summary ── --}}
<div class="summary-wrap">
  <table class="summary-table">
    <div class="summary-row">
      <div class="summary-label">Subtotal</div>
      <div class="summary-value">Rp {{ number_format($invoice->subtotal ?? 0, 0, ',', '.') }}</div>
    </div>
    @if(($invoice->tax ?? 0) > 0)
    <div class="summary-row summary-divider">
      <div class="summary-label">Pajak</div>
      <div class="summary-value">Rp {{ number_format($invoice->tax, 0, ',', '.') }}</div>
    </div>
    @endif
    @if(($invoice->discount ?? 0) > 0)
    <div class="summary-row summary-divider">
      <div class="summary-label">Diskon</div>
      <div class="summary-value" style="color:#28a745">- Rp {{ number_format($invoice->discount, 0, ',', '.') }}</div>
    </div>
    @endif
    <div class="summary-row summary-divider summary-total">
      <div class="summary-label">Total</div>
      <div class="summary-value">Rp {{ number_format($invoice->total_amount, 0, ',', '.') }}</div>
    </div>
    @if(($invoice->dp_amount ?? 0) > 0)
    <div class="summary-row summary-divider summary-dp">
      <div class="summary-label">DP Terbayar</div>
      <div class="summary-value">Rp {{ number_format($invoice->dp_amount, 0, ',', '.') }}</div>
    </div>
    <div class="summary-row summary-divider summary-sisa">
      <div class="summary-label">Sisa Tagihan</div>
      <div class="summary-value">Rp {{ number_format(max(0, $invoice->total_amount - $invoice->dp_amount), 0, ',', '.') }}</div>
    </div>
    @endif
  </table>
</div>

{{-- ── Notes ── --}}
<div class="notes">
  <strong>Catatan:</strong> Harap lakukan pembayaran sebelum jatuh tempo. Konfirmasi pembayaran dapat dilakukan
  melalui aplikasi dengan mengupload bukti transfer. Hubungi kami di <strong>info@tricacatering.com</strong>
  jika ada pertanyaan.
</div>

{{-- ── Footer ── --}}
<div class="footer">
  Dokumen ini dibuat otomatis oleh sistem · Trica Catering © {{ date('Y') }}<br>
  <strong>{{ $invoice->invoice_number }}</strong> · Dicetak {{ \Carbon\Carbon::now()->format('d M Y, H:i') }} WIB
</div>

</body>
</html>