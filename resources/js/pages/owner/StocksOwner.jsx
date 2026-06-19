// resources/js/pages/owner/StocksOwner.jsx

import { useEffect, useState } from "react";
import axios from "axios";

import {
    Boxes,
    AlertTriangle,
    TrendingDown,
    PackageCheck,
} from "lucide-react";

import OwnerLayout from "../../layouts/OwnerLayout";

function MetricCard({
    title,
    value = 0,
    icon,
    color = "#60a5fa",
}) {
    return (
        <div
            style={{
                background:
                    "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))",
                border:
                    "1px solid rgba(148,163,184,0.08)",
                borderRadius: "20px",
                padding: "20px 22px",
                display: "flex",
                justifyContent:
                    "space-between",
                alignItems: "center",
                boxShadow:
                    "0 12px 32px rgba(0,0,0,0.28)",
            }}
        >
            <div>
                <div
                    style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        fontWeight: "600",
                        textTransform:
                            "uppercase",
                        letterSpacing:
                            "0.6px",
                        marginBottom: "8px",
                    }}
                >
                    {title}
                </div>

                <div
                    style={{
                        fontSize: "30px",
                        fontWeight: "800",
                        color: "white",
                        lineHeight: 1,
                    }}
                >
                    {value}
                </div>
            </div>

            <div
                style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "16px",
                    background:
                        "rgba(59,130,246,0.10)",
                    border:
                        "1px solid rgba(59,130,246,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "center",
                    color,
                }}
            >
                {icon}
            </div>
        </div>
    );
}

function EmptyState({
    title,
    subtitle,
    icon,
}) {
    return (
        <div
            style={{
                minHeight: "300px",
                display: "flex",
                flexDirection: "column",
                justifyContent:
                    "center",
                alignItems: "center",
                textAlign: "center",
                padding: "20px",
            }}
        >
            <div
                style={{
                    width: "84px",
                    height: "84px",
                    borderRadius: "24px",
                    background:
                        "rgba(59,130,246,0.10)",
                    border:
                        "1px solid rgba(59,130,246,0.15)",
                    display: "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "center",
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
                    color: "white",
                }}
            >
                {title}
            </h3>

            <p
                style={{
                    margin:
                        "12px 0 0",
                    maxWidth: "520px",
                    color: "#94a3b8",
                    fontSize: "15px",
                    lineHeight: "1.8",
                }}
            >
                {subtitle}
            </p>
        </div>
    );
}

export default function StocksOwner(){

    const [stocks,setStocks]=useState([]);

    const [showModal,setShowModal]=useState(false);

    const [editId, setEditId] = useState(null);

    const [form,setForm]=useState({
        name:"",
        qty:"",
        unit:"",
        minimum_stock:"",
    });

    useEffect(()=>{
        fetchStocks();
    },[]);

    const fetchStocks = async () => {
    try {
        const token =
            localStorage.getItem("token");

        const res = await axios.get(
            "/api/owner/stocks",
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

        setStocks(res.data);
    } catch (err) {
        console.log(err);
    }
};  

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const token =
            localStorage.getItem("token");

        if (editId) {

            await axios.put(
                `/api/owner/stocks/${editId}`,
                form,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

        } else {

            await axios.post(
                "/api/owner/stocks",
                form,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );
        }

        setEditId(null);
        setShowModal(false);

        setForm({
            name: "",
            qty: "",
            unit: "",
            minimum_stock: "",
        });

        fetchStocks();

    } catch (err) {
    console.log(
        JSON.stringify(
            err.response?.data,
            null,
            2
        )
    );
}
};

const handleEdit = (item) => {
    setForm({
        name: item.name,
        qty: item.qty,
        unit: item.unit,
        minimum_stock: item.minimum_stock,
    });

    setEditId(item.id);
    setShowModal(true);
};

const handleDelete = async (id) => {

    if (!window.confirm("Yakin ingin menghapus bahan ini?"))
        return;

    try {

        const token =
    localStorage.getItem("token");

await axios.delete(
    `/api/owner/stocks/${id}`,
    {
        headers: {
            Authorization:
                `Bearer ${token}`,
        },
    }
);

        fetchStocks();

    } catch (err) {
        console.log(err);
    }
};

    return (
        <OwnerLayout>
            {/* Header */}
<div
    style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        flexWrap: "wrap",
        gap: "20px",
    }}
>
    <div>
        <h1
            style={{
                margin: 0,
                fontSize: "34px",
                fontWeight: "800",
                color: "white",
            }}
        >
            Stock Bahan Baku
        </h1>

        <p
            style={{
                margin: "10px 0 0",
                color: "#94a3b8",
                fontSize: "14px",
            }}
        >
            Kelola persediaan bahan baku untuk kebutuhan produksi catering.
        </p>
    </div>

    <button
        onClick={() => setShowModal(true)}
        style={{
            background:
                "linear-gradient(135deg,#2563eb,#1d4ed8)",
            color: "white",
            border: "none",
            padding: "12px 18px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "700",
        }}
    >
        + Tambah Bahan
    </button>
