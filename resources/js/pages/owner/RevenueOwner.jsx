// resources/js/pages/owner/RevenueOwner.jsx
// ✅ Gabungan Revenue + Reports — hapus ReportsOwner.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import {
    DollarSign, TrendingUp, Calendar, Wallet,
    Plus, Trash2, CreditCard, Smartphone,
    CheckCircle, X, Building2, Edit2,
    LayoutDashboard, ShoppingBag,
    BarChart3, Package, FileBarChart2,
} from "lucide-react";
import OwnerLayout from "../../layouts/OwnerLayout";

/* ── font injection ─────────────────────────────────────────── */
if (typeof document !== "undefined" && !document.getElementById("inter-font")) {
    const l = document.createElement("link");
    l.id   = "inter-font";
    l.rel  = "stylesheet";
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
    purple: "linear-gradient(90deg,#8b5cf6,#a78bfa)",
};

/* ── shared input style ─────────────────────────────────────── */
const inp = (err = false) => ({
    width: "100%", height: "40px",
    borderRadius: "8px",
    border: `0.5px solid ${err ? "rgba(239,68,68,.50)" : C.borderMd}`,
    background: C.card,
    padding: "0 12px",
    color: C.text,
    fontFamily: C.font,
    fontSize: "13.5px",
    outline: "none",
    boxSizing: "border-box",
});

const getToken = () =>
    localStorage.getItem("auth_token") || localStorage.getItem("token");

/* ── StatCard ───────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, bar }) {
    return (
        <div style={{
            background: C.surface, border: `0.5px solid ${C.border}`,
            borderRadius: "12px", padding: "18px 20px",
            position: "relative", overflow: "hidden", fontFamily: C.font,
        }}>
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: "2px", background: bar,
            }} />
            <div style={{
                fontSize: "11px", fontWeight: 600, color: C.muted,
                textTransform: "uppercase", letterSpacing: ".7px", marginBottom: "10px",
            }}>{label}</div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div style={{
                    fontSize: "22px", fontWeight: 800, color: C.text,
                    letterSpacing: "-0.8px", lineHeight: 1,
                }}>{value ?? "—"}</div>
                <div style={{
                    width: "38px", height: "38px", borderRadius: "9px",
                    background: C.card, border: `0.5px solid ${C.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: C.muted, flexShrink: 0,
                }}>
                    <Icon size={18} strokeWidth={1.7} />
                </div>
            </div>
        </div>
    );
}

/* ── FieldLabel ─────────────────────────────────────────────── */
function FieldLabel({ children, mt = true }) {
    return (
        <div style={{
            fontSize: "11px", fontWeight: 600, color: C.muted,
            textTransform: "uppercase", letterSpacing: ".6px",
            marginBottom: "5px", marginTop: mt ? "13px" : 0,
        }}>{children}</div>
    );
}

/* ── EmptyState ─────────────────────────────────────────────── */
function EmptyState({ title, subtitle, icon: Icon }) {
    return (
        <div style={{
            padding: "48px 20px", display: "flex",
            flexDirection: "column", alignItems: "center", textAlign: "center",
            fontFamily: C.font,
        }}>
            <div style={{
                width: "60px", height: "60px", borderRadius: "16px",
                background: C.card, border: `0.5px solid ${C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: C.muted, marginBottom: "16px",
            }}>
                <Icon size={26} strokeWidth={1.4} />
            </div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: C.text, marginBottom: "6px" }}>{title}</div>
            <p style={{ fontSize: "13px", color: C.muted, lineHeight: "1.7", maxWidth: "360px", margin: 0 }}>{subtitle}</p>
        </div>
    );
}

/* ── SectionBox ─────────────────────────────────────────────── */
function SectionBox({ title, subtitle, children, action }) {
    return (
        <div style={{
            background: C.surface, border: `0.5px solid ${C.border}`,
            borderRadius: "14px", overflow: "hidden", marginBottom: "18px",
        }}>
            <div style={{
                padding: "18px 22px", borderBottom: `0.5px solid ${C.border}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: "10px",
            }}>
                <div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: C.text }}>{title}</div>
                    {subtitle && (
                        <div style={{ fontSize: "12px", color: C.muted, marginTop: "3px" }}>{subtitle}</div>
                    )}
                </div>
                {action}
            </div>
            {children}
        </div>
    );
}

/* ── Divider label ──────────────────────────────────────────── */
function SectionDivider({ label }) {
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            marginBottom: "18px", marginTop: "8px",
        }}>
            <div style={{ flex: 1, height: "0.5px", background: C.border }} />
            <span style={{
                fontSize: "11px", fontWeight: 600, color: C.muted,
                textTransform: "uppercase", letterSpacing: ".8px",
                whiteSpace: "nowrap",
            }}>{label}</span>
            <div style={{ flex: 1, height: "0.5px", background: C.border }} />
        </div>
    );
}

/* ── Analytics mini-card (2-col grid) ──────────────────────── */
function AnalyticsCard({ title, subtitle, icon: Icon, children }) {
    return (
        <div style={{
            background: C.surface, border: `0.5px solid ${C.border}`,
            borderRadius: "14px", overflow: "hidden",
        }}>
            <div style={{
                padding: "16px 20px", borderBottom: `0.5px solid ${C.border}`,
                display: "flex", alignItems: "center", gap: "10px",
            }}>
                <div style={{
                    width: "32px", height: "32px", borderRadius: "8px",
                    background: C.card, border: `0.5px solid ${C.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: C.muted, flexShrink: 0,
                }}>
                    <Icon size={15} strokeWidth={1.8} />
                </div>
                <div>
                    <div style={{ fontSize: "13.5px", fontWeight: 700, color: C.text }}>{title}</div>
                    {subtitle && <div style={{ fontSize: "11.5px", color: C.muted, marginTop: "2px" }}>{subtitle}</div>}
                </div>
            </div>
            {children}
        </div>
    );
}

/* ── Payment Account Badge ──────────────────────────────────── */
function AccTypeBadge({ type }) {
    const isBank = type === "bank";
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            fontSize: "11px", fontWeight: 600,
            padding: "3px 10px", borderRadius: "20px",
            background: isBank ? "rgba(59,130,246,.12)" : "rgba(139,92,246,.12)",
            border: `0.5px solid ${isBank ? "rgba(59,130,246,.30)" : "rgba(139,92,246,.30)"}`,
            color: isBank ? "#60a5fa" : "#a78bfa",
        }}>
            {isBank ? <Building2 size={10} /> : <Smartphone size={10} />}
            {isBank ? "Bank" : "E-Wallet"}
        </span>
    );
}

/* ── Account Row ────────────────────────────────────────────── */
function AccountRow({ account, onDelete, onSetDefault, onEdit }) {
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: "14px",
            padding: "14px 22px",
            borderBottom: `0.5px solid rgba(255,255,255,.04)`,
            fontFamily: C.font,
        }}>
            <div style={{
                width: "36px", height: "36px", borderRadius: "9px", flexShrink: 0,
                background: account.type === "bank" ? "rgba(59,130,246,.10)" : "rgba(139,92,246,.10)",
                border: `0.5px solid ${account.type === "bank" ? "rgba(59,130,246,.25)" : "rgba(139,92,246,.25)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: account.type === "bank" ? "#60a5fa" : "#a78bfa",
            }}>
                {account.type === "bank" ? <CreditCard size={16} strokeWidth={1.8} /> : <Smartphone size={16} strokeWidth={1.8} />}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "3px" }}>
                    <span style={{ fontSize: "13.5px", fontWeight: 700, color: C.text }}>{account.provider_name}</span>
                    <AccTypeBadge type={account.type} />
                    {account.is_default && (
                        <span style={{
                            display: "inline-flex", alignItems: "center", gap: "4px",
                            fontSize: "11px", fontWeight: 600,
                            padding: "3px 10px", borderRadius: "20px",
                            background: "rgba(16,185,129,.12)",
                            border: "0.5px solid rgba(16,185,129,.30)",
                            color: "#34d399",
                        }}>
                            <CheckCircle size={10} /> Default
                        </span>
                    )}
                </div>
                <div style={{ fontSize: "12.5px", color: C.sub, fontFamily: "monospace" }}>
                    {account.account_number}
                    {account.account_name && (
                        <span style={{ fontFamily: C.font, color: C.muted, marginLeft: "8px" }}>
                            · {account.account_name}
                        </span>
                    )}
                </div>
            </div>

            <div style={{ display: "flex", gap: "7px", flexShrink: 0 }}>
                {!account.is_default && (
                    <button onClick={() => onSetDefault(account.id)} style={{
                        height: "30px", padding: "0 10px", borderRadius: "7px",
                        border: "0.5px solid rgba(16,185,129,.30)",
                        background: "rgba(16,185,129,.10)",
                        color: "#34d399", fontFamily: C.font,
                        fontSize: "11px", fontWeight: 600, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "4px",
                    }}>
                        <CheckCircle size={11} strokeWidth={2} /> Default
                    </button>
                )}
                <button onClick={() => onEdit(account)} style={{
                    height: "30px", padding: "0 10px", borderRadius: "7px",
                    border: "0.5px solid rgba(99,102,241,.30)",
                    background: "rgba(99,102,241,.10)",
                    color: "#a5b4fc", fontFamily: C.font,
                    fontSize: "11px", fontWeight: 600, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "4px",
                }}>
                    <Edit2 size={11} strokeWidth={2} /> Edit
                </button>
                <button onClick={() => onDelete(account.id)} style={{
                    height: "30px", padding: "0 10px", borderRadius: "7px",
                    border: "0.5px solid rgba(239,68,68,.25)",
                    background: "rgba(239,68,68,.10)",
                    color: "#fca5a5", fontFamily: C.font,
                    fontSize: "11px", fontWeight: 600, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "4px",
                }}>
                    <Trash2 size={11} strokeWidth={2} /> Hapus
                </button>
            </div>
        </div>
    );
}

/* ── providers ──────────────────────────────────────────────── */
const BANK_LIST    = ["BCA","BNI","BRI","Mandiri","BTN","CIMB Niaga","Danamon","Permata","Maybank","OCBC NISP","BSI","Muamalat","Other"];
const EWALLET_LIST = ["GoPay","OVO","Dana","ShopeePay","LinkAja","Jenius","Sakuku","Astrapay","Other"];

/* ── Account Modal ──────────────────────────────────────────── */
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
        <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.70)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999, padding: "20px",
        }}>
            <div style={{
                width: "100%", maxWidth: "420px",
                background: C.surface, border: `0.5px solid ${C.borderMd}`,
                borderRadius: "14px", padding: "24px", fontFamily: C.font,
            }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
                    <div>
                        <div style={{ fontSize: "18px", fontWeight: 800, color: C.text, letterSpacing: "-.4px" }}>
                            {editData ? "Edit rekening" : "Tambah rekening"}
                        </div>
                        <div style={{ fontSize: "12.5px", color: C.muted, marginTop: "4px" }}>
                            Rekening yang ditampilkan ke customer saat pembayaran
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        width: "30px", height: "30px", borderRadius: "7px",
                        background: C.card, border: `0.5px solid ${C.border}`,
                        color: C.muted, display: "flex", alignItems: "center",
                        justifyContent: "center", cursor: "pointer",
                    }}>
                        <X size={14} strokeWidth={2} />
                    </button>
                </div>

                <FieldLabel mt={false}>Tipe rekening</FieldLabel>
                <div style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                    {[{ key: "bank", label: "Bank", Icon: Building2 }, { key: "ewallet", label: "E-Wallet", Icon: Smartphone }].map(t => (
                        <button key={t.key} onClick={() => { setType(t.key); setProvider(""); setCustomProvider(""); setErrors({}); }} style={{
                            flex: 1, height: "36px", borderRadius: "8px", cursor: "pointer",
                            border: `0.5px solid ${type === t.key ? "rgba(99,102,241,.50)" : C.borderMd}`,
                            background: type === t.key ? "rgba(99,102,241,.15)" : "transparent",
                            color: type === t.key ? "#a5b4fc" : C.muted,
                            fontFamily: C.font, fontSize: "12.5px", fontWeight: 700,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                        }}>
                            <t.Icon size={13} /> {t.label}
                        </button>
                    ))}
                </div>

                <FieldLabel>Nama {type === "bank" ? "bank" : "e-wallet"}</FieldLabel>
                <select value={provider} onChange={e => { setProvider(e.target.value); setErrors(prev => ({ ...prev, provider: null })); }}
                    style={{ ...inp(!!errors.provider), height: "40px", cursor: "pointer" }}>
                    <option value="">-- Pilih {type === "bank" ? "bank" : "e-wallet"} --</option>
                    {providerList.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {errors.provider && <div style={{ fontSize: "11.5px", color: "#f87171", marginTop: "4px" }}>{errors.provider}</div>}

                {provider === "Other" && (
                    <>
                        <FieldLabel>Nama lainnya</FieldLabel>
                        <input style={inp()} type="text" placeholder="Tulis nama provider..."
                            value={customProvider} onChange={e => setCustomProvider(e.target.value)} />
                    </>
                )}

                <FieldLabel>Nomor rekening / nomor HP</FieldLabel>
                <input style={inp(!!errors.accountNumber)} type="text"
                    placeholder={type === "bank" ? "e.g. 1234 5678 9012" : "e.g. 08123456789"}
                    value={accountNumber} onChange={e => { setAccountNumber(e.target.value); setErrors(prev => ({ ...prev, accountNumber: null })); }} />
                {errors.accountNumber && <div style={{ fontSize: "11.5px", color: "#f87171", marginTop: "4px" }}>{errors.accountNumber}</div>}

                <FieldLabel>Nama pemilik {type === "bank" ? "(wajib)" : "(opsional)"}</FieldLabel>
                <input style={inp(!!errors.accountName)} type="text"
                    placeholder="Nama sesuai rekening"
                    value={accountName} onChange={e => { setAccountName(e.target.value); setErrors(prev => ({ ...prev, accountName: null })); }} />
                {errors.accountName && <div style={{ fontSize: "11.5px", color: "#f87171", marginTop: "4px" }}>{errors.accountName}</div>}

                <div style={{
                    display: "flex", justifyContent: "flex-end", gap: "8px",
                    marginTop: "22px", paddingTop: "16px",
                    borderTop: `0.5px solid ${C.border}`,
                }}>
                    <button onClick={onClose} style={{
                        height: "36px", padding: "0 14px", borderRadius: "8px",
                        border: `0.5px solid ${C.borderMd}`, background: "transparent",
                        color: C.sub, fontFamily: C.font, fontSize: "13px", fontWeight: 600, cursor: "pointer",
                    }}>Batal</button>
                    <button onClick={handleSave} style={{
                        height: "36px", padding: "0 18px", borderRadius: "8px",
                        border: "none", background: "#6366f1",
                        color: "#fff", fontFamily: C.font, fontSize: "13px",
                        fontWeight: 700, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "5px",
                    }}>
                        <CheckCircle size={14} strokeWidth={2.5} />
                        {editData ? "Update" : "Simpan"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Payment Accounts Section ───────────────────────────────── */
function PaymentAccountsSection() {
    const [accounts,  setAccounts]  = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editData,  setEditData]  = useState(null);
    const [filter,    setFilter]    = useState("all");

    const loadAccounts = async () => {
        try {
            const res = await axios.get("/owner/payment-accounts", {
                headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
            });
            setAccounts(Array.isArray(res.data) ? res.data : res.data?.data ?? []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadAccounts(); }, []);

    const handleSave = async (data) => {
        try {
            if (editData) {
                await axios.put(`/owner/payment-accounts/${editData.id}`, data, {
                    headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
                });
            } else {
                await axios.post("/owner/payment-accounts", data, {
                    headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
                });
            }
            await loadAccounts();
            setShowModal(false);
            setEditData(null);
        } catch (err) {
            alert(err.response?.data?.message ?? "Gagal menyimpan rekening.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Hapus rekening ini?")) return;
        try {
            await axios.delete(`/owner/payment-accounts/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
            });
            await loadAccounts();
        } catch (err) {
            alert(err.response?.data?.message ?? "Gagal menghapus.");
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await axios.put(`/owner/payment-accounts/${id}/set-default`, {}, {
                headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
            });
            await loadAccounts();
        } catch (err) {
            alert("Gagal mengatur default.");
        }
    };

    const counts   = { all: accounts.length, bank: accounts.filter(a => a.type === "bank").length, ewallet: accounts.filter(a => a.type === "ewallet").length };
    const filtered = filter === "all" ? accounts : accounts.filter(a => a.type === filter);

    const addBtn = (
        <button onClick={() => { setEditData(null); setShowModal(true); }} style={{
            height: "34px", padding: "0 14px",
            border: "0.5px solid rgba(99,102,241,.40)",
            borderRadius: "8px",
            background: "rgba(99,102,241,.15)",
            color: "#a5b4fc", fontFamily: C.font,
            fontWeight: 700, fontSize: "12.5px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "6px",
        }}>
            <Plus size={14} strokeWidth={2.5} /> Tambah rekening
        </button>
    );

    return (
        <>
            <SectionBox
                title="Rekening pembayaran"
                subtitle="Rekening bank atau e-wallet yang ditampilkan ke customer saat checkout"
                action={addBtn}
            >
                <div style={{ padding: "12px 22px", borderBottom: `0.5px solid ${C.border}`, display: "flex", gap: "6px" }}>
                    {[{ key: "all", label: "Semua" }, { key: "bank", label: "Bank" }, { key: "ewallet", label: "E-Wallet" }].map(f => (
                        <button key={f.key} onClick={() => setFilter(f.key)} style={{
                            height: "28px", padding: "0 12px", borderRadius: "6px", cursor: "pointer",
                            border: `0.5px solid ${filter === f.key ? "rgba(99,102,241,.40)" : C.border}`,
                            background: filter === f.key ? "rgba(99,102,241,.12)" : "transparent",
                            color: filter === f.key ? "#a5b4fc" : C.muted,
                            fontFamily: C.font, fontSize: "12px", fontWeight: 600,
                        }}>
                            {f.label} ({counts[f.key]})
                        </button>
                    ))}
                </div>

                {loading && (
                    <div style={{ padding: "32px", textAlign: "center", color: C.muted, fontSize: "13px" }}>Memuat data...</div>
                )}
                {!loading && filtered.length === 0 && (
                    <EmptyState
                        title="Belum ada rekening"
                        subtitle="Tambahkan rekening bank atau e-wallet agar customer bisa melakukan pembayaran."
                        icon={Wallet}
                    />
                )}
                {!loading && filtered.map(account => (
                    <AccountRow
                        key={account.id}
                        account={account}
                        onDelete={handleDelete}
                        onSetDefault={handleSetDefault}
                        onEdit={a => { setEditData(a); setShowModal(true); }}
                    />
                ))}
                {!loading && accounts.length > 0 && (
                    <div style={{
                        margin: "14px 22px",
                        padding: "10px 14px", borderRadius: "8px",
                        background: "rgba(99,102,241,.07)",
                        border: "0.5px solid rgba(99,102,241,.18)",
                        fontSize: "12px", color: C.muted, lineHeight: 1.6,
                    }}>
                        💡 Rekening bertanda <strong style={{ color: "#34d399" }}>Default</strong> akan ditampilkan sebagai metode pembayaran utama ke customer.
                    </div>
                )}
            </SectionBox>

            {showModal && (
                <AccountModal
                    editData={editData}
                    onClose={() => { setShowModal(false); setEditData(null); }}
                    onSave={handleSave}
                />
            )}
        </>
    );
}

/* ── Main Page ──────────────────────────────────────────────── */
export default function RevenueOwner() {
    const [stats] = useState({
        today:        "Rp 0",
        month:        "Rp 0",
        growth:       "0%",
        total_orders: 0,
    });

    return (
        <OwnerLayout>
            <div style={{ fontFamily: C.font }}>

                {/* ── header ── */}
                <div style={{ marginBottom: "28px" }}>
                    <div style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        fontSize: "11px", fontWeight: 600, color: C.muted,
                        textTransform: "uppercase", letterSpacing: ".8px",
                        marginBottom: "14px",
                    }}>
                        <LayoutDashboard size={13} strokeWidth={2} />
                        <span>Owner</span>
                        <span style={{ color: "#1E293B" }}>›</span>
                        <span>Revenue & Laporan</span>
                    </div>
                    <h1 style={{
                        fontSize: "28px", fontWeight: 800, color: C.text,
                        letterSpacing: "-.8px", lineHeight: 1.1, margin: 0,
                    }}>Pendapatan & Laporan</h1>
                    <p style={{ marginTop: "8px", fontSize: "13.5px", color: C.muted, lineHeight: "1.7" }}>
                        Ringkasan pendapatan dari pesanan customer, rekening pembayaran, dan analitik bisnis.
                    </p>
                </div>

                {/* ── stat cards — 4 kolom 1 baris ── */}
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(4,1fr)",
                    gap: "12px", marginBottom: "22px",
                }}>
                    <StatCard label="Pendapatan hari ini" value={stats.today}        icon={DollarSign}   bar={bars.green}  />
                    <StatCard label="Bulan ini"           value={stats.month}        icon={Calendar}     bar={bars.blue}   />
                    <StatCard label="Pertumbuhan"         value={stats.growth}       icon={TrendingUp}   bar={bars.amber}  />
                    <StatCard label="Total pesanan"       value={stats.total_orders} icon={ShoppingBag}  bar={bars.indigo} />
                </div>

                {/* ── rekening pembayaran ── */}
                <PaymentAccountsSection />

                {/* ── riwayat transaksi ── */}
                <SectionBox
                    title="Riwayat transaksi"
                    subtitle="Daftar pembayaran masuk dari pesanan customer"
                >
                    <EmptyState
                        title="Belum ada transaksi"
                        subtitle="Riwayat pembayaran dari pesanan customer akan muncul otomatis di sini."
                        icon={DollarSign}
                    />
                </SectionBox>

                {/* ── divider laporan ── */}
                <SectionDivider label="Analitik & Laporan" />

                {/* ── analytics grid 2-col ── */}
                <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr",
                    gap: "14px", marginBottom: "18px",
                }}>
                    <AnalyticsCard
                        title="Laporan penjualan"
                        subtitle="Tren pesanan dan total transaksi"
                        icon={BarChart3}
                    >
                        <EmptyState
                            title="Belum ada data"
                            subtitle="Laporan penjualan akan muncul setelah ada pesanan yang diproses."
                            icon={BarChart3}
                        />
                    </AnalyticsCard>

                    <AnalyticsCard
                        title="Analisis pendapatan"
                        subtitle="Ringkasan bulanan dan tahunan"
                        icon={TrendingUp}
                    >
                        <EmptyState
                            title="Belum ada data"
                            subtitle="Ringkasan pendapatan akan tampil setelah ada transaksi tercatat."
                            icon={TrendingUp}
                        />
                    </AnalyticsCard>
                </div>

                {/* ── paket terlaris — full width ── */}
                <SectionBox
                    title="Paket terlaris"
                    subtitle="Paket catering yang paling banyak dipesan customer"
                >
                    <EmptyState
                        title="Belum ada data"
                        subtitle="Ranking paket catering terpopuler akan muncul setelah ada pesanan dari customer."
                        icon={Package}
                    />
                </SectionBox>

            </div>
        </OwnerLayout>
    );
}