// resources/js/pages/owner/RevenueOwner.jsx

import { useState, useEffect } from "react";
import axios from "axios";

import {
    DollarSign,
    TrendingUp,
    Calendar,
    Wallet,
    Plus,
    Trash2,
    CreditCard,
    Smartphone,
    CheckCircle,
    X,
    Building2,
    Edit2,
} from "lucide-react";

import OwnerLayout from "../../layouts/OwnerLayout";

// ─── Reusable UI primitives ──────────────────────────────────────────────────

function MetricCard({ title, value = 0, icon, color = "#60a5fa" }) {
    return (
        <div
            style={{
                background:
                    "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))",
                border: "1px solid rgba(148,163,184,0.08)",
                borderRadius: "22px",
                padding: "22px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 16px 40px rgba(0,0,0,0.30)",
            }}
        >
            <div>
                <div
                    style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.7px",
                        marginBottom: "10px",
                    }}
                >
                    {title}
                </div>
                <div
                    style={{
                        fontSize: "32px",
                        fontWeight: "800",
                        color: "#ffffff",
                        lineHeight: 1,
                    }}
                >
                    {value}
                </div>
            </div>
            <div
                style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "18px",
                    background: "rgba(59,130,246,0.12)",
                    border: "1px solid rgba(59,130,246,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color,
                }}
            >
                {icon}
            </div>
        </div>
    );
}

function SectionCard({ title, subtitle, children }) {
    return (
        <div
            style={{
                background:
                    "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(30,41,59,0.96))",
                border: "1px solid rgba(148,163,184,0.08)",
                borderRadius: "24px",
                padding: "28px",
                boxShadow: "0 18px 45px rgba(0,0,0,0.28)",
                marginBottom: "24px",
            }}
        >
            <div style={{ marginBottom: "22px" }}>
                <h2
                    style={{
                        margin: 0,
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "#ffffff",
                    }}
                >
                    {title}
                </h2>
                <p
                    style={{
                        margin: "8px 0 0",
                        color: "#94a3b8",
                        fontSize: "14px",
                        lineHeight: "1.7",
                    }}
                >
                    {subtitle}
                </p>
            </div>
            {children}
        </div>
    );
}

function EmptyState({ title, subtitle, icon }) {
    return (
        <div
            style={{
                minHeight: "280px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: "20px",
            }}
        >
            <div
                style={{
                    width: "86px",
                    height: "86px",
                    borderRadius: "24px",
                    background: "rgba(59,130,246,0.10)",
                    border: "1px solid rgba(59,130,246,0.16)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#60a5fa",
                    marginBottom: "24px",
                }}
            >
                {icon}
            </div>
            <h3
                style={{
                    margin: 0,
                    fontSize: "28px",
                    fontWeight: "800",
                    color: "#ffffff",
                }}
            >
                {title}
            </h3>
            <p
                style={{
                    margin: "14px 0 0",
                    maxWidth: "520px",
                    color: "#94a3b8",
                    fontSize: "15px",
                    lineHeight: "1.9",
                }}
            >
                {subtitle}
            </p>
        </div>
    );
}

// ─── Payment Account Section ─────────────────────────────────────────────────

const BANK_LIST = [
    "BCA", "BNI", "BRI", "Mandiri", "BTN",
    "CIMB Niaga", "Danamon", "Permata", "Maybank", "OCBC NISP",
    "BSI", "Muamalat", "Other",
];

const EWALLET_LIST = [
    "GoPay", "OVO", "Dana", "ShopeePay", "LinkAja",
    "Jenius", "Sakuku", "Astrapay", "Other",
];

const TYPE_TABS = [
    { key: "bank", label: "Bank Account", icon: <Building2 size={15} /> },
    { key: "ewallet", label: "E-Wallet", icon: <Smartphone size={15} /> },
];

const ACCENT = {
    bank: "#3b82f6",
    ewallet: "#8b5cf6",
};

function Badge({ type }) {
    const isBank = type === "bank";
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                padding: "3px 10px",
                borderRadius: "99px",
                background: isBank
                    ? "rgba(59,130,246,0.15)"
                    : "rgba(139,92,246,0.15)",
                color: isBank ? "#60a5fa" : "#a78bfa",
                border: `1px solid ${isBank ? "rgba(59,130,246,0.25)" : "rgba(139,92,246,0.25)"}`,
            }}
        >
            {isBank ? <Building2 size={11} /> : <Smartphone size={11} />}
            {isBank ? "Bank" : "E-Wallet"}
        </span>
    );
}

function AccountCard({ account, onDelete, onSetDefault, onEdit }) {
    return (
        <div
            style={{
                background: account.is_default
                    ? "linear-gradient(145deg, rgba(30,41,59,0.95), rgba(15,23,42,0.98))"
                    : "rgba(15,23,42,0.6)",
                border: account.is_default
                    ? `1px solid ${ACCENT[account.type]}55`
                    : "1px solid rgba(148,163,184,0.08)",
                borderRadius: "18px",
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                position: "relative",
                transition: "border-color 0.2s",
            }}
        >
            {/* Icon */}
            <div
                style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background:
                        account.type === "bank"
                            ? "rgba(59,130,246,0.12)"
                            : "rgba(139,92,246,0.12)",
                    border: `1px solid ${
                        account.type === "bank"
                            ? "rgba(59,130,246,0.20)"
                            : "rgba(139,92,246,0.20)"
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: account.type === "bank" ? "#60a5fa" : "#a78bfa",
                    flexShrink: 0,
                }}
            >
                {account.type === "bank" ? (
                    <CreditCard size={22} />
                ) : (
                    <Smartphone size={22} />
                )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                        flexWrap: "wrap",
                    }}
                >
                    <span
                        style={{
                            fontSize: "15px",
                            fontWeight: "700",
                            color: "#ffffff",
                        }}
                    >
                        {account.provider_name}
                    </span>
                    <Badge type={account.type} />
                    {account.is_default && (
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "11px",
                                fontWeight: "700",
                                padding: "3px 10px",
                                borderRadius: "99px",
                                background: "rgba(34,197,94,0.15)",
                                color: "#4ade80",
                                border: "1px solid rgba(34,197,94,0.25)",
                            }}
                        >
                            <CheckCircle size={11} />
                            Default
                        </span>
                    )}
                </div>
                <div
                    style={{
                        fontSize: "13px",
                        color: "#94a3b8",
                        fontFamily: "monospace",
                        letterSpacing: "0.5px",
                    }}
                >
                    {account.account_number}
                </div>
                {account.account_name && (
                    <div
                        style={{
                            fontSize: "12px",
                            color: "#64748b",
                            marginTop: "2px",
                        }}
                    >
                        Account holder: {account.account_name}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                {!account.is_default && (
                    <button
                        onClick={() => onSetDefault(account.id)}
                        title="Set as default"
                        style={{
                            background: "rgba(34,197,94,0.10)",
                            border: "1px solid rgba(34,197,94,0.20)",
                            borderRadius: "10px",
                            color: "#4ade80",
                            width: "36px",
                            height: "36px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "background 0.15s",
                        }}
                    >
                        <CheckCircle size={16} />
                    </button>
                )}
                <button
                    onClick={() => onEdit(account)}
                    title="Edit"
                    style={{
                        background: "rgba(59,130,246,0.10)",
                        border: "1px solid rgba(59,130,246,0.20)",
                        borderRadius: "10px",
                        color: "#60a5fa",
                        width: "36px",
                        height: "36px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "background 0.15s",
                    }}
                >
                    <Edit2 size={15} />
                </button>
                <button
                    onClick={() => onDelete(account.id)}
                    title="Delete"
                    style={{
                        background: "rgba(239,68,68,0.10)",
                        border: "1px solid rgba(239,68,68,0.20)",
                        borderRadius: "10px",
                        color: "#f87171",
                        width: "36px",
                        height: "36px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "background 0.15s",
                    }}
                >
                    <Trash2 size={15} />
                </button>
            </div>
        </div>
    );
}

// ─── Modal Form ───────────────────────────────────────────────────────────────

function AccountFormModal({ editData, onClose, onSave }) {
    const [type, setType] = useState(editData?.type ?? "bank");
    const [provider, setProvider] = useState(editData?.provider_name ?? "");
    const [customProvider, setCustomProvider] = useState(
        editData?.provider_name &&
            ![...BANK_LIST, ...EWALLET_LIST].includes(editData.provider_name)
            ? editData.provider_name
            : ""
    );
    const [accountNumber, setAccountNumber] = useState(editData?.account_number ?? "");
    const [accountName, setAccountName] = useState(editData?.account_name ?? "");
    const [errors, setErrors] = useState({});

    const providerList = type === "bank" ? BANK_LIST : EWALLET_LIST;
    const isCustom = provider === "Other" || !!customProvider;

    const validate = () => {
        const e = {};
        const finalProvider = isCustom ? customProvider.trim() : provider;
        if (!finalProvider) e.provider = "Please select or enter a provider name.";
        if (!accountNumber.trim()) e.accountNumber = "Account number is required.";
        if (type === "bank" && !accountName.trim())
            e.accountName = "Account holder name is required.";
        return e;
    };

    const handleSave = () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        const finalProvider = isCustom ? customProvider.trim() : provider;
        onSave({
            type,
            provider_name: finalProvider,
            account_number: accountNumber,
            account_name: accountName,
        });
    };

    const inputStyle = (err) => ({
        width: "100%",
        background: "rgba(15,23,42,0.8)",
        border: `1px solid ${err ? "rgba(239,68,68,0.5)" : "rgba(148,163,184,0.15)"}`,
        borderRadius: "12px",
        padding: "12px 14px",
        color: "#ffffff",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box",
    });

    const labelStyle = {
        fontSize: "12px",
        fontWeight: "700",
        color: "#94a3b8",
        textTransform: "uppercase",
        letterSpacing: "0.6px",
        marginBottom: "8px",
        display: "block",
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.65)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "20px",
            }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                style={{
                    background:
                        "linear-gradient(145deg, rgba(15,23,42,0.99), rgba(30,41,59,0.99))",
                    border: "1px solid rgba(148,163,184,0.12)",
                    borderRadius: "24px",
                    padding: "32px",
                    width: "100%",
                    maxWidth: "480px",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "28px",
                    }}
                >
                    <div>
                        <h3
                            style={{
                                margin: 0,
                                fontSize: "20px",
                                fontWeight: "800",
                                color: "#ffffff",
                            }}
                        >
                            {editData ? "Edit Payment Account" : "Add Payment Account"}
                        </h3>
                        <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#64748b" }}>
                            Bank account or e-wallet to receive payments from clients
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: "rgba(148,163,184,0.08)",
                            border: "1px solid rgba(148,163,184,0.12)",
                            borderRadius: "10px",
                            color: "#94a3b8",
                            width: "36px",
                            height: "36px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Type Tabs */}
                <div style={{ marginBottom: "22px" }}>
                    <span style={labelStyle}>Account Type</span>
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                        }}
                    >
                        {TYPE_TABS.map((t) => (
                            <button
                                key={t.key}
                                onClick={() => { setType(t.key); setProvider(""); setCustomProvider(""); setErrors({}); }}
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "7px",
                                    padding: "11px",
                                    borderRadius: "12px",
                                    border: `1px solid ${
                                        type === t.key
                                            ? `${ACCENT[t.key]}60`
                                            : "rgba(148,163,184,0.12)"
                                    }`,
                                    background:
                                        type === t.key
                                            ? `${ACCENT[t.key]}18`
                                            : "rgba(15,23,42,0.6)",
                                    color:
                                        type === t.key ? ACCENT[t.key] : "#64748b",
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                    transition: "all 0.15s",
                                }}
                            >
                                {t.icon}
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Provider Select */}
                <div style={{ marginBottom: "18px" }}>
                    <label style={labelStyle}>
                        {type === "bank" ? "Bank Name" : "E-Wallet Name"}
                    </label>
                    <select
                        value={provider}
                        onChange={(e) => { setProvider(e.target.value); setErrors((prev) => ({ ...prev, provider: null })); }}
                        style={{ ...inputStyle(errors.provider), cursor: "pointer" }}
                    >
                        <option value="">-- Select {type === "bank" ? "Bank" : "E-Wallet"} --</option>
                        {providerList.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                    {errors.provider && (
                        <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#f87171" }}>
                            {errors.provider}
                        </p>
                    )}
                </div>

                {/* Custom Provider */}
                {provider === "Other" && (
                    <div style={{ marginBottom: "18px" }}>
                        <label style={labelStyle}>
                            {type === "bank" ? "Other Bank Name" : "Other E-Wallet Name"}
                        </label>
                        <input
                            type="text"
                            placeholder={`Enter the ${type === "bank" ? "bank" : "e-wallet"} name...`}
                            value={customProvider}
                            onChange={(e) => setCustomProvider(e.target.value)}
                            style={inputStyle(false)}
                        />
                    </div>
                )}

                {/* Account Number */}
                <div style={{ marginBottom: "18px" }}>
                    <label style={labelStyle}>
                        {type === "bank" ? "Account Number" : "Account / Phone Number"}
                    </label>
                    <input
                        type="text"
                        placeholder={
                            type === "bank"
                                ? "e.g. 1234 5678 9012"
                                : "e.g. 08123456789"
                        }
                        value={accountNumber}
                        onChange={(e) => { setAccountNumber(e.target.value); setErrors((prev) => ({ ...prev, accountNumber: null })); }}
                        style={inputStyle(errors.accountNumber)}
                    />
                    {errors.accountNumber && (
                        <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#f87171" }}>
                            {errors.accountNumber}
                        </p>
                    )}
                </div>

                {/* Account Name */}
                <div style={{ marginBottom: "28px" }}>
                    <label style={labelStyle}>
                        Account Holder Name {type === "bank" ? "(required)" : "(optional)"}
                    </label>
                    <input
                        type="text"
                        placeholder="Name as registered on the account"
                        value={accountName}
                        onChange={(e) => { setAccountName(e.target.value); setErrors((prev) => ({ ...prev, accountName: null })); }}
                        style={inputStyle(errors.accountName)}
                    />
                    {errors.accountName && (
                        <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#f87171" }}>
                            {errors.accountName}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "12px" }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: "13px",
                            borderRadius: "12px",
                            background: "rgba(148,163,184,0.08)",
                            border: "1px solid rgba(148,163,184,0.12)",
                            color: "#94a3b8",
                            fontSize: "14px",
                            fontWeight: "700",
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        style={{
                            flex: 2,
                            padding: "13px",
                            borderRadius: "12px",
                            background:
                                "linear-gradient(135deg, #3b82f6, #6366f1)",
                            border: "none",
                            color: "#ffffff",
                            fontSize: "14px",
                            fontWeight: "700",
                            cursor: "pointer",
                            boxShadow: "0 8px 24px rgba(59,130,246,0.35)",
                        }}
                    >
                        {editData ? "Save Changes" : "Add Account"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Payment Accounts Manager ─────────────────────────────────────────────────

function PaymentAccountsSection() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all");

    const getToken = () => localStorage.getItem("token");

    const loadAccounts = async () => {
        try {
            const res = await axios.get("/owner/payment-accounts", {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    Accept: "application/json",
                },
            });

            setAccounts(Array.isArray(res.data) ? res.data : (res.data?.data ?? []));
        } catch (err) {
            console.error("ERROR LOAD ACCOUNTS:", err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ FIX: fetch accounts on mount so they persist across refresh
    useEffect(() => {
        loadAccounts();
    }, []);

    const handleSave = async (data) => {
        try {
            if (editData) {
                await axios.put(
                    `/api/owner/payment-accounts/${editData.id}`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${getToken()}`,
                            Accept: "application/json",
                        },
                    }
                );
            } else {
                await axios.post("/owner/payment-accounts", data, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        Accept: "application/json",
                    },
                });
            }

            await loadAccounts();
            setShowModal(false);
            setEditData(null);
        } catch (err) {
            console.error(err);
            alert("Failed to save payment account");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this payment account?")) return;

        try {
            await axios.delete(`/api/owner/payment-accounts/${id}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    Accept: "application/json",
                },
            });
            await loadAccounts();
        } catch (err) {
            console.error(err);
            alert("Failed to delete payment account");
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await axios.put(
                `/api/owner/payment-accounts/${id}/set-default`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        Accept: "application/json",
                    },
                }
            );
            await loadAccounts();
        } catch (err) {
            console.error(err);
            alert("Failed to set default account");
        }
    };

    const handleEdit = (account) => {
        setEditData(account);
        setShowModal(true);
    };

    const filtered =
        activeFilter === "all"
            ? accounts
            : accounts.filter((a) => a.type === activeFilter);

    const counts = {
        all: accounts.length,
        bank: accounts.filter((a) => a.type === "bank").length,
        ewallet: accounts.filter((a) => a.type === "ewallet").length,
    };

    return (
        <>
            <SectionCard
                title="Payment Accounts"
                subtitle="Register bank accounts and e-wallets as payment methods shown to clients."
            >
                {/* Top bar */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                        flexWrap: "wrap",
                        gap: "12px",
                    }}
                >
                    {/* Filter tabs */}
                    <div
                        style={{
                            display: "flex",
                            gap: "8px",
                            background: "rgba(15,23,42,0.6)",
                            border: "1px solid rgba(148,163,184,0.08)",
                            borderRadius: "12px",
                            padding: "4px",
                        }}
                    >
                        {[
                            { key: "all", label: "All" },
                            { key: "bank", label: "Bank" },
                            { key: "ewallet", label: "E-Wallet" },
                        ].map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setActiveFilter(f.key)}
                                style={{
                                    padding: "7px 16px",
                                    borderRadius: "9px",
                                    border: "none",
                                    background:
                                        activeFilter === f.key
                                            ? "rgba(59,130,246,0.20)"
                                            : "transparent",
                                    color:
                                        activeFilter === f.key ? "#60a5fa" : "#64748b",
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                    transition: "all 0.15s",
                                }}
                            >
                                {f.label}
                                <span
                                    style={{
                                        marginLeft: "6px",
                                        fontSize: "11px",
                                        opacity: 0.75,
                                    }}
                                >
                                    ({counts[f.key]})
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Add button */}
                    <button
                        onClick={() => { setEditData(null); setShowModal(true); }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "10px 20px",
                            borderRadius: "12px",
                            background:
                                "linear-gradient(135deg, #3b82f6, #6366f1)",
                            border: "none",
                            color: "#ffffff",
                            fontSize: "14px",
                            fontWeight: "700",
                            cursor: "pointer",
                            boxShadow: "0 6px 20px rgba(59,130,246,0.35)",
                        }}
                    >
                        <Plus size={16} />
                        Add Account
                    </button>
                </div>

                {/* Account list */}
                {loading ? (
                    <div
                        style={{
                            minHeight: "120px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#64748b",
                            fontSize: "14px",
                        }}
                    >
                        Loading accounts...
                    </div>
                ) : filtered.length === 0 ? (
                    <div
                        style={{
                            minHeight: "200px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            padding: "20px",
                            border: "1px dashed rgba(148,163,184,0.15)",
                            borderRadius: "16px",
                        }}
                    >
                        <div
                            style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "16px",
                                background: "rgba(59,130,246,0.10)",
                                border: "1px solid rgba(59,130,246,0.16)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#60a5fa",
                                marginBottom: "16px",
                            }}
                        >
                            <Wallet size={26} />
                        </div>
                        <p
                            style={{
                                margin: 0,
                                fontSize: "15px",
                                fontWeight: "700",
                                color: "#ffffff",
                            }}
                        >
                            No accounts registered yet
                        </p>
                        <p
                            style={{
                                margin: "8px 0 0",
                                fontSize: "13px",
                                color: "#64748b",
                                maxWidth: "360px",
                                lineHeight: 1.7,
                            }}
                        >
                            Add a bank account or e-wallet so clients can easily
                            make payments.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {filtered.map((account) => (
                            <AccountCard
                                key={account.id}
                                account={account}
                                onDelete={handleDelete}
                                onSetDefault={handleSetDefault}
                                onEdit={handleEdit}
                            />
                        ))}
                    </div>
                )}

                {/* Info note */}
                {!loading && accounts.length > 0 && (
                    <div
                        style={{
                            marginTop: "18px",
                            padding: "12px 16px",
                            borderRadius: "12px",
                            background: "rgba(59,130,246,0.07)",
                            border: "1px solid rgba(59,130,246,0.14)",
                            fontSize: "12px",
                            color: "#64748b",
                            lineHeight: 1.6,
                        }}
                    >
                        💡 Accounts marked <strong style={{ color: "#4ade80" }}>Default</strong>{" "}
                        will be shown as the priority payment method to clients.
                        Use the ✓ button to change the default account.
                    </div>
                )}
            </SectionCard>

            {showModal && (
                <AccountFormModal
                    editData={editData}
                    onClose={() => { setShowModal(false); setEditData(null); }}
                    onSave={handleSave}
                />
            )}
        </>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RevenueOwner() {
    return (
        <OwnerLayout>
            {/* Header */}
            <div style={{ marginBottom: "32px" }}>
                <h1
                    style={{
                        margin: 0,
                        fontSize: "36px",
                        fontWeight: "800",
                        color: "#ffffff",
                    }}
                >
                    Revenue
                </h1>
                <p
                    style={{
                        margin: "10px 0 0",
                        color: "#94a3b8",
                        fontSize: "15px",
                        lineHeight: "1.8",
                        maxWidth: "680px",
                    }}
                >
                    Monitor company revenue, operational expenses, profit growth, and
                    overall financial performance.
                </p>
            </div>

            {/* Summary Cards */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))",
                    gap: "20px",
                    marginBottom: "24px",
                }}
            >
                <MetricCard
                    title="Today's Revenue"
                    value="Rp 0"
                    icon={<DollarSign size={24} />}
                    color="#22c55e"
                />
                <MetricCard
                    title="This Month"
                    value="Rp 0"
                    icon={<Calendar size={24} />}
                    color="#3b82f6"
                />
                <MetricCard
                    title="Growth"
                    value="0 %"
                    icon={<TrendingUp size={24} />}
                    color="#f59e0b"
                />
                <MetricCard
                    title="Net Profit"
                    value="Rp 0"
                    icon={<Wallet size={24} />}
                    color="#8b5cf6"
                />
            </div>

            {/* Payment Accounts */}
            <PaymentAccountsSection />

            {/* Monthly Revenue */}
            <SectionCard
                title="Monthly Revenue"
                subtitle="Income overview and monthly financial growth performance."
            >
                <EmptyState
                    title="No Revenue Data"
                    subtitle="Monthly revenue reports and financial records will appear here once business transactions are available."
                    icon={<DollarSign size={40} />}
                />
            </SectionCard>

            {/* Expense Analysis */}
            <SectionCard
                title="Expense Analysis"
                subtitle="Track operational costs, spending activity, and business expenses."
            >
                <EmptyState
                    title="No Expense Data"
                    subtitle="Expense analysis and operational cost reports will appear here."
                    icon={<Wallet size={40} />}
                />
            </SectionCard>

            {/* Profit Summary */}
            <SectionCard
                title="Profit Summary"
                subtitle="Revenue performance after operational and production expenses."
            >
                <EmptyState
                    title="No Profit Data"
                    subtitle="Profit summaries and net income analytics will appear here."
                    icon={<TrendingUp size={40} />}
                />
            </SectionCard>
        </OwnerLayout>
    );
}