</div>

            {/* Metrics */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "20px",
                    marginBottom:
                        "24px",
                }}
            >
                <MetricCard
    title="Total Bahan"
    value={stocks.length}
    icon={<Boxes size={22} />}
    color="#10b981"
/>

<MetricCard
    title="Stok Menipis"
    value={
        stocks.filter(
            item =>
                Number(item.qty) <=
                Number(item.minimum_stock)
        ).length
    }
    icon={<AlertTriangle size={22} />}
    color="#f59e0b"
/>

<MetricCard
    title="Habis"
    value={
        stocks.filter(
            item =>
                Number(item.qty) == 0
        ).length
    }
    icon={<TrendingDown size={22} />}
    color="#ef4444"
/>

<MetricCard
    title="Tersedia"
    value={
        stocks.filter(
            item =>
                Number(item.qty) > 0
        ).length
    }
    icon={<PackageCheck size={22} />}
    color="#22c55e"
/>
            </div>

            {/* Inventory Table */}
            <div
                style={{
                    background:
                        "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))",
                    border:
                        "1px solid rgba(148,163,184,0.08)",
                    borderRadius:
                        "24px",
                    padding: "28px",
                    marginBottom:
                        "24px",
                    boxShadow:
                        "0 16px 40px rgba(0,0,0,0.30)",
                    overflowX: "auto",
                }}
            >
                <div
                    style={{
                        marginBottom:
                            "22px",
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            fontSize:
                                "22px",
                            fontWeight:
                                "700",
                            color:
                                "white",
                        }}
                    >
                        Inventory Overview
                    </h2>

                    <p
                        style={{
                            margin:
                                "6px 0 0",
                            color:
                                "#94a3b8",
                            fontSize:
                                "14px",
                        }}
                    >
                        Current stock
                        levels and item
                        availability.
                    </p>
                </div>

                {stocks.length ===
                0 ? (
                    <EmptyState
                        title="No Stock Data"
                        subtitle="Inventory information will appear here once stock data has been recorded."
                        icon={
                            <Boxes
                                size={38}
                            />
                        }
                    />
                ) : (
                    <table
                        style={{
                            width: "100%",
                            borderCollapse:
                                "collapse",
                            minWidth:
                                "900px",
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    background:
                                        "rgba(255,255,255,0.04)",
                                }}
                            >
                                {[
                                    "Nama Bahan",
                                    "Jumlah",
                                    "Satuan",
                                    "Minimum",
                                    "Status",
                                    "Aksi",
                                ].map(
                                    (
                                        item
                                    ) => (
                                        <th
                                            key={
                                                item
                                            }
                                            style={{
                                                padding:
                                                    "16px",
                                                textAlign:
                                                    "left",
                                                color:
                                                    "#cbd5e1",
                                                fontSize:
                                                    "13px",
                                                fontWeight:
                                                    "600",
                                                borderBottom:
                                                    "1px solid rgba(255,255,255,0.06)",
                                            }}
                                        >
                                            {
                                                item
                                            }
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {stocks.map(
                                (
                                    item
                                ) => {
                                    const stock = Number(item.qty);

                                    const min =
                                        Number(
                                            item.minimum_stock ||
                                                5
                                        );

                                    let status =
                                        "Available";

                                    let color =
                                        "#22c55e";

                                    if(stock==0){
                                        status="Habis";
                                        color="#ef4444";
                                        }
                                        else if(stock<=min){
                                        status="Menipis";
                                        color="#f59e0b";
                                        }
                                        else{
                                        status="Tersedia";
                                        color="#22c55e";
                                    }

                                    return (
                                        <tr
                                            key={
                                                item.id
                                            }
                                            style={{
                                                borderBottom:
                                                    "1px solid rgba(255,255,255,0.05)",
                                            }}
                                        >
                                            <td
style={{
padding:"16px",
color:"white"
}}
>
{item.name}
</td>

<td
style={{
padding:"16px",
color:"white",
fontWeight:"700"
}}
>
{item.qty}
</td>

<td
style={{
padding:"16px",
color:"#cbd5e1"
}}
>
{item.unit}
</td>

<td
style={{
padding:"16px",
color:"#cbd5e1"
}}
>
{min}
</td>

                                            <td
                                                style={{
                                                    padding:
                                                        "16px",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        padding:
                                                            "6px 12px",
                                                        borderRadius:
                                                            "999px",
                                                        background: `${color}20`,
                                                        border: `1px solid ${color}40`,
                                                        color,
                                                        fontSize:
                                                            "12px",
                                                        fontWeight:
                                                            "700",
                                                    }}
                                                >
                                                    {
                                                        status
                                                    }
                                                </span>
                                            </td>

                                            <td
    style={{
        padding: "16px",
    }}
>
    <div
        style={{
            display: "flex",
            gap: "10px",
        }}
    >
        <button
            onClick={() => handleEdit(item)}
            style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "8px",
                cursor: "pointer",
            }}
        >
            Edit
        </button>

        <button
            onClick={() => handleDelete(item.id)}
            style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "8px",
                cursor: "pointer",
            }}
        >
            Hapus
        </button>
    </div>
</td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Insights */}
            <div
                style={{
                    background:
                        "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))",
                    border:
                        "1px solid rgba(148,163,184,0.08)",
                    borderRadius:
                        "24px",
                    padding: "28px",
                    boxShadow:
                        "0 16px 40px rgba(0,0,0,0.30)",
                }}
            >
                <div
                    style={{
                        marginBottom:
                            "22px",
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            fontSize:
                                "22px",
                            fontWeight:
                                "700",
                            color:
                                "white",
                        }}
                    >
                        Stock Insights
                    </h2>

                    <p
                        style={{
                            margin:
                                "6px 0 0",
                            color:
                                "#94a3b8",
                            fontSize:
                                "14px",
                        }}
                    >
                        Critical inventory
                        alerts and stock
                        analytics.
                    </p>
                </div>

                {stocks.length ===
                0 ? (
                    <EmptyState
                        title="No Insights Available"
                        subtitle="Stock analytics and inventory alerts will appear here."
                        icon={
                            <AlertTriangle
                                size={38}
                            />
                        }
                    />
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexDirection:
                                "column",
                            gap: "14px",
                        }}
                    >
                        {stocks
                            .filter(
                                (
                                    item
                                ) =>
                                    Number(
                                        item.qty
                                    ) <=
                                    Number(
                                        item.minimum_stock ||
                                            5
                                    )
                            )
                            .map(
                                (
                                    item
                                ) => (
                                    <div
                                        key={
                                            item.id
                                        }
                                        style={{
                                            padding:
                                                "16px",
                                            borderRadius:
                                                "16px",
                                            background:
                                                "rgba(239,68,68,0.08)",
                                            border:
                                                "1px solid rgba(239,68,68,0.20)",
                                            color:
                                                "white",
                                        }}
                                    >
                                        <strong>{item.name}</strong>

{" "}
tersisa

<b>{item.qty} {item.unit}</b>

dan sudah mencapai batas minimum. (
{item.qty} {item.unit}
)
                                    </div>
                                )
                            )}
                    </div>
                )}
            </div>
            {showModal && (
<div
    style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    }}
>
    <div
        style={{
            width: "450px",
            background: "#111827",
            borderRadius: "20px",
            padding: "25px",
        }}
    >
        <h2
            style={{
                color: "white",
                marginBottom: "20px",
            }}
        >
            Tambah Bahan Baku
        </h2>

        <form onSubmit={handleSubmit}>

            <input
                placeholder="Nama Bahan"
                value={form.name}
                onChange={(e)=>
                    setForm({
                        ...form,
                        name:e.target.value
                    })
                }
                style={inputStyle}
            />

            <input
                type="number"
                placeholder="Jumlah Stock"
                value={form.qty}
                onChange={(e)=>
                    setForm({
                        ...form,
                        qty:e.target.value
                    })
                }
                style={inputStyle}
            />

            <input
                placeholder="Satuan (kg, pcs, liter)"
                value={form.unit}
                onChange={(e)=>
                    setForm({
                        ...form,
                        unit:e.target.value
                    })
                }
                style={inputStyle}
            />

            <input
                type="number"
                placeholder="Minimum Stock"
                value={form.minimum_stock}
                onChange={(e)=>
                    setForm({
                        ...form,
                        minimum_stock:e.target.value
                    })
                }
                style={inputStyle}
            />

            <div
                style={{
                    display:"flex",
                    justifyContent:"flex-end",
                    gap:"10px",
                    marginTop:"20px",
                }}
            >
                <button
                    type="button"
                    onClick={()=>setShowModal(false)}
                    style={{
                        padding:"10px 18px",
                        borderRadius:"10px",
                        border:"none",
                        cursor:"pointer",
                    }}
                >
                    Batal
                </button>

                <button
                    type="submit"
                    style={{
                        padding:"10px 18px",
                        borderRadius:"10px",
                        border:"none",
                        background:"#2563eb",
                        color:"white",
                        fontWeight:"700",
                        cursor:"pointer",
                    }}
                >
                    Simpan
                </button>
            </div>

        </form>
    </div>
</div>
)}
        </OwnerLayout>
    );
}
const inputStyle = {
    width: "100%",
    height: "46px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    padding: "0 14px",
    marginBottom: "14px",
    outline: "none",
    boxSizing: "border-box",
};