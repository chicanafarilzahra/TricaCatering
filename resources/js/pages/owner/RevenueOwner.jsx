// resources/js/pages/Owner/RevenueOwner.jsx
// ✅ UPDATED: Konfirmasi pembayaran masuk + tombol kirim uang jasa kurir otomatis

import { useState, useEffect } from "react";
import axios from "axios";
import {
    DollarSign, TrendingUp, Calendar, Wallet,
    Plus, Trash2, CreditCard, Smartphone,
    CheckCircle, X, Building2, Edit2,
    LayoutDashboard, ShoppingBag,
    BarChart3, Package, Eye, RefreshCw,
    Truck, Send, AlertCircle, Clock,
    CheckCheck, ChevronDown, ChevronUp,
    ArrowRight, Info,
} from "lucide-react";
import OwnerLayout from "../../layouts/OwnerLayout";

/* ── font injection ─────────────────────────────────────────── */
if (typeof document !== "undefined" && !document.getElementById("inter-font")) {
    const l = document.createElement("link");
    l.id   = "inter-font"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(l);
}

/* ── tokens ─────────────────────────────────────────────────── */
const C = {
    bg:      "#080C14",
    surface: "#0F1623",
    card:    "#141E30",
    border:  "rgba(255,255,255,0.07)",
    borderMd:"rgba(255,255,255,0.10)",
    text:    "#F8FAFC",
    muted:   "#64748B",
    sub:     "#94A3B8",
    font:    "'Inter', system-ui, -apple-system, sans-serif",
};

const bars = {
    green:  "linear-gradient(90deg,#10b981,#34d399)",
    blue:   "linear-gradient(90deg,#3b82f6,#60a5fa)",
    amber:  "linear-gradient(90deg,#f59e0b,#fbbf24)",
    indigo: "linear-gradient(90deg,#6366f1,#818cf8)",
};

const inp = (err = false) => ({
    width: "100%", height: "40px", borderRadius: "8px",
    border: `0.5px solid ${err ? "rgba(239,68,68,.50)" : C.borderMd}`,
    background: C.card, padding: "0 12px", color: C.text,
    fontFamily: C.font, fontSize: "13.5px", outline: "none", boxSizing: "border-box",
});

const getToken = () => localStorage.getItem("auth_token") || localStorage.getItem("token");
const fmtRp = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

/* ══════════════════════════════════════════════════════════
   SHARED ATOMS
══════════════════════════════════════════════════════════ */

function StatCard({ label, value, icon: Icon, bar, highlight }) {
    return (
        <div style={{
            background: highlight ? "rgba(16,185,129,0.06)" : C.surface,
            border: `0.5px solid ${highlight ? "rgba(16,185,129,0.25)" : C.border}`,
            borderRadius: "12px", padding: "18px 20px",
            position: "relative", overflow: "hidden", fontFamily: C.font,
        }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: bar }} />
            <div style={{ fontSize: "11px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: ".7px", marginBottom: "10px" }}>{label}</div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div style={{ fontSize: "22px", fontWeight: 800, color: highlight ? "#34d399" : C.text, letterSpacing: "-0.8px", lineHeight: 1 }}>{value ?? "—"}</div>
                <div style={{ width: "38px", height: "38px", borderRadius: "9px", background: C.card, border: `0.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, flexShrink: 0 }}>
                    <Icon size={18} strokeWidth={1.7} />
                </div>
            </div>
        </div>
    );
}

function FieldLabel({ children, mt = true }) {
    return (
        <div style={{ fontSize: "11px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: ".6px", marginBottom: "5px", marginTop: mt ? "13px" : 0 }}>
            {children}
        </div>
    );
}

function EmptyState({ title, subtitle, icon: Icon }) {
    return (
        <div style={{ padding: "48px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", fontFamily: C.font }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "16px", background: C.card, border: `0.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, marginBottom: "16px" }}>
                <Icon size={26} strokeWidth={1.4} />
            </div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: C.text, marginBottom: "6px" }}>{title}</div>
            <p style={{ fontSize: "13px", color: C.muted, lineHeight: "1.7", maxWidth: "360px", margin: 0 }}>{subtitle}</p>
        </div>
    );
}

