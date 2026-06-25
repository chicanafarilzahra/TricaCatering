// resources/js/pages/Klien/InvoiceKlien.jsx
// Full flow: Daftar → Detail → Pembayaran → Konfirmasi → Riwayat

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import NavbarKlien from "../../components/NavbarKlien";
import {
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaArrowLeft,
  FaDownload,
  FaEye,
  FaMoneyBillWave,
  FaUniversity,
  FaWallet,
  FaChevronRight,
  FaHistory,
  FaSpinner,
  FaExclamationTriangle,
  FaBan,
} from "react-icons/fa";

/* ─── palette & shared styles ─── */
const C = {
  bg: "#071028",
  card: "#182338",
  cardAlt: "#0f172a",
  border: "rgba(255,255,255,0.06)",
  blue: "#2563eb",
  blueLight: "#3b82f6",
  green: "#22c55e",
  amber: "#f59e0b",
  red: "#ef4444",
  muted: "#94a3b8",
  text: "#ffffff",
  subtext: "rgba(255,255,255,0.7)",
};

const STATUS_MAP = {
  unpaid: { label: "Belum Dibayar", color: C.amber, bg: "rgba(245,158,11,.15)", icon: <FaClock /> },
  pending: { label: "Menunggu Konfirmasi", color: "#a78bfa", bg: "rgba(167,139,250,.15)", icon: <FaClock /> },
  paid: { label: "Lunas", color: C.green, bg: "rgba(34,197,94,.15)", icon: <FaCheckCircle /> },
  selesai: { label: "Lunas", color: C.green, bg: "rgba(34,197,94,.15)", icon: <FaCheckCircle /> },
  cancelled: { label: "Dibatalkan", color: C.red, bg: "rgba(239,68,68,.15)", icon: <FaBan /> },
  dp_paid: { label: "DP Terbayar", color: "#38bdf8", bg: "rgba(56,189,248,.15)", icon: <FaCheckCircle /> },
};

const statusInfo = (s) => STATUS_MAP[s] || { label: s, color: C.muted, bg: "rgba(148,163,184,.1)", icon: <FaClock /> };

const fmt = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

/* ─── helpers ─── */
function Badge({ status, size = "sm" }) {
  const info = statusInfo(status);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: size === "lg" ? "10px 18px" : "6px 12px",
      borderRadius: 999, background: info.bg, color: info.color,
      fontWeight: 700, fontSize: size === "lg" ? 15 : 13,
    }}>
      {info.icon} {info.label}
    </span>
  );
}

function Btn({ children, onClick, variant = "primary", disabled, loading, style: s }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "12px 22px", borderRadius: 12, border: "none",
    fontWeight: 700, fontSize: 15, cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1, transition: "opacity .2s, transform .15s",
    ...s,
  };
  const variants = {
    primary: { background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff" },
    green: { background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff" },
    ghost: { background: "rgba(255,255,255,.06)", color: "#fff" },
    danger: { background: "rgba(239,68,68,.15)", color: C.red },
  };
  return (
    <button style={{ ...base, ...variants[variant] }} onClick={disabled ? undefined : onClick}>
      {loading ? <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> : children}
    </button>
  );
}

function Card({ children, style: s }) {
  return (
    <div style={{
      background: C.card, borderRadius: 20,
      border: `1px solid ${C.border}`, ...s,
    }}>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ borderTop: `1px solid ${C.border}`, margin: "16px 0" }} />;
}

/* ══════════════════════════════════════════════════════════
   VIEWS
══════════════════════════════════════════════════════════ */

/* ── 1. Daftar Invoice ── */
function ViewDaftar({ invoices, loading, onDetail, totalTagihan }) {
  const [tab, setTab] = useState("semua");

  const tabs = [
    { key: "semua", label: "Semua" },
    { key: "unpaid", label: "Belum Dibayar" },
    { key: "dp_paid", label: "Menunggu Pelunasan" },
    { key: "pending", label: "Menunggu Konfirmasi" },
    { key: "paid", label: "Lunas" },
    { key: "cancelled", label: "Dibatalkan" },
  ];

  const filtered = tab === "semua" ? invoices : invoices.filter(i => i.status === tab);

  return (
    <div>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg,#17306a,#21429b)",
        borderRadius: 24, padding: "30px 32px", marginBottom: 22,
      }}>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: 800 }}>Invoice Pembayaran</h1>
        <p style={{ color: "rgba(255,255,255,.7)", marginTop: 8, marginBottom: 0 }}>
          Semua riwayat tagihan dan pembayaran Anda
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 22 }}>
        {[
          { label: "Total Tagihan", value: fmt(totalTagihan), color: C.green },
          { label: "Belum Dibayar", value: invoices.filter(i => i.status === "unpaid").length + " Invoice", color: C.amber },
          { label: "Lunas", value: invoices.filter(i => ["paid","selesai"].includes(i.status)).length + " Invoice", color: C.green },
        ].map(c => (
          <Card key={c.label} style={{ padding: "20px 24px" }}>
            <div style={{ color: C.muted, fontSize: 13, marginBottom: 8 }}>{c.label}</div>
            <div style={{ color: c.color, fontSize: 26, fontWeight: 800 }}>{c.value}</div>
          </Card>
        ))}
      </div>

      {/* Table card */}
      <Card>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>Daftar Invoice</div>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding: "7px 14px", borderRadius: 999, border: "none",
                background: tab === t.key ? C.blue : "rgba(255,255,255,.06)",
                color: tab === t.key ? "#fff" : C.muted, fontWeight: 600,
                fontSize: 13, cursor: "pointer",
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 60, color: C.muted }}>
              <FaSpinner size={30} style={{ animation: "spin 1s linear infinite" }} />
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: C.cardAlt }}>
                  {["Invoice ID", "Tanggal", "Jatuh Tempo", "Layanan", "Total", "Status", "Aksi"].map(h => (
                    <th key={h} style={{ padding: "16px 18px", textAlign: "left", color: C.muted, fontSize: 13, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? filtered.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={tdStyle}><span style={{ color: C.blueLight, fontWeight: 700 }}>{inv.invoice_number || `INV-${inv.id}`}</span></td>
                    <td style={tdStyle}>{inv.created_at ? new Date(inv.created_at).toLocaleDateString("id-ID") : "-"}</td>
                    <td style={tdStyle}>{inv.due_date ? new Date(inv.due_date).toLocaleDateString("id-ID") : "-"}</td>
                    <td style={tdStyle}>{inv.order?.catering_package?.name || inv.order?.menu?.name || "Catering"}</td>
                    <td style={tdStyle}><span style={{ fontWeight: 700 }}>{fmt(inv.total_amount)}</span></td>
                    <td style={tdStyle}><Badge status={inv.status} /></td>
                    <td style={tdStyle}>
                      <Btn variant="ghost" onClick={() => onDetail(inv)} style={{ padding: "8px 14px", fontSize: 13 }}>
                        <FaEye /> Lihat
                      </Btn>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: 60, color: C.muted }}>
                      <FaFileInvoiceDollar size={40} style={{ marginBottom: 12 }} /><br />
                      Belum ada invoice
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ── 2. Detail Invoice ── */
function ViewDetail({ invoice, onBack, onBayar, onRiwayat }) {
  const isPelunasan = invoice.status === "dp_paid";
  const isUnpaid = invoice.status === "unpaid";
  const canPay = isUnpaid || isPelunasan;

  const dpAmount = invoice.dp_amount || 0;
  const totalAmount = invoice.total_amount || 0;
  const remaining = totalAmount - dpAmount;

  const handleDownloadPDF = () => {
    window.open(`/klien/invoice/${invoice.id}/pdf`, "_blank");
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, color: C.muted, fontSize: 14 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <FaArrowLeft /> Invoice
        </button>
        <FaChevronRight size={10} />
        <span style={{ color: C.text }}>Detail Invoice</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Detail Invoice</h1>
        <Btn variant="ghost" onClick={handleDownloadPDF} style={{ gap: 8 }}>
          <FaDownload /> Unduh PDF
        </Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Info invoice */}
          <Card style={{ padding: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <div style={{ color: C.muted, fontSize: 13, marginBottom: 4 }}>Invoice ID</div>
                <div style={{ fontWeight: 700, color: C.blueLight }}>{invoice.invoice_number || `INV-${invoice.id}`}</div>
              </div>
              <div>
                <div style={{ color: C.muted, fontSize: 13, marginBottom: 4 }}>Tanggal Dibuat</div>
                <div style={{ fontWeight: 600 }}>{invoice.created_at ? new Date(invoice.created_at).toLocaleDateString("id-ID") : "-"}</div>
              </div>
              <div>
                <div style={{ color: C.muted, fontSize: 13, marginBottom: 4 }}>Jatuh Tempo</div>
                <div style={{ fontWeight: 600 }}>{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString("id-ID") : "-"}</div>
              </div>
              <div>
                <div style={{ color: C.muted, fontSize: 13, marginBottom: 4 }}>Status</div>
                <Badge status={invoice.status} size="lg" />
              </div>
            </div>
            <Divider />
            <div>
              <div style={{ color: C.muted, fontSize: 13, marginBottom: 4 }}>Referensi</div>
              <div style={{ fontWeight: 600 }}>{invoice.order?.event_name || invoice.description || "-"}</div>
            </div>
          </Card>

          {/* Info penagihan */}
          <Card style={{ padding: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Informasi Penagihan</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ color: C.muted, fontSize: 13, marginBottom: 4 }}>Ditujukan Kepada</div>
                <div style={{ fontWeight: 700 }}>{invoice.client?.name || "-"}</div>
                <div style={{ color: C.subtext, fontSize: 14, marginTop: 4 }}>{invoice.client?.address || ""}</div>
              </div>
              <div>
                <div style={{ color: C.muted, fontSize: 13, marginBottom: 4 }}>Kontak</div>
                <div style={{ fontSize: 14 }}>{invoice.client?.email || "-"}</div>
                <div style={{ fontSize: 14 }}>{invoice.client?.phone || ""}</div>
              </div>
            </div>
          </Card>

          {/* Rincian item */}
          <Card style={{ overflow: "hidden" }}>
            <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.border}`, fontWeight: 700, fontSize: 16 }}>Rincian Item</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: C.cardAlt }}>
                  {["No", "Deskripsi", "Jumlah", "Harga Satuan", "Pajak", "Total"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: C.muted, fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(invoice.items || [invoice]).map((item, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "14px 16px", color: C.muted }}>{i + 1}</td>
                    <td style={{ padding: "14px 16px" }}>{item.description || item.menu?.name || "Layanan Catering"}</td>
                    <td style={{ padding: "14px 16px" }}>{item.quantity || 1}</td>
                    <td style={{ padding: "14px 16px" }}>{fmt(item.unit_price || item.price || 0)}</td>
                    <td style={{ padding: "14px 16px" }}>{item.tax_percent || 11}%</td>
                    <td style={{ padding: "14px 16px", fontWeight: 700 }}>{fmt(item.total_price || item.total_amount || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Ringkasan */}
          <Card style={{ padding: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Ringkasan Pembayaran</div>
            <RowFlex label="Subtotal" value={fmt(invoice.subtotal || totalAmount / 1.11)} />
            <RowFlex label="Pajak (11%)" value={fmt(invoice.tax_amount || totalAmount - totalAmount / 1.11)} />
            <Divider />
            <RowFlex label="Total" value={fmt(totalAmount)} bold />
            {dpAmount > 0 && (
              <>
                <RowFlex label="DP Terbayar" value={`- ${fmt(dpAmount)}`} color={C.green} />
                <Divider />
                <RowFlex label="Sisa Pembayaran" value={fmt(remaining)} bold color={remaining > 0 ? C.amber : C.green} />
              </>
            )}
          </Card>

          {/* Action buttons */}
          {canPay && (
            <Btn variant="green" onClick={() => onBayar(invoice)} style={{ width: "100%", justifyContent: "center", fontSize: 16, padding: "16px" }}>
              <FaMoneyBillWave />
              {isPelunasan ? "Lunasi Sekarang" : "Bayar Sekarang"}
            </Btn>
          )}

          <Btn variant="ghost" onClick={onRiwayat} style={{ width: "100%", justifyContent: "center" }}>
            <FaHistory /> Lihat Riwayat Pembayaran
          </Btn>

          {canPay && (
            <div style={{
              background: "rgba(245,158,11,.08)", borderRadius: 12,
              padding: 16, border: "1px solid rgba(245,158,11,.2)",
              color: C.amber, fontSize: 13, display: "flex", gap: 8,
            }}>
              <FaExclamationTriangle style={{ marginTop: 2, flexShrink: 0 }} />
              <span>Lakukan pembayaran sebelum jatuh tempo untuk menghindari pembatalan order.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── 3. Proses Pembayaran ── */
function ViewPembayaran({ invoice, onBack, onSuccess }) {
  const [metode, setMetode] = useState(null);
  const [bankSelected, setBankSelected] = useState(null);
  const [bukti, setBukti] = useState(null);
  const [buktiPreview, setBuktiPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentChannels, setPaymentChannels] = useState({ banks: [], ewallets: [] });
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [catatan, setCatatan] = useState("");

  const isPelunasan = invoice.status === "dp_paid";
  const dpAmount = invoice.dp_amount || 0;
  const totalAmount = invoice.total_amount || 0;
  const bayarAmount = isPelunasan ? totalAmount - dpAmount : (invoice.is_dp ? totalAmount * 0.5 : totalAmount);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await axios.get(`/klien/invoice/${invoice.id}/payment-channels`);
        setPaymentChannels(res.data);
      } catch {
        // fallback empty
      } finally {
        setLoadingChannels(false);
      }
    };
    fetchChannels();
  }, [invoice.id]);

  const handleBukti = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBukti(file);
      setBuktiPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!bankSelected || !bukti) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("payment_channel_id", bankSelected.id);
      fd.append("payment_proof", bukti);
      fd.append("note", catatan);
      fd.append("type", isPelunasan ? "pelunasan" : (invoice.is_dp ? "dp" : "full"));

      await axios.post(`/klien/invoice/${invoice.id}/pay`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSuccess(invoice);
    } catch (err) {
      alert(err?.response?.data?.message || "Gagal mengirim pembayaran");
    } finally {
      setLoading(false);
    }
  };

  const channels = metode === "bank"
    ? paymentChannels.banks || []
    : metode === "ewallet"
      ? paymentChannels.ewallets || []
      : [];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, color: C.muted, fontSize: 14 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <FaArrowLeft /> Detail Invoice
        </button>
        <FaChevronRight size={10} />
        <span style={{ color: C.text }}>Pembayaran</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* LEFT: Pilih metode */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Card style={{ padding: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>
              {isPelunasan ? "Pelunasan Invoice" : "Pembayaran Invoice"} — {invoice.invoice_number || `INV-${invoice.id}`}
            </div>

            {/* Pilih tipe metode */}
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Pilih Metode Pembayaran</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {[
                { key: "bank", label: "Transfer Bank", desc: "Lakukan transfer ke rekening berikut", icon: <FaUniversity size={20} /> },
                { key: "ewallet", label: "E-Wallet", desc: "OVO, GoPay, Dana, ShopeePay, dan lainnya", icon: <FaWallet size={20} /> },
              ].map(m => (
                <div key={m.key} onClick={() => { setMetode(m.key); setBankSelected(null); }}
                  style={{
                    border: `2px solid ${metode === m.key ? C.blue : C.border}`,
                    borderRadius: 14, padding: 16, cursor: "pointer",
                    background: metode === m.key ? "rgba(37,99,235,.1)" : "transparent",
                    display: "flex", alignItems: "center", gap: 14,
                    transition: "all .2s",
                  }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: metode === m.key ? C.blue : "rgba(255,255,255,.06)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: metode === m.key ? "#fff" : C.muted,
                  }}>{m.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{m.label}</div>
                    <div style={{ color: C.muted, fontSize: 13 }}>{m.desc}</div>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%",
                      border: `2px solid ${metode === m.key ? C.blue : C.muted}`,
                      background: metode === m.key ? C.blue : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {metode === m.key && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Daftar channel */}
            {metode && (
              <div>
                <div style={{ fontWeight: 600, marginBottom: 12 }}>
                  {metode === "bank" ? "Pilih Rekening Bank" : "Pilih E-Wallet"}
                </div>
                {loadingChannels ? (
                  <div style={{ color: C.muted, textAlign: "center", padding: 20 }}>
                    <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> Memuat...
                  </div>
                ) : channels.length === 0 ? (
                  <div style={{ color: C.muted, padding: 20, textAlign: "center" }}>
                    Belum ada {metode === "bank" ? "rekening bank" : "e-wallet"} yang tersedia
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {channels.map(ch => (
                      <div key={ch.id} onClick={() => setBankSelected(ch)}
                        style={{
                          border: `2px solid ${bankSelected?.id === ch.id ? C.green : C.border}`,
                          borderRadius: 14, padding: 16, cursor: "pointer",
                          background: bankSelected?.id === ch.id ? "rgba(34,197,94,.06)" : "rgba(255,255,255,.02)",
                          display: "flex", alignItems: "center", gap: 14,
                        }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 15 }}>{ch.bank_name || ch.wallet_name}</div>
                          <div style={{ color: C.blueLight, fontWeight: 700, fontSize: 18, marginTop: 2 }}>
                            {ch.account_number}
                          </div>
                          <div style={{ color: C.muted, fontSize: 13 }}>a.n. {ch.account_name}</div>
                        </div>
                        {bankSelected?.id === ch.id && <FaCheckCircle color={C.green} size={22} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Upload bukti */}
          {bankSelected && (
            <Card style={{ padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Upload Bukti Pembayaran</div>
              <p style={{ color: C.muted, fontSize: 14, marginBottom: 16 }}>
                Transfer sejumlah <strong style={{ color: C.amber }}>{fmt(bayarAmount)}</strong> ke rekening di atas,
                lalu upload bukti transfer.
              </p>

              <label style={{
                display: "block", border: `2px dashed ${buktiPreview ? C.green : C.border}`,
                borderRadius: 14, padding: 24, textAlign: "center",
                cursor: "pointer", background: "rgba(255,255,255,.02)",
              }}>
                <input type="file" accept="image/*,.pdf" onChange={handleBukti} style={{ display: "none" }} />
                {buktiPreview ? (
                  <img src={buktiPreview} alt="bukti" style={{ maxHeight: 200, maxWidth: "100%", borderRadius: 10, objectFit: "contain" }} />
                ) : (
                  <>
                    <FaDownload size={30} color={C.muted} style={{ marginBottom: 10 }} />
                    <div style={{ color: C.muted }}>Klik untuk upload atau drag & drop</div>
                    <div style={{ color: C.muted, fontSize: 13, marginTop: 6 }}>PNG, JPG, PDF (maks. 5MB)</div>
                  </>
                )}
              </label>

              <div style={{ marginTop: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Catatan (opsional)</div>
                <textarea
                  value={catatan}
                  onChange={e => setCatatan(e.target.value)}
                  placeholder="Mis: Transfer dari BCA 1234..."
                  rows={3}
                  style={{
                    width: "100%", background: C.cardAlt, border: `1px solid ${C.border}`,
                    borderRadius: 10, padding: 12, color: "#fff", fontSize: 14,
                    resize: "vertical", boxSizing: "border-box",
                  }}
                />
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT: Ringkasan */}
        <div>
          <Card style={{ padding: 24, position: "sticky", top: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Ringkasan Pembayaran</div>
            <div style={{ color: C.muted, fontSize: 13, marginBottom: 4 }}>Invoice</div>
            <div style={{ fontWeight: 700, color: C.blueLight, marginBottom: 16 }}>{invoice.invoice_number || `INV-${invoice.id}`}</div>
            <div style={{ color: C.muted, fontSize: 13, marginBottom: 4 }}>Total yang Harus Dibayar</div>
            <div style={{ fontWeight: 800, fontSize: 28, color: C.amber, marginBottom: 20 }}>{fmt(bayarAmount)}</div>
            <Divider />
            <RowFlex label="Subtotal" value={fmt(invoice.subtotal || totalAmount / 1.11)} />
            <RowFlex label="Pajak (11%)" value={fmt(invoice.tax_amount || totalAmount - totalAmount / 1.11)} />
            {dpAmount > 0 && <RowFlex label="DP Terbayar" value={`- ${fmt(dpAmount)}`} color={C.green} />}
            <Divider />
            <RowFlex label={isPelunasan ? "Sisa Bayar" : (invoice.is_dp ? "DP (50%)" : "Total")} value={fmt(bayarAmount)} bold color={C.amber} />

            <div style={{ marginTop: 20 }}>
              <Btn
                variant="green"
                onClick={handleSubmit}
                disabled={!bankSelected || !bukti}
                loading={loading}
                style={{ width: "100%", justifyContent: "center", fontSize: 16, padding: 16 }}
              >
                Lanjutkan Pembayaran
              </Btn>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ── 4. Konfirmasi Pembayaran ── */
function ViewKonfirmasi({ invoice, onLihatInvoice, onBack }) {
  return (
    <div style={{ maxWidth: 520, margin: "0 auto", paddingTop: 40 }}>
      <Card style={{ padding: 40, textAlign: "center" }}>
        {/* Checkmark */}
        <div style={{
          width: 90, height: 90, borderRadius: "50%",
          background: "rgba(34,197,94,.15)", border: "3px solid rgba(34,197,94,.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px",
        }}>
          <FaCheckCircle size={44} color={C.green} />
        </div>

        <h2 style={{ margin: "0 0 10px", fontSize: 26, fontWeight: 800 }}>Pembayaran Berhasil!</h2>
        <p style={{ color: C.muted, margin: "0 0 28px" }}>
          Terima kasih, bukti pembayaran Anda telah berhasil dikirim. Kami akan segera memverifikasi pembayaran Anda.
        </p>

        <div style={{ background: C.cardAlt, borderRadius: 14, padding: 20, textAlign: "left", marginBottom: 24 }}>
          <RowFlex label="Invoice" value={invoice.invoice_number || `INV-${invoice.id}`} />
          <RowFlex label="Tanggal Pembayaran" value={new Date().toLocaleDateString("id-ID") + ", " + new Date().toLocaleTimeString("id-ID")} />
          <Divider />
          <RowFlex label="Total Dibayar" value={fmt(invoice.dp_amount > 0 ? invoice.total_amount - invoice.dp_amount : invoice.total_amount)} bold color={C.green} />
        </div>

        <p style={{ color: C.muted, fontSize: 13, marginBottom: 28 }}>
          Status invoice akan berubah setelah pembayaran dikonfirmasi oleh tim kami.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Btn variant="primary" onClick={onLihatInvoice} style={{ width: "100%", justifyContent: "center", padding: 14 }}>
            Lihat Invoice
          </Btn>
          <Btn variant="ghost" onClick={onBack} style={{ width: "100%", justifyContent: "center" }}>
            Kembali ke Daftar Invoice
          </Btn>
        </div>
      </Card>
    </div>
  );
}

/* ── 5. Riwayat Pembayaran ── */
function ViewRiwayat({ invoice, onBack }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`/klien/invoice/${invoice.id}/payments`);
        setPayments(res.data.data || []);
      } catch {
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [invoice.id]);

  const timeline = [
    { label: "Invoice Dibuat", desc: "Invoice telah dibuat dan dikirim ke Anda.", time: invoice.created_at, done: true },
    { label: "Pembayaran Diterima", desc: "Pembayaran telah kami terima, menunggu verifikasi.", time: payments[0]?.created_at, done: payments.length > 0 },
    { label: "Menunggu Konfirmasi", desc: "Pembayaran sedang dikonfirmasi oleh tim kami.", time: payments.find(p => p.status === "pending")?.updated_at, done: ["pending","confirmed","paid","selesai"].includes(invoice.status) },
    { label: "Pembayaran Berhasil", desc: "Pembayaran telah diterima dan invoice dinyatakan lunas.", time: payments.find(p => p.status === "confirmed")?.updated_at, done: ["paid","selesai"].includes(invoice.status) },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, color: C.muted, fontSize: 14 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <FaArrowLeft /> Invoice
        </button>
        <FaChevronRight size={10} />
        <span style={{ color: C.text }}>Riwayat Pembayaran</span>
      </div>

      <h1 style={{ margin: "0 0 22px", fontSize: 28, fontWeight: 800 }}>Riwayat Pembayaran</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Summary */}
          <Card style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div style={{ fontWeight: 700, color: C.blueLight }}>{invoice.invoice_number || `INV-${invoice.id}`}</div>
              <Badge status={invoice.status} size="lg" />
            </div>
            <div style={{ color: C.muted, fontSize: 13 }}>Total: <strong style={{ color: C.text }}>{fmt(invoice.total_amount)}</strong></div>
          </Card>

          {/* Timeline */}
          <Card style={{ padding: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Riwayat</div>
            {loading ? (
              <div style={{ textAlign: "center", padding: 30, color: C.muted }}>
                <FaSpinner style={{ animation: "spin 1s linear infinite" }} />
              </div>
            ) : (
              <div style={{ position: "relative" }}>
                {timeline.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, marginBottom: i < timeline.length - 1 ? 0 : 0 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                        background: item.done ? "rgba(34,197,94,.15)" : "rgba(255,255,255,.06)",
                        border: `2px solid ${item.done ? C.green : C.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: item.done ? C.green : C.muted, zIndex: 1,
                      }}>
                        {item.done ? <FaCheckCircle size={14} /> : <FaClock size={12} />}
                      </div>
                      {i < timeline.length - 1 && (
                        <div style={{
                          width: 2, flex: 1, minHeight: 40,
                          background: item.done ? C.green : C.border,
                          margin: "4px 0",
                        }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: i < timeline.length - 1 ? 24 : 0 }}>
                      <div style={{ fontWeight: 700, marginBottom: 2 }}>{item.label}</div>
                      <div style={{ color: C.muted, fontSize: 13, marginBottom: 4 }}>{item.desc}</div>
                      {item.time && (
                        <div style={{ color: C.muted, fontSize: 12 }}>
                          {new Date(item.time).toLocaleDateString("id-ID")}, {new Date(item.time).toLocaleTimeString("id-ID")}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Detail pembayaran */}
          {payments.length > 0 && (
            <Card style={{ overflow: "hidden" }}>
              <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.border}`, fontWeight: 700 }}>Detail Pembayaran</div>
              {payments.map((p, i) => (
                <div key={i} style={{ padding: "18px 24px", borderBottom: i < payments.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ fontWeight: 700 }}>
                      {p.type === "dp" ? "Uang Muka (DP)" : p.type === "pelunasan" ? "Pelunasan" : "Pembayaran Penuh"}
                    </div>
                    <Badge status={p.status === "confirmed" ? "paid" : "pending"} />
                  </div>
                  <RowFlex label="Jumlah" value={fmt(p.amount)} bold />
                  <RowFlex label="Metode" value={p.payment_channel?.bank_name || p.payment_channel?.wallet_name || "-"} />
                  <RowFlex label="Rekening / No." value={p.payment_channel?.account_number || "-"} />
                  <RowFlex label="Tanggal" value={p.created_at ? new Date(p.created_at).toLocaleDateString("id-ID") : "-"} />
                  {p.proof_url && (
                    <div style={{ marginTop: 10 }}>
                      <a href={p.proof_url} target="_blank" rel="noreferrer"
                        style={{ color: C.blueLight, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <FaEye /> Lihat Bukti Transfer
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </Card>
          )}
        </div>

        {/* RIGHT */}
        <div>
          <Card style={{ padding: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Ringkasan</div>
            <RowFlex label="Total Invoice" value={fmt(invoice.total_amount)} />
            <RowFlex label="DP Terbayar" value={fmt(invoice.dp_amount || 0)} color={C.green} />
            <RowFlex label="Pelunasan" value={fmt(payments.filter(p => p.type === "pelunasan" && p.status === "confirmed").reduce((a, p) => a + parseFloat(p.amount || 0), 0))} color={C.green} />
            <Divider />
            <RowFlex
              label="Sisa Tagihan"
              value={fmt(Math.max(0, invoice.total_amount - (invoice.dp_amount || 0) - payments.filter(p => p.type !== "dp" && p.status === "confirmed").reduce((a, p) => a + parseFloat(p.amount || 0), 0)))}
              bold color={C.amber}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared row util ─── */
function RowFlex({ label, value, bold, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0" }}>
      <span style={{ color: C.muted, fontSize: 14 }}>{label}</span>
      <span style={{ fontWeight: bold ? 700 : 500, color: color || C.text, fontSize: bold ? 16 : 14 }}>{value}</span>
    </div>
  );
}

const tdStyle = { padding: "16px 18px", color: C.text };

/* ══════════════════════════════════════════════════════════
   ROOT COMPONENT
══════════════════════════════════════════════════════════ */
export default function InvoiceKlien() {
  const [invoices, setInvoices] = useState([]);
  const [totalTagihan, setTotalTagihan] = useState(0);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("daftar"); // daftar | detail | bayar | konfirmasi | riwayat
  const [activeInvoice, setActiveInvoice] = useState(null);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.background = C.bg;
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/klien/invoice");
      setInvoices(res.data.data || []);
      setTotalTagihan(res.data.total_tagihan || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDetail = (inv) => {
    setActiveInvoice(inv);
    setView("detail");
  };

  const handleBayar = (inv) => {
    setActiveInvoice(inv);
    setView("bayar");
  };

  const handleSuccess = (inv) => {
    setActiveInvoice(inv);
    setView("konfirmasi");
    loadInvoices(); // refresh list
  };

  const handleRiwayat = () => setView("riwayat");
  const goBack = () => setView("daftar");
  const goDetail = () => setView("detail");

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        body {
  font-family: "Times New Roman", Times, serif;
}
        textarea:focus, input:focus { outline: 1px solid #2563eb; }
      `}</style>

      <NavbarKlien />

      <div style={{ padding: "30px 24px", maxWidth: 1400, margin: "0 auto" }}>
        {view === "daftar" && (
          <ViewDaftar
            invoices={invoices}
            loading={loading}
            totalTagihan={totalTagihan}
            onDetail={handleDetail}
          />
        )}
        {view === "detail" && activeInvoice && (
          <ViewDetail
            invoice={activeInvoice}
            onBack={goBack}
            onBayar={handleBayar}
            onRiwayat={handleRiwayat}
          />
        )}
        {view === "bayar" && activeInvoice && (
          <ViewPembayaran
            invoice={activeInvoice}
            onBack={goDetail}
            onSuccess={handleSuccess}
          />
        )}
        {view === "konfirmasi" && activeInvoice && (
          <ViewKonfirmasi
            invoice={activeInvoice}
            onLihatInvoice={goDetail}
            onBack={goBack}
          />
        )}
        {view === "riwayat" && activeInvoice && (
          <ViewRiwayat
            invoice={activeInvoice}
            onBack={goDetail}
          />
        )}
      </div>
    </div>
  );
}