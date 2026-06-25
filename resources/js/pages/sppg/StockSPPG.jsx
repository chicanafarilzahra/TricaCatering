import { useEffect, useState } from "react";
import axios from "axios";

import SidebarSPPG from "../../components/SidebarSPPG";

import {
    Package,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Search,
    Plus,
    X,
    Trash2,
} from "lucide-react";

export default function StockSPPG() {
    const [summary, setSummary] = useState({});
    const [stocks, setStocks] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [form, setForm] = useState({
        name: "",
        qty: "",
        unit: "",
        minimum_stock: "",
    });

    useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
}, []);

    useEffect(() => {
        loadStocks();
    }, []);

    const loadStocks = async () => {
        try {
            const token =
                localStorage.getItem("token");

            const res = await axios.get(
                "/sppg/stocks",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            setSummary(res.data.summary);
            setStocks(res.data.stocks);
        } catch (err) {
            console.log(err);
        }
    };

    const saveStock = async () => {
        try {
            const token =
                localStorage.getItem("token");

            await axios.post(
                "/sppg/stocks",
                form,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            setShowModal(false);

            setForm({
                name: "",
                qty: "",
                unit: "",
                minimum_stock: "",
            });

            loadStocks();
        } catch (err) {
            console.log(err);
            alert("Gagal menambah stok");
        }
    };

    const deleteStock = async (id) => {
        if (
            !confirm(
                "Yakin hapus stok ini?"
            )
        )
            return;

        try {
            const token =
                localStorage.getItem("token");

            await axios.delete(
                `/api/sppg/stocks/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            loadStocks();
        } catch (err) {
            console.log(err);
        }
    };

    const filtered = stocks.filter(
        (item) =>
            item.name
                ?.toLowerCase()
                .includes(
                    search.toLowerCase()
                )
    );

    return (
        <>
            <SidebarSPPG />

        <div
    style={{
        marginLeft: 270,
        minHeight: "100vh",
        width: "calc(100% - 270px)",
        background:
            "linear-gradient(135deg,#081120,#0f172a)",
        padding: 30,
        boxSizing: "border-box",
        overflow: "hidden",
    }}
>
                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "center",
                        marginBottom:
                            "25px",
                    }}
                >
                    <div>
                        <h1
                            style={{
                                color:
                                    "#fff",
                                margin: 0,
                                fontSize:
                                    "32px",
                            }}
                        >
                            🥬 Manajemen Bahan
                        </h1>

                        <p
                            style={{
                                color:
                                    "#94a3b8",
                            }}
                        >
                            Kelola bahan baku dan persediaan dapur SPPG
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            setShowModal(
                                true
                            )
                        }
                        style={{
                            border: "none",
                            padding:
                                "14px 22px",
                            borderRadius:
                                "15px",
                            background:
                                "linear-gradient(135deg,#2563eb,#06b6d4)",
                            color:
                                "#fff",
                            cursor:
                                "pointer",
                            display:
                                "flex",
                            gap: "8px",
                            alignItems:
                                "center",
                            fontWeight:
                                "700",
                        }}
                    >
                        <Plus
                            size={18}
                        />
                        Tambah Bahan
                    </button>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(4,1fr)",
                        gap: "20px",
                        marginBottom:
                            "25px",
                    }}
                >
                    <StatCard
                        title="Total Bahan"
                        value={
                            summary.total_bahan
                        }
                        icon={
                            <Package />
                        }
                        color="#3b82f6"
                    />

                    <StatCard
                        title="Stok Aman"
                        value={
                            summary.stok_aman
                        }
                        icon={
                            <CheckCircle />
                        }
                        color="#22c55e"
                    />

                    <StatCard
                        title="Menipis"
                        value={
                            summary.stok_menipis
                        }
                        icon={
                            <AlertTriangle />
                        }
                        color="#f59e0b"
                    />

                    <StatCard
                        title="Habis"
                        value={
                            summary.stok_habis
                        }
                        icon={
                            <XCircle />
                        }
                        color="#ef4444"
                    />
                </div>

                <div
                    style={{
                        background:
                            "#111827",
                        padding:
                            "18px",
                        borderRadius:
                            "20px",
                        marginBottom:
                            "20px",
                    }}
                >
                    <div
                        style={{
                            position:
                                "relative",
                        }}
                    >
                        <Search
                            size={18}
                            style={{
                                position:
                                    "absolute",
                                top: 14,
                                left: 14,
                                color:
                                    "#94a3b8",
                            }}
                        />

                       <input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Cari bahan..."
                        style={{
                            width: "100%",
                            boxSizing: "border-box", // TAMBAH INI
                            padding: "14px 14px 14px 45px",
                            border: "none",
                            borderRadius: "12px",
                            background: "#1f2937",
                            color: "#fff",
                        }}
                    />
                                        </div>
                </div>

                <div
                    style={{
                        background:
                            "#111827",
                        borderRadius:
                            "20px",
                        overflow:
                            "hidden",
                    }}
                >
                    <table
                        style={{
                            width:
                                "100%",
                            borderCollapse:
                                "collapse",
                            color:
                                "#fff",
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    background:
                                        "#1f2937",
                                }}
                            >
                                <th
                                    style={
                                        th
                                    }
                                >
                                    Nama
                                </th>
                                <th
                                    style={
                                        th
                                    }
                                >
                                    Stok
                                </th>
                                <th
                                    style={
                                        th
                                    }
                                >
                                    Minimum
                                </th>
                                <th
                                    style={
                                        th
                                    }
                                >
                                    Status
                                </th>
                                <th
                                    style={
                                        th
                                    }
                                >
                                    Aksi
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        style={{
                                            textAlign: "center",
                                            padding: "50px",
                                            color: "#94a3b8",
                                        }}
                                    >
                                        Belum ada data bahan
                                    </td>
                                </tr>
                            )}
                            {filtered.map(
                                (
                                    item
                                ) => {
                                    const percent =
                                        item.minimum_stock > 0
                                            ? Math.min(
                                                100,
                                                (
                                                    item.qty /
                                                    item.minimum_stock
                                                ) * 100
                                            )
                                            : 100;

                                    let status =
                                        "Aman";

                                    if (
                                        item.qty <=
                                        0
                                    ) {
                                        status =
                                            "Habis";
                                    } else if (
                                        item.qty <
                                        item.minimum_stock
                                    ) {
                                        status =
                                            "Menipis";
                                    }

                                    return (
                                        <tr
                                            key={
                                                item.id
                                            }
                                        >
                                            <td
                                                style={
                                                    td
                                                }
                                            >
                                                {
                                                    item.name
                                                }
                                            </td>

                                            <td
                                                style={
                                                    td
                                                }
                                            >
                                                {
                                                    item.qty
                                                }{" "}
                                                {
                                                    item.unit
                                                }
                                            </td>

                                            <td
                                                style={
                                                    td
                                                }
                                            >
                                                {
                                                    item.minimum_stock
                                                }{" "}
                                                {
                                                    item.unit
                                                }
                                            </td>

                                            <td
                                                style={
                                                    td
                                                }
                                            >
                                                <div
                                                    style={{
                                                        width:
                                                            140,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            height: 8,
                                                            background:
                                                                "#0f172a",
                                                            borderRadius:
                                                                20,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: `${percent}%`,
                                                                height:
                                                                    "100%",
                                                                background:
                                                                    percent <
                                                                    50
                                                                        ? "#ef4444"
                                                                        : "#22c55e",
                                                                borderRadius:
                                                                    20,
                                                            }}
                                                        />
                                                    </div>

                                                    <div
                                                        style={{
                                                            marginTop: 8,
                                                            color:
                                                                status ===
                                                                "Aman"
                                                                    ? "#22c55e"
                                                                    : status ===
                                                                      "Menipis"
                                                                    ? "#f59e0b"
                                                                    : "#ef4444",
                                                            fontWeight:
                                                                "700",
                                                        }}
                                                    >
                                                        {
                                                            status
                                                        }
                                                    </div>
                                                </div>
                                            </td>

                                            <td
                                                style={
                                                    td
                                                }
                                            >
                                                <button
                                                    onClick={() =>
                                                        deleteStock(
                                                            item.id
                                                        )
                                                    }
                                                    style={{
                                                        border: "none",
                                                        background:
                                                            "#ef4444",
                                                        color:
                                                            "#fff",
                                                        padding:
                                                            "10px",
                                                        borderRadius:
                                                            "10px",
                                                        cursor:
                                                            "pointer",
                                                    }}
                                                >
                                                    <Trash2
                                                        size={
                                                            16
                                                        }
                                                    />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div
                    style={{
                        position:
                            "fixed",
                        inset: 0,
                        background:
                            "rgba(0,0,0,.6)",
                        display:
                            "flex",
                        justifyContent:
                            "center",
                        alignItems:
                            "center",
                        zIndex: 9999,
                    }}
                >
                    <div
    style={{
        width: 550,
        background: "#111827",
        borderRadius: 24,
        padding: 30,
        border: "1px solid rgba(255,255,255,.05)",
    }}
>
    <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
        }}
    >
        <div>
            <h2
                style={{
                    color: "#fff",
                    margin: 0,
                    fontSize: 26,
                    fontWeight: 800,
                }}
            >
                👨‍🍳 Tambah Bahan Dapur
            </h2>

            <p
                style={{
                    color: "#94a3b8",
                    marginTop: 8,
                    marginBottom: 0,
                    lineHeight: 1.6,
                }}
            >
                Tambah bahan baru untuk kebutuhan produksi
                dan pemantauan stok dapur.
            </p>
        </div>

        <X
            size={22}
            color="#94a3b8"
            style={{
                cursor: "pointer",
            }}
            onClick={() =>
                setShowModal(false)
            }
        />
    </div>

    <hr
        style={{
            border: "none",
            borderTop:
                "1px solid rgba(255,255,255,.08)",
            marginBottom: 25,
        }}
    />

    {/* Nama Bahan */}
    <div
        style={{
            marginBottom: 18,
        }}
    >
        <label
            style={{
                color: "#cbd5e1",
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
            }}
        >
            Nama Bahan
        </label>

        <input
            type="text"
            placeholder="Contoh : Beras Premium"
            value={form.name}
            onChange={(e) =>
                setForm({
                    ...form,
                    name: e.target.value,
                })
            }
            style={inputStyle}
        />
    </div>

    {/* Jumlah */}
    <div
        style={{
            marginBottom: 18,
        }}
    >
        <label
            style={{
                color: "#cbd5e1",
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
            }}
        >
            Jumlah Tersedia
        </label>

        <input
            type="number"
            placeholder="Masukkan jumlah stok"
            value={form.qty}
            onChange={(e) =>
                setForm({
                    ...form,
                    qty: e.target.value,
                })
            }
            style={inputStyle}
        />
    </div>

    {/* Satuan */}
    <div
        style={{
            marginBottom: 18,
        }}
    >
        <label
            style={{
                color: "#cbd5e1",
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
            }}
        >
            Satuan
        </label>

        <select
            value={form.unit}
            onChange={(e) =>
                setForm({
                    ...form,
                    unit: e.target.value,
                })
            }
            style={inputStyle}
        >
            <option value="">
                Pilih Satuan
            </option>
            <option value="Kg">
                Kilogram (Kg)
            </option>
            <option value="Gram">
                Gram
            </option>
            <option value="Liter">
                Liter
            </option>
            <option value="Ml">
                Mililiter
            </option>
            <option value="Pcs">
                Pcs
            </option>
            <option value="Pack">
                Pack
            </option>
            <option value="Box">
                Box
            </option>
        </select>
    </div>

    {/* Minimum */}
    <div
        style={{
            marginBottom: 20,
        }}
    >
        <label
            style={{
                color: "#cbd5e1",
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
            }}
        >
            Stok Minimum
        </label>

        <input
            type="number"
            placeholder="Batas minimum stok"
            value={form.minimum_stock}
            onChange={(e) =>
                setForm({
                    ...form,
                    minimum_stock:
                        e.target.value,
                })
            }
            style={inputStyle}
        />
    </div>

    {/* Alert */}
    <div
        style={{
            background:
                "rgba(245,158,11,.08)",
            border:
                "1px solid rgba(245,158,11,.25)",
            padding: 15,
            borderRadius: 14,
            marginBottom: 22,
            color: "#fbbf24",
            fontSize: 14,
            lineHeight: 1.6,
        }}
    >
        ⚠️ Sistem akan mengirim
        peringatan ketika stok berada
        di bawah batas minimum.
    </div>

    <button
        onClick={saveStock}
        style={{
            width: "100%",
            height: 54,
            border: "none",
            borderRadius: 14,
            background:
                "linear-gradient(135deg,#2563eb,#06b6d4)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
        }}
    >
        + Tambahkan ke Persediaan
    </button>
</div>

                </div>
            )}
        </>
    );
}

const th = {
    padding: "18px 20px",
    textAlign: "left",
    fontWeight: "700",
    color: "#cbd5e1",
    fontSize: "14px",
};

const td = {
    padding: "18px 20px",
    borderTop:
        "1px solid rgba(255,255,255,.05)",
    color: "#e2e8f0",
};
const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    background: "#1f2937",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: "12px",
    color: "#fff",
    outline: "none",
    boxSizing: "border-box",
};
function StatCard({
    title,
    value,
    icon,
    color,
}) {
    return (
        <div
            style={{
                background:
                    "linear-gradient(145deg,#111827,#1e293b)",
                borderRadius: 24,
                padding: 24,
                border:
                    "1px solid rgba(255,255,255,.05)",
                boxShadow:
                    "0 10px 25px rgba(0,0,0,.25)",
                transition: ".3s",
                color: "#fff",
            }}
        >
            <div
                style={{
                    width: 55,
                    height: 55,
                    borderRadius: 16,
                    background: `${color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color,
                    marginBottom: 16,
                }}
            >
                {icon}
            </div>

            <h2
                style={{
                    fontSize: 32,
                    fontWeight: 800,
                    marginBottom: 6,
                }}
            >
                {value || 0}
            </h2>

            <span
                style={{
                    color: "#94a3b8",
                }}
            >
                {title}
            </span>
        </div>
    );
}