function SectionBox({ title, subtitle, children, action }) {
    return (
        <div style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: "14px", overflow: "hidden", marginBottom: "18px" }}>
            <div style={{ padding: "18px 22px", borderBottom: `0.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                <div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: C.text }}>{title}</div>
                    {subtitle && <div style={{ fontSize: "12px", color: C.muted, marginTop: "3px" }}>{subtitle}</div>}
                </div>
                {action}
            </div>
            {children}
        </div>
    );
}

function SectionDivider({ label }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px", marginTop: "8px" }}>
            <div style={{ flex: 1, height: "0.5px", background: C.border }} />
            <span style={{ fontSize: "11px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: ".8px", whiteSpace: "nowrap" }}>{label}</span>
            <div style={{ flex: 1, height: "0.5px", background: C.border }} />
        </div>
    );
}

function AccTypeBadge({ type }) {
    const isBank = type === "bank";
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", background: isBank ? "rgba(59,130,246,.12)" : "rgba(139,92,246,.12)", border: `0.5px solid ${isBank ? "rgba(59,130,246,.30)" : "rgba(139,92,246,.30)"}`, color: isBank ? "#60a5fa" : "#a78bfa" }}>
            {isBank ? <Building2 size={10} /> : <Smartphone size={10} />}
            {isBank ? "Bank" : "E-Wallet"}
        </span>
    );
}

/* ══════════════════════════════════════════════════════════
   ACCOUNT ROW
══════════════════════════════════════════════════════════ */

function AccountRow({ account, onDelete, onSetDefault, onEdit }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 22px", borderBottom: `0.5px solid rgba(255,255,255,.04)`, fontFamily: C.font }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "9px", flexShrink: 0, background: account.type === "bank" ? "rgba(59,130,246,.10)" : "rgba(139,92,246,.10)", border: `0.5px solid ${account.type === "bank" ? "rgba(59,130,246,.25)" : "rgba(139,92,246,.25)"}`, display: "flex", alignItems: "center", justifyContent: "center", color: account.type === "bank" ? "#60a5fa" : "#a78bfa" }}>
                {account.type === "bank" ? <CreditCard size={16} strokeWidth={1.8} /> : <Smartphone size={16} strokeWidth={1.8} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "3px" }}>
                    <span style={{ fontSize: "13.5px", fontWeight: 700, color: C.text }}>{account.provider_name}</span>
                    <AccTypeBadge type={account.type} />
                    {account.is_default && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", background: "rgba(16,185,129,.12)", border: "0.5px solid rgba(16,185,129,.30)", color: "#34d399" }}>
                            <CheckCircle size={10} /> Default
                        </span>
                    )}
                </div>
                <div style={{ fontSize: "12.5px", color: C.sub, fontFamily: "monospace" }}>
                    {account.account_number}
                    {account.account_name && <span style={{ fontFamily: C.font, color: C.muted, marginLeft: "8px" }}>· {account.account_name}</span>}
                </div>
            </div>
            <div style={{ display: "flex", gap: "7px", flexShrink: 0 }}>
                {!account.is_default && (
                    <button onClick={() => onSetDefault(account.id)} style={{ height: "30px", padding: "0 10px", borderRadius: "7px", border: "0.5px solid rgba(16,185,129,.30)", background: "rgba(16,185,129,.10)", color: "#34d399", fontFamily: C.font, fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                        <CheckCircle size={11} strokeWidth={2} /> Default
                    </button>
                )}
                <button onClick={() => onEdit(account)} style={{ height: "30px", padding: "0 10px", borderRadius: "7px", border: "0.5px solid rgba(99,102,241,.30)", background: "rgba(99,102,241,.10)", color: "#a5b4fc", fontFamily: C.font, fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Edit2 size={11} strokeWidth={2} /> Edit
                </button>
                <button onClick={() => onDelete(account.id)} style={{ height: "30px", padding: "0 10px", borderRadius: "7px", border: "0.5px solid rgba(239,68,68,.25)", background: "rgba(239,68,68,.10)", color: "#fca5a5", fontFamily: C.font, fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Trash2 size={11} strokeWidth={2} /> Hapus
                </button>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   ACCOUNT MODAL
══════════════════════════════════════════════════════════ */

const BANK_LIST    = ["BCA","BNI","BRI","Mandiri","BTN","CIMB Niaga","Danamon","Permata","Maybank","OCBC NISP","BSI","Muamalat","Other"];
const EWALLET_LIST = ["GoPay","OVO","Dana","ShopeePay","LinkAja","Jenius","Sakuku","Astrapay","Other"];

function AccountModal({ editData, onClose, onSave }) {
    const [type,           setType]           = useState(editData?.type ?? "bank");
    const [provider,       setProvider]       = useState(editData?.provider_name ?? "");
    const [customProvider, setCustomProvider] = useState("");
    const [accountNumber,  setAccountNumber]  = useState(editData?.account_number ?? "");
    const [accountName,    setAccountName]    = useState(editData?.account_name ?? "");
    const [errors,         setErrors]         = useState({});

    const providerList = type === "bank" ? BANK_LIST : EWALLET_LIST;

    const validate = () => {
        const e = {};
        const fp = provider === "Other" ? customProvider.trim() : provider;
        if (!fp) e.provider = "Pilih atau isi nama provider.";
        if (!accountNumber.trim()) e.accountNumber = "Nomor rekening wajib diisi.";
        if (type === "bank" && !accountName.trim()) e.accountName = "Nama pemilik rekening wajib diisi.";
        return e;
    };

    const handleSave = () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        const finalProvider = provider === "Other" ? customProvider.trim() : provider;
        onSave({ type, provider_name: finalProvider, account_number: accountNumber, account_name: accountName });
    };

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.70)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
            <div style={{ width: "100%", maxWidth: "420px", background: C.surface, border: `0.5px solid ${C.borderMd}`, borderRadius: "14px", padding: "24px", fontFamily: C.font }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
                    <div>
                        <div style={{ fontSize: "18px", fontWeight: 800, color: C.text, letterSpacing: "-.4px" }}>{editData ? "Edit rekening" : "Tambah rekening"}</div>
                        <div style={{ fontSize: "12.5px", color: C.muted, marginTop: "4px" }}>Rekening yang ditampilkan ke customer saat pembayaran</div>
                    </div>
                    <button onClick={onClose} style={{ width: "30px", height: "30px", borderRadius: "7px", background: C.card, border: `0.5px solid ${C.border}`, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <X size={14} strokeWidth={2} />
                    </button>
                </div>

                <FieldLabel mt={false}>Tipe rekening</FieldLabel>
                <div style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                    {[{ key: "bank", label: "Bank", Icon: Building2 }, { key: "ewallet", label: "E-Wallet", Icon: Smartphone }].map(t => (
                        <button key={t.key} onClick={() => { setType(t.key); setProvider(""); setCustomProvider(""); setErrors({}); }} style={{ flex: 1, height: "36px", borderRadius: "8px", cursor: "pointer", border: `0.5px solid ${type === t.key ? "rgba(99,102,241,.50)" : C.borderMd}`, background: type === t.key ? "rgba(99,102,241,.15)" : "transparent", color: type === t.key ? "#a5b4fc" : C.muted, fontFamily: C.font, fontSize: "12.5px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                            <t.Icon size={13} /> {t.label}
                        </button>
                    ))}
                </div>

                <FieldLabel>Nama {type === "bank" ? "bank" : "e-wallet"}</FieldLabel>
                <select value={provider} onChange={e => { setProvider(e.target.value); setErrors(prev => ({ ...prev, provider: null })); }} style={{ ...inp(!!errors.provider), height: "40px", cursor: "pointer" }}>
                    <option value="">-- Pilih {type === "bank" ? "bank" : "e-wallet"} --</option>
                    {providerList.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {errors.provider && <div style={{ fontSize: "11.5px", color: "#f87171", marginTop: "4px" }}>{errors.provider}</div>}

                {provider === "Other" && (
                    <>
                        <FieldLabel>Nama lainnya</FieldLabel>
                        <input style={inp()} type="text" placeholder="Tulis nama provider..." value={customProvider} onChange={e => setCustomProvider(e.target.value)} />
                    </>
                )}

                <FieldLabel>Nomor rekening / nomor HP</FieldLabel>
                <input style={inp(!!errors.accountNumber)} type="text" placeholder={type === "bank" ? "e.g. 1234 5678 9012" : "e.g. 08123456789"} value={accountNumber} onChange={e => { setAccountNumber(e.target.value); setErrors(prev => ({ ...prev, accountNumber: null })); }} />
                {errors.accountNumber && <div style={{ fontSize: "11.5px", color: "#f87171", marginTop: "4px" }}>{errors.accountNumber}</div>}

                <FieldLabel>Nama pemilik {type === "bank" ? "(wajib)" : "(opsional)"}</FieldLabel>
                <input style={inp(!!errors.accountName)} type="text" placeholder="Nama sesuai rekening" value={accountName} onChange={e => { setAccountName(e.target.value); setErrors(prev => ({ ...prev, accountName: null })); }} />
                {errors.accountName && <div style={{ fontSize: "11.5px", color: "#f87171", marginTop: "4px" }}>{errors.accountName}</div>}

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "22px", paddingTop: "16px", borderTop: `0.5px solid ${C.border}` }}>
                    <button onClick={onClose} style={{ height: "36px", padding: "0 14px", borderRadius: "8px", border: `0.5px solid ${C.borderMd}`, background: "transparent", color: C.sub, fontFamily: C.font, fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Batal</button>
                    <button onClick={handleSave} style={{ height: "36px", padding: "0 18px", borderRadius: "8px", border: "none", background: "#6366f1", color: "#fff", fontFamily: C.font, fontSize: "13px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                        <CheckCircle size={14} strokeWidth={2.5} /> {editData ? "Update" : "Simpan"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   SECTION 1 — REKENING PEMBAYARAN
══════════════════════════════════════════════════════════ */

function PaymentAccountsSection() {
    const [accounts,  setAccounts]  = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editData,  setEditData]  = useState(null);
    const [filter,    setFilter]    = useState("all");

    const loadAccounts = async () => {
        try {
            const res = await axios.get("/owner/payment-accounts", { headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" } });
            setAccounts(Array.isArray(res.data) ? res.data : res.data?.data ?? []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadAccounts(); }, []);

    const handleSave = async (data) => {
        try {
            if (editData) {
                await axios.put(`/owner/payment-accounts/${editData.id}`, data, { headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" } });
            } else {
                await axios.post("/owner/payment-accounts", data, { headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" } });
            }
            await loadAccounts(); setShowModal(false); setEditData(null);
        } catch (err) { alert(err.response?.data?.message ?? "Gagal menyimpan rekening."); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Hapus rekening ini?")) return;
        try {
            await axios.delete(`/owner/payment-accounts/${id}`, { headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" } });
            await loadAccounts();
        } catch (err) { alert(err.response?.data?.message ?? "Gagal menghapus."); }
    };

    const handleSetDefault = async (id) => {
        try {
            await axios.put(`/owner/payment-accounts/${id}/set-default`, {}, { headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" } });
            await loadAccounts();
        } catch { alert("Gagal mengatur default."); }
    };

    const counts   = { all: accounts.length, bank: accounts.filter(a => a.type === "bank").length, ewallet: accounts.filter(a => a.type === "ewallet").length };
    const filtered = filter === "all" ? accounts : accounts.filter(a => a.type === filter);

    const addBtn = (
        <button onClick={() => { setEditData(null); setShowModal(true); }} style={{ height: "34px", padding: "0 14px", border: "0.5px solid rgba(99,102,241,.40)", borderRadius: "8px", background: "rgba(99,102,241,.15)", color: "#a5b4fc", fontFamily: C.font, fontWeight: 700, fontSize: "12.5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            <Plus size={14} strokeWidth={2.5} /> Tambah rekening
        </button>
    );

    return (
        <>
            <SectionBox title="Rekening pembayaran" subtitle="Rekening bank atau e-wallet yang ditampilkan ke customer saat checkout" action={addBtn}>
                <div style={{ padding: "12px 22px", borderBottom: `0.5px solid ${C.border}`, display: "flex", gap: "6px" }}>
                    {[{ key: "all", label: "Semua" }, { key: "bank", label: "Bank" }, { key: "ewallet", label: "E-Wallet" }].map(f => (
                        <button key={f.key} onClick={() => setFilter(f.key)} style={{ height: "28px", padding: "0 12px", borderRadius: "6px", cursor: "pointer", border: `0.5px solid ${filter === f.key ? "rgba(99,102,241,.40)" : C.border}`, background: filter === f.key ? "rgba(99,102,241,.12)" : "transparent", color: filter === f.key ? "#a5b4fc" : C.muted, fontFamily: C.font, fontSize: "12px", fontWeight: 600 }}>
                            {f.label} ({counts[f.key]})
                        </button>
                    ))}
                </div>
                {loading && <div style={{ padding: "32px", textAlign: "center", color: C.muted, fontSize: "13px" }}>Memuat data...</div>}
                {!loading && filtered.length === 0 && <EmptyState title="Belum ada rekening" subtitle="Tambahkan rekening bank atau e-wallet agar customer bisa melakukan pembayaran." icon={Wallet} />}
                {!loading && filtered.map(account => (
                    <AccountRow key={account.id} account={account} onDelete={handleDelete} onSetDefault={handleSetDefault} onEdit={a => { setEditData(a); setShowModal(true); }} />
                ))}
                {!loading && accounts.length > 0 && (
                    <div style={{ margin: "14px 22px", padding: "10px 14px", borderRadius: "8px", background: "rgba(99,102,241,.07)", border: "0.5px solid rgba(99,102,241,.18)", fontSize: "12px", color: C.muted, lineHeight: 1.6 }}>
                        💡 Rekening bertanda <strong style={{ color: "#34d399" }}>Default</strong> akan ditampilkan sebagai metode pembayaran utama ke customer.
                    </div>
                )}
            </SectionBox>

            {showModal && <AccountModal editData={editData} onClose={() => { setShowModal(false); setEditData(null); }} onSave={handleSave} />}
        </>
    );
}

/* ══════════════════════════════════════════════════════════
   ✅ SECTION 2 — KONFIRMASI PEMBAYARAN MASUK
   Alur: pending → konfirmasi → dp_paid → pelunasan → paid
   + Setelah pesanan dikirim, tombol kirim uang ke kurir
══════════════════════════════════════════════════════════ */

function PaymentConfirmationSection({ onStatsUpdate }) {
    const [payments,    setPayments]    = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [tab,         setTab]         = useState("pending");
    const [dispatching, setDispatching] = useState({});   // { orderId: true/false }
    const [expanded,    setExpanded]    = useState({});    // { paymentId: true/false }

    const loadPayments = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/owner/payments", { headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" } });
            const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
            setPayments(data);
            if (onStatsUpdate) onStatsUpdate(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadPayments(); }, []);

    /* Konfirmasi pembayaran dari klien */
    const handleConfirm = async (paymentId) => {
        if (!window.confirm("Konfirmasi penerimaan pembayaran ini?")) return;
        try {
            await axios.put(`/owner/payments/${paymentId}/confirm`, {}, { headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" } });
            await loadPayments();
        } catch (err) { alert(err.response?.data?.message ?? "Gagal mengkonfirmasi."); }
    };

    /* Tolak pembayaran */
    const handleReject = async (paymentId) => {
        if (!window.confirm("Tolak pembayaran ini?")) return;
        try {
            await axios.put(`/owner/payments/${paymentId}/reject`, {}, { headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" } });
            await loadPayments();
        } catch (err) { alert(err.response?.data?.message ?? "Gagal menolak."); }
    };

    /* ✅ Kirim uang jasa kurir — hanya muncul setelah pesanan berstatus "dikirim" & invoice lunas */
    const handleDispatchCourier = async (orderId) => {
        if (!window.confirm("Kirim uang jasa kurir ke kurir yang mengantarkan pesanan ini?")) return;
        setDispatching(prev => ({ ...prev, [orderId]: true }));
        try {
            await axios.post(`/owner/orders/${orderId}/dispatch-courier-fee`, {}, { headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" } });
            alert("✅ Uang jasa kurir berhasil dikirim!");
            await loadPayments();
        } catch (err) {
            alert(err.response?.data?.message ?? "Gagal mengirim uang kurir.");
        } finally {
            setDispatching(prev => ({ ...prev, [orderId]: false }));
        }
    };

    const typeLabel = (type) => {
        if (type === "dp")        return { label: "DP 50%",        color: "#38bdf8", bg: "rgba(14,165,233,0.1)",  border: "rgba(14,165,233,0.2)" };
        if (type === "pelunasan") return { label: "Pelunasan 50%", color: "#34d399", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" };
        return                           { label: "Full",          color: "#a78bfa", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.2)" };
    };

    const pending   = payments.filter(p => p.status === "pending");
    const confirmed = payments.filter(p => p.status === "confirmed");
    const displayed = tab === "pending" ? pending : confirmed;

    const refreshBtn = (
        <button onClick={loadPayments} style={{ height: "34px", padding: "0 14px", border: `0.5px solid ${C.borderMd}`, borderRadius: "8px", background: "transparent", color: C.sub, fontFamily: C.font, fontWeight: 600, fontSize: "12.5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            <RefreshCw size={13} strokeWidth={2} /> Refresh
        </button>
    );

    return (
        <SectionBox title="Konfirmasi Pembayaran Masuk" subtitle="Verifikasi DP dan pelunasan dari klien — setelah pesanan dikirim, kirim uang jasa kurir" action={refreshBtn}>
            {/* Tabs */}
            <div style={{ padding: "12px 22px", borderBottom: `0.5px solid ${C.border}`, display: "flex", gap: "6px" }}>
                {[
                    { key: "pending",   label: "Menunggu Konfirmasi", count: pending.length },
                    { key: "confirmed", label: "Sudah Dikonfirmasi",  count: confirmed.length },
                ].map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} style={{ height: "28px", padding: "0 12px", borderRadius: "6px", cursor: "pointer", border: `0.5px solid ${tab === t.key ? "rgba(99,102,241,.40)" : C.border}`, background: tab === t.key ? "rgba(99,102,241,.12)" : "transparent", color: tab === t.key ? "#a5b4fc" : C.muted, fontFamily: C.font, fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                        {t.label}
                        {t.count > 0 && (
                            <span style={{ fontSize: "11px", padding: "1px 7px", borderRadius: "999px", fontWeight: 700, background: tab === t.key ? (t.key === "pending" ? "rgba(245,158,11,0.25)" : "rgba(16,185,129,0.2)") : "rgba(255,255,255,0.07)", color: tab === t.key ? (t.key === "pending" ? "#fbbf24" : "#34d399") : C.muted }}>
                                {t.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {loading && <div style={{ padding: "32px", textAlign: "center", color: C.muted, fontSize: "13px" }}>Memuat data...</div>}

            {!loading && displayed.length === 0 && (
                <EmptyState
                    title={tab === "pending" ? "Tidak ada pembayaran menunggu" : "Belum ada pembayaran dikonfirmasi"}
                    subtitle={tab === "pending" ? "Pembayaran DP atau pelunasan dari klien akan muncul di sini." : "Daftar pembayaran yang telah dikonfirmasi akan tampil di sini."}
                    icon={DollarSign}
                />
            )}

            {!loading && displayed.map((p, i) => {
                const tl        = typeLabel(p.type);
                const isOpen    = expanded[p.id];
                const order     = p.invoice?.order;
                const isDelivered = order?.status === "dikirim" || order?.status === "selesai";
                const isPaid    = p.invoice?.status === "paid" || p.invoice?.status === "selesai";
                const courierDispatched = order?.courier_fee_dispatched;

                /* Tampilkan tombol kurir jika: pembayaran confirmed + pesanan dikirim + invoice lunas + belum dispatch */
                const canDispatchCourier = tab === "confirmed" && isDelivered && isPaid && !courierDispatched && order?.courier_id;

                return (
                    <div key={p.id} style={{
                        borderBottom: i < displayed.length - 1 ? `0.5px solid rgba(255,255,255,.04)` : "none",
                        fontFamily: C.font,
                    }}>
                        <div style={{ padding: "18px 22px" }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                                {/* Icon */}
                                <div style={{ width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0, background: tl.bg, border: `0.5px solid ${tl.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: tl.color }}>
                                    {p.type === "dp" ? <CreditCard size={17} strokeWidth={1.8} /> : <CheckCheck size={17} strokeWidth={1.8} />}
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                                        <span style={{ fontSize: "14px", fontWeight: 700, color: C.text }}>
                                            {p.invoice?.client?.name || p.invoice?.order?.client?.name || "Klien"}
                                        </span>
                                        <span style={{ display: "inline-flex", alignItems: "center", fontSize: "11px", fontWeight: 600, padding: "2px 9px", borderRadius: "20px", background: tl.bg, border: `0.5px solid ${tl.border}`, color: tl.color }}>
                                            {tl.label}
                                        </span>
                                        <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 9px", borderRadius: "20px", background: "rgba(139,92,246,0.1)", border: "0.5px solid rgba(139,92,246,0.2)", color: "#a78bfa" }}>
                                            Insidentil
                                        </span>
                                        {isDelivered && (
                                            <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 9px", borderRadius: "20px", background: "rgba(14,165,233,0.1)", border: "0.5px solid rgba(14,165,233,0.2)", color: "#38bdf8", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                                <Truck size={10} /> Sudah Dikirim
                                            </span>
                                        )}
                                        {courierDispatched && (
                                            <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 9px", borderRadius: "20px", background: "rgba(16,185,129,0.1)", border: "0.5px solid rgba(16,185,129,0.2)", color: "#34d399", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                                <CheckCheck size={10} /> Kurir Dibayar
                                            </span>
                                        )}
                                    </div>

                                    <div style={{ fontSize: "12.5px", color: C.muted, marginBottom: "8px" }}>
                                        {p.invoice?.invoice_number || `INV-${p.invoice_id}`}
                                        {" · "}{p.created_at ? new Date(p.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                                        {p.payment_channel && (
                                            <span>
                                                {" · "}Via {p.payment_channel.bank_name || p.payment_channel.wallet_name || p.payment_channel.provider_name}
                                                {" "}<span style={{ fontFamily: "monospace", color: C.sub }}>{p.payment_channel.account_number}</span>
                                            </span>
                                        )}
                                    </div>

                                    <div style={{ fontSize: "18px", fontWeight: 800, color: "#fbbf24", letterSpacing: "-0.5px", marginBottom: "6px" }}>
                                        {fmtRp(p.amount)}
                                    </div>

                                    {p.note && (
                                        <div style={{ fontSize: "12px", color: C.muted, fontStyle: "italic", marginBottom: "6px" }}>
                                            Catatan: {p.note}
                                        </div>
                                    )}

                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                                        {p.proof_url && (
                                            <a href={p.proof_url} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "#60a5fa", fontSize: "12px", fontWeight: 600, textDecoration: "none", background: "rgba(59,130,246,0.08)", border: "0.5px solid rgba(59,130,246,0.2)", padding: "5px 10px", borderRadius: "7px" }}>
                                                <Eye size={12} strokeWidth={2} /> Lihat Bukti Transfer
                                            </a>
                                        )}

                                        {order && (
                                            <button onClick={() => setExpanded(prev => ({ ...prev, [p.id]: !isOpen }))} style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: C.muted, fontSize: "12px", fontWeight: 600, background: "transparent", border: `0.5px solid ${C.border}`, padding: "5px 10px", borderRadius: "7px", cursor: "pointer", fontFamily: C.font }}>
                                                <Info size={12} /> Detail Pesanan {isOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                            </button>
                                        )}
                                    </div>

                                    {/* ── Expanded: detail pesanan & kurir ── */}
                                    {isOpen && order && (
                                        <div style={{ marginTop: "14px", padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: `0.5px solid ${C.border}`, borderRadius: "10px" }}>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px", marginBottom: "12px" }}>
                                                <div>
                                                    <div style={{ fontSize: "11px", color: C.muted, marginBottom: "3px", textTransform: "uppercase", letterSpacing: ".5px" }}>Paket</div>
                                                    <div style={{ fontSize: "13px", fontWeight: 600, color: C.text }}>{order.catering_package?.name || order.menu?.name || "—"}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: "11px", color: C.muted, marginBottom: "3px", textTransform: "uppercase", letterSpacing: ".5px" }}>Tgl Pengiriman</div>
                                                    <div style={{ fontSize: "13px", fontWeight: 600, color: C.text }}>{order.delivery_date ? new Date(order.delivery_date).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "—"}</div>
                                                </div>
                                                {order.courier && (
                                                    <>
                                                        <div>
                                                            <div style={{ fontSize: "11px", color: C.muted, marginBottom: "3px", textTransform: "uppercase", letterSpacing: ".5px" }}>Kurir</div>
                                                            <div style={{ fontSize: "13px", fontWeight: 600, color: C.text }}>{order.courier.name}</div>
                                                            <div style={{ fontSize: "11px", color: C.muted }}>{order.courier.phone}</div>
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: "11px", color: C.muted, marginBottom: "3px", textTransform: "uppercase", letterSpacing: ".5px" }}>Jasa Kurir</div>
                                                            <div style={{ fontSize: "15px", fontWeight: 800, color: "#38bdf8" }}>{fmtRp(order.courier_fee || 0)}</div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* ✅ TOMBOL KIRIM UANG KURIR */}
                                            {canDispatchCourier && (
                                                <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: `0.5px solid ${C.border}` }}>
                                                    <div style={{ fontSize: "12px", color: C.muted, marginBottom: "10px", lineHeight: "1.6", display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                                        <AlertCircle size={13} color="#fbbf24" style={{ marginTop: "1px", flexShrink: 0 }} />
                                                        Invoice lunas & pesanan sudah dikirim. Kirim uang jasa kurir ke <strong style={{ color: C.text }}>{order.courier?.name}</strong> sebesar <strong style={{ color: "#38bdf8" }}>{fmtRp(order.courier_fee || 0)}</strong>.
                                                    </div>
                                                    <button
                                                        onClick={() => handleDispatchCourier(order.id)}
                                                        disabled={dispatching[order.id]}
                                                        style={{
                                                            display: "inline-flex", alignItems: "center", gap: "7px",
                                                            height: "36px", padding: "0 16px", borderRadius: "9px",
                                                            border: "0.5px solid rgba(14,165,233,0.40)",
                                                            background: dispatching[order.id] ? "rgba(14,165,233,0.08)" : "rgba(14,165,233,0.15)",
                                                            color: "#38bdf8", fontFamily: C.font, fontSize: "12.5px", fontWeight: 700,
                                                            cursor: dispatching[order.id] ? "not-allowed" : "pointer",
                                                            opacity: dispatching[order.id] ? 0.7 : 1,
                                                            transition: "all 0.2s",
                                                        }}
                                                    >
                                                        {dispatching[order.id]
                                                            ? <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> Memproses...</>
                                                            : <><Truck size={13} /> Kirim Uang Kurir {fmtRp(order.courier_fee || 0)}</>
                                                        }
                                                    </button>
                                                </div>
                                            )}

                                            {courierDispatched && (
                                                <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: `0.5px solid ${C.border}`, display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#34d399" }}>
                                                    <CheckCheck size={14} strokeWidth={2.5} />
                                                    <span>Uang jasa kurir <strong>{fmtRp(order.courier_fee || 0)}</strong> sudah dikirim ke {order.courier?.name}
                                                        {order.courier_fee_dispatched_at && (
                                                            <span style={{ color: C.muted }}>{" · "}{new Date(order.courier_fee_dispatched_at).toLocaleDateString("id-ID")}</span>
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                {tab === "pending" ? (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 }}>
                                        <button onClick={() => handleConfirm(p.id)} style={{ height: "32px", padding: "0 14px", borderRadius: "8px", border: "0.5px solid rgba(16,185,129,.35)", background: "rgba(16,185,129,.12)", color: "#34d399", fontFamily: C.font, fontSize: "12px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", whiteSpace: "nowrap" }}>
                                            <CheckCircle size={13} strokeWidth={2.5} /> Konfirmasi
                                        </button>
                                        <button onClick={() => handleReject(p.id)} style={{ height: "32px", padding: "0 14px", borderRadius: "8px", border: "0.5px solid rgba(239,68,68,.25)", background: "rgba(239,68,68,.08)", color: "#fca5a5", fontFamily: C.font, fontSize: "12px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                                            <X size={13} strokeWidth={2.5} /> Tolak
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: 600, color: "#34d399", background: "rgba(16,185,129,0.08)", border: "0.5px solid rgba(16,185,129,0.2)", padding: "6px 12px", borderRadius: "8px", flexShrink: 0, whiteSpace: "nowrap", height: "fit-content" }}>
                                        <CheckCircle size={13} strokeWidth={2.5} /> Dikonfirmasi
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            {!loading && pending.length > 0 && tab === "pending" && (
                <div style={{ margin: "12px 22px", padding: "10px 14px", borderRadius: "8px", background: "rgba(245,158,11,0.06)", border: "0.5px solid rgba(245,158,11,0.18)", fontSize: "12px", color: C.muted, lineHeight: 1.6 }}>
                    ⚡ Ada <strong style={{ color: "#fbbf24" }}>{pending.length} pembayaran</strong> menunggu konfirmasi Anda. Setelah dikonfirmasi, status invoice klien akan otomatis diperbarui.
                </div>
            )}
        </SectionBox>
    );
}

/* ══════════════════════════════════════════════════════════
   ✅ SECTION 3 — RIWAYAT TRANSAKSI (lengkap)
══════════════════════════════════════════════════════════ */

function TransactionHistorySection() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading]           = useState(true);
    const [filter, setFilter]             = useState("all");

    useEffect(() => {
        const load = async () => {
            try {
                const res = await axios.get("/owner/transactions", { headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" } });
                setTransactions(Array.isArray(res.data) ? res.data : res.data?.data ?? []);
            } catch { setTransactions([]); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const filtered = filter === "all" ? transactions : transactions.filter(t => t.type === filter);

    const typeConfig = (type) => ({
        dp:        { label: "DP 50%",        color: "#38bdf8" },
        pelunasan: { label: "Pelunasan",     color: "#34d399" },
        courier:   { label: "Jasa Kurir",    color: "#a78bfa" },
        full:      { label: "Full",          color: "#34d399" },
    }[type] || { label: type, color: "#94a3b8" });

    return (
        <SectionBox title="Riwayat Transaksi" subtitle="Semua pembayaran yang telah dikonfirmasi">
            <div style={{ padding: "12px 22px", borderBottom: `0.5px solid ${C.border}`, display: "flex", gap: "6px" }}>
                {[{ key: "all", label: "Semua" }, { key: "dp", label: "DP" }, { key: "pelunasan", label: "Pelunasan" }, { key: "courier", label: "Jasa Kurir" }].map(f => (
                    <button key={f.key} onClick={() => setFilter(f.key)} style={{ height: "28px", padding: "0 12px", borderRadius: "6px", cursor: "pointer", border: `0.5px solid ${filter === f.key ? "rgba(99,102,241,.40)" : C.border}`, background: filter === f.key ? "rgba(99,102,241,.12)" : "transparent", color: filter === f.key ? "#a5b4fc" : C.muted, fontFamily: C.font, fontSize: "12px", fontWeight: 600 }}>
                        {f.label}
                    </button>
                ))}
            </div>

            {loading && <div style={{ padding: "32px", textAlign: "center", color: C.muted, fontSize: "13px" }}>Memuat data...</div>}

            {!loading && filtered.length === 0 && <EmptyState title="Belum ada transaksi" subtitle="Riwayat pembayaran dari pesanan customer akan muncul otomatis di sini." icon={DollarSign} />}

            {!loading && filtered.map((t, i) => {
                const tc = typeConfig(t.type);
                return (
                    <div key={t.id || i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 22px", borderBottom: i < filtered.length - 1 ? `0.5px solid rgba(255,255,255,.04)` : "none", fontFamily: C.font }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                <span style={{ fontSize: "13.5px", fontWeight: 700, color: C.text }}>{t.client_name || t.invoice?.client?.name || "—"}</span>
                                <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 9px", borderRadius: "20px", background: "rgba(255,255,255,0.06)", border: `0.5px solid rgba(255,255,255,0.1)`, color: tc.color }}>{tc.label}</span>
                            </div>
                            <div style={{ fontSize: "12px", color: C.muted }}>
                                {t.invoice_number || t.invoice?.invoice_number || "—"}
                                {" · "}{t.confirmed_at ? new Date(t.confirmed_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                            </div>
                        </div>
                        <div style={{ fontWeight: 800, fontSize: "15px", color: "#34d399", letterSpacing: "-0.3px", flexShrink: 0 }}>
                            + {fmtRp(t.amount)}
                        </div>
                    </div>
                );
            })}
        </SectionBox>
    );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */

export default function RevenueOwner() {
    const [stats, setStats] = useState({
        today: fmtRp(0), month: fmtRp(0), pending_count: 0, total_confirmed: 0,
    });

    // Update stats dari data pembayaran yang masuk
    const handleStatsUpdate = (payments) => {
        const confirmed = payments.filter(p => p.status === "confirmed");
        const pending   = payments.filter(p => p.status === "pending");
        const today     = new Date().toDateString();
        const todayTotal = confirmed.filter(p => new Date(p.updated_at).toDateString() === today).reduce((a, p) => a + parseFloat(p.amount || 0), 0);
        const monthTotal = confirmed.reduce((a, p) => a + parseFloat(p.amount || 0), 0);

        setStats({
            today:         fmtRp(todayTotal),
            month:         fmtRp(monthTotal),
            pending_count: pending.length,
            total_confirmed: confirmed.length,
        });
    };

    return (
        <OwnerLayout>
            <div style={{ fontFamily: C.font }}>
                {/* Header */}
                <div style={{ marginBottom: "28px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: ".8px", marginBottom: "14px" }}>
                        <LayoutDashboard size={13} strokeWidth={2} />
                        <span>Owner</span>
                        <span style={{ color: "#1E293B" }}>›</span>
                        <span>Revenue & Laporan</span>
                    </div>
                    <h1 style={{ fontSize: "28px", fontWeight: 800, color: C.text, letterSpacing: "-.8px", lineHeight: 1.1, margin: 0 }}>Pendapatan & Laporan</h1>
                    <p style={{ marginTop: "8px", fontSize: "13.5px", color: C.muted, lineHeight: "1.7" }}>
                        Ringkasan pendapatan dari pesanan customer, konfirmasi pembayaran, dan pengiriman uang jasa kurir.
                    </p>
                </div>

                {/* Alur pembayaran — infographic mini */}
                <div style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: "12px", padding: "14px 20px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "0", overflowX: "auto" }}>
                    {[
                        { label: "Klien pesan", sub: "Insidentil", color: "#a78bfa" },
                        null,
                        { label: "Klien bayar DP", sub: "50% + bukti", color: "#38bdf8" },
                        null,
                        { label: "Owner konfirmasi", sub: "DP masuk", color: "#fbbf24" },
                        null,
                        { label: "Klien lunasi", sub: "50% sisa", color: "#34d399" },
                        null,
                        { label: "Pesanan dikirim", sub: "Kurir berangkat", color: "#60a5fa" },
                        null,
                        { label: "Kirim fee kurir", sub: "Otomatis", color: "#34d399" },
                    ].map((step, i) => step === null ? (
                        <ArrowRight key={i} size={14} color="#334155" style={{ flexShrink: 0, margin: "0 4px" }} />
                    ) : (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", flexShrink: 0 }}>
                            <div style={{ fontSize: "11px", fontWeight: 700, color: step.color, whiteSpace: "nowrap" }}>{step.label}</div>
                            <div style={{ fontSize: "10px", color: C.muted, whiteSpace: "nowrap" }}>{step.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Stat cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "22px" }}>
                    <StatCard label="Pendapatan hari ini"       value={stats.today}         icon={DollarSign}  bar={bars.green}  highlight />
                    <StatCard label="Total terkonfirmasi"       value={stats.month}         icon={Calendar}    bar={bars.blue}   />
                    <StatCard label="Menunggu konfirmasi"       value={`${stats.pending_count} bayar`} icon={Clock} bar={bars.amber} />
                    <StatCard label="Total pembayaran confirmed" value={stats.total_confirmed} icon={CheckCircle} bar={bars.indigo} />
                </div>

                {/* Rekening pembayaran */}
                <PaymentAccountsSection />

                {/* ✅ Konfirmasi pembayaran masuk */}
                <PaymentConfirmationSection onStatsUpdate={handleStatsUpdate} />

                {/* Riwayat transaksi */}
                <TransactionHistorySection />

                {/* Analitik */}
                <SectionDivider label="Analitik & Laporan" />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "18px" }}>
                    {[
                        { title: "Laporan penjualan",   sub: "Tren pesanan & transaksi",    icon: BarChart3 },
                        { title: "Analisis pendapatan", sub: "Ringkasan bulanan & tahunan", icon: TrendingUp },
                    ].map(c => (
                        <div key={c.title} style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: "14px", overflow: "hidden" }}>
                            <div style={{ padding: "16px 20px", borderBottom: `0.5px solid ${C.border}`, display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: C.card, border: `0.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>
                                    <c.icon size={15} strokeWidth={1.8} />
                                </div>
                                <div>
                                    <div style={{ fontSize: "13.5px", fontWeight: 700, color: C.text }}>{c.title}</div>
                                    <div style={{ fontSize: "11.5px", color: C.muted, marginTop: "2px" }}>{c.sub}</div>
                                </div>
                            </div>
                            <EmptyState title="Belum ada data" subtitle="Data akan muncul setelah ada transaksi tercatat." icon={c.icon} />
                        </div>
                    ))}
                </div>

                <SectionBox title="Paket terlaris" subtitle="Paket catering yang paling banyak dipesan customer">
                    <EmptyState title="Belum ada data" subtitle="Ranking paket catering terpopuler akan muncul setelah ada pesanan dari customer." icon={Package} />
                </SectionBox>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </OwnerLayout>
    );
}