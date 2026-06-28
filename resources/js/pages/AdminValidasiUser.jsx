import React, {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import {
    ShieldCheck,
    CheckCircle,
    XCircle,
    Users,
    Search,
    Store,
    Truck,
    ClipboardList,
    UserX,
} from "lucide-react";

import AdminLayout from "../layouts/AdminLayout";

const VALIDATABLE_ROLES = ["owner", "kurir", "operator_sppg"];

export default function AdminValidasiUser() {
    const [users, setUsers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
    useState("");

    const [roleFilter, setRoleFilter] =
        useState("all");

    const [statusFilter, setStatusFilter] =
        useState("all");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res =
                await axios.get(
                    "/users"
                );

            // Hanya tampilkan role yang memang butuh validasi admin.
            // Admin & klien tidak pernah masuk daftar ini.
            const relevantUsers = res.data.filter((u) =>
                VALIDATABLE_ROLES.includes(u.role)
            );

            setUsers(relevantUsers);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const approveUser = async (id) => {

    const confirmApprove =
        window.confirm(
            "Apakah Anda yakin ingin menyetujui akun ini?\n\nEmail konfirmasi akan dikirim ke pengguna."
        );

    if (!confirmApprove) return;

    try {

        await axios.put(
            `/users/${id}/approve`
        );

        alert(
            "Akun berhasil disetujui.\n\nEmail konfirmasi telah dikirim kepada pengguna."
        );

        fetchUsers();

    } catch (err) {

        console.log(err);

        alert(
            "Gagal menyetujui akun."
        );
    }
};

    const rejectUser = async (id) => {

    const confirmReject =
        window.confirm(
            "Apakah Anda yakin ingin menolak pendaftaran ini?"
        );  

    if (!confirmReject) return;

    try {

        await axios.put(
            `/users/${id}/reject`
        );

        alert(
            "Pendaftaran berhasil ditolak.\n\nEmail pemberitahuan telah dikirim kepada pengguna."
        );

        fetchUsers();

    } catch (err) {

        console.log(err);

        alert(
            "Gagal menolak pendaftaran."
        );
    }
};

    const deleteUser = async (id) => {

        const confirmDelete =
            window.confirm(
                "Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan."
            );

        if (!confirmDelete) return;

        try {

            await axios.delete(
                `/users/${id}`
            );

            alert("User berhasil dihapus.");

            fetchUsers();

        } catch (err) {

            console.log(err);

            alert("Gagal menghapus user.");
        }
    };

const ownerCount = users.filter(
    (u) => u.role === "owner"
).length;

const kurirCount = users.filter(
    (u) => u.role === "kurir"
).length;

const sppgCount = users.filter(
    (u) =>
        u.role ===
        "operator_sppg"
).length;

const rejectedCount =
    users.filter(
        (u) =>
            u.status ===
            "rejected"
    ).length;

const filteredUsers =
    users.filter((user) => {

        const matchSearch =
            user.name
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                ) ||
            user.email
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                );

        const matchRole =
            roleFilter ===
                "all" ||
            user.role ===
                roleFilter;

        const matchStatus =
            statusFilter ===
                "all" ||
            user.status ===
                statusFilter;

        return (
            matchSearch &&
            matchRole &&
            matchStatus
        );
    });

    return (
        <AdminLayout>
            <style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.validasi-root *{
    font-family:'Inter',sans-serif;
}
`}</style>
            <div className="validasi-root">
    <div
        style={{
            fontFamily: "Inter, sans-serif",
        }}
    >

           {/* HERO */}
<div
    style={{
        position: "relative",
        borderRadius: "24px",
        padding: "40px",
        background:
            "linear-gradient(135deg,#0d1117 0%,#0f172a 60%,#131c2e 100%)",
        border:
            "1px solid rgba(255,255,255,.07)",
        overflow: "hidden",
        marginBottom: "24px",
    }}
>
    {/* Grid Texture */}
    <div
        style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
                "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
        }}
    />

    {/* Glow */}
    <div
        style={{
            position: "absolute",
            top: "-80px",
            right: "60px",
            width: "300px",
            height: "300px",
            borderRadius: "999px",
            background:
                "rgba(59,130,246,0.12)",
            filter: "blur(90px)",
            pointerEvents: "none",
        }}
    />

    <div
        style={{
            position: "absolute",
            bottom: "-60px",
            right: "-40px",
            width: "200px",
            height: "200px",
            borderRadius: "999px",
            background:
                "rgba(139,92,246,0.1)",
            filter: "blur(70px)",
            pointerEvents: "none",
        }}
    />

    <div
        style={{
            position: "relative",
            zIndex: 2,
        }}
    >
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "999px",
                background:
                    "rgba(59,130,246,0.1)",
                border:
                    "1px solid rgba(59,130,246,0.22)",
                color: "#60a5fa",
                fontSize: "12px",
                fontWeight: "600",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                marginBottom: "22px",
            }}
        >
            <ShieldCheck size={14} />
            User Validation
        </div>

        <h1
            style={{
                margin: 0,
                fontSize:
                    "clamp(28px,3.5vw,44px)",
                lineHeight: 1.15,
                color: "white",
                fontWeight: "800",
                letterSpacing: "-1.5px",
                maxWidth: "650px",
            }}
        >
            Kelola proses
            <br />
            <span
                style={{
                    background:
                        "linear-gradient(90deg,#60a5fa,#a78bfa)",
                    WebkitBackgroundClip:
                        "text",
                    WebkitTextFillColor:
                        "transparent",
                }}
            >
                validasi pengguna
            </span>
        </h1>

        <p
            style={{
                margin: "16px 0 0",
                color: "#64748b",
                fontSize: "15px",
                lineHeight: "1.8",
                maxWidth: "580px",
            }}
        >
            Kelola pendaftaran Owner,
            Kurir, dan Operator SPPG
            yang menunggu persetujuan
            admin secara cepat dan
            terpusat.
        </p>
    </div>
</div>

{/* STATS GRID */}
<div
    style={{
        display: "grid",
        gridTemplateColumns:
            "repeat(4, minmax(0,1fr))",
        gap: "16px",
        marginBottom: "24px",
    }}
></div>

            {/* CARD */}
<div
    style={{
        width: "100%",
        boxSizing: "border-box",
        background:
            "linear-gradient(160deg,#0f172a 0%,#0d1117 100%)",
        border:
            "1px solid rgba(255,255,255,0.07)",
        borderRadius: "20px",
        padding: "28px",
        position: "relative",
        overflowX: "auto",
        overflowY: "hidden",
    }}
>
    <div
    style={{
        position: "absolute",
        top: "-40px",
        right: "-40px",
        width: "140px",
        height: "140px",
        borderRadius: "999px",
        background:
            "rgba(59,130,246,0.08)",
        filter: "blur(40px)",
        pointerEvents: "none",
    }}
/>
    <div
        style={{
            position: "absolute",
            top: 0,
            left: "24px",
            right: "24px",
            height: "2px",
            background:
                "linear-gradient(90deg,#3b82f6,transparent)",
        }}
    />
                <div
        style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
        }}
    >
                    <div
            style={{
                width: "52px",
                height: "52px",
                borderRadius: "16px",
                background:
                    "rgba(59,130,246,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
                        <Users
                            color="#60a5fa"
                            size={22}
                        />
                    </div>

                    <div>
                        <h2
                            style={{
                                margin: 0,
                                color:
                                    "white",
                            }}
                        >
                            Daftar User
                        </h2>

                        <p
                            style={{
                                margin:
                                    "4px 0 0",
                                color:
                                    "#94a3b8",
                            }}
                        >
                            Total {filteredUsers.length} user
                
                        </p>
                    </div>
                </div>

                <div
    style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "24px",
        flexWrap: "wrap",
    }}
>
    <div
        style={{
            flex: 1,
            minWidth: "350px",
            position: "relative",
        }}
    >
        <Search
            size={18}
            style={{
                position: "absolute",
                left: "14px",
                top: "14px",
                color: "#64748b",
            }}
        />

        <input
            type="text"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) =>
                setSearch(e.target.value)
            }
            style={{
                width: "100%",
                height: "48px",
                paddingLeft: "42px",
                borderRadius: "12px",
                border:
                    "1px solid rgba(255,255,255,.08)",
                background: "#0f172a",
                color: "white",
                boxSizing: "border-box",
            }}
        />
    </div>

    <select
        value={roleFilter}
        onChange={(e) =>
            setRoleFilter(e.target.value)
        }
        style={{
            width: "160px",
            height: "48px",
            borderRadius: "12px",
            background: "#0f172a",
            color: "white",
            border:
                "1px solid rgba(255,255,255,.08)",
            padding: "0 14px",
        }}
    >
        <option value="all">
            Semua Role
        </option>
        <option value="owner">
            Owner
        </option>
        <option value="kurir">
            Kurir
        </option>
        <option value="operator_sppg">
            Operator SPPG
        </option>
    </select>

    <select
        value={statusFilter}
        onChange={(e) =>
            setStatusFilter(e.target.value)
        }
        style={{
            width: "160px",
            height: "48px",
            borderRadius: "12px",
            background: "#0f172a",
            color: "white",
            border:
                "1px solid rgba(255,255,255,.08)",
            padding: "0 14px",
        }}
    >
        <option value="all">
            Semua Status
        </option>
        <option value="pending">
            Pending
        </option>
        <option value="approved">
            Approved
        </option>
        <option value="rejected">
            Rejected
        </option>
    </select>
</div>
                {loading ? (
                    <div
                        style={{
                            color:
                                "#94a3b8",
                        }}
                    >
                        Loading...
                    </div>
                ) : (
                   <div
    style={{
        overflowX: "auto",
        overflowY: "hidden",
        borderRadius: "16px",
        border:
            "1px solid rgba(255,255,255,0.06)",
    }}
>
    <table
    style={{
        width: "100%",
        borderCollapse: "collapse",
        tableLayout: "fixed",
    }}
>
                            <thead
    style={{
        background: "rgba(255,255,255,0.03)",
    }}
>
    <tr>
        {[
            "Nama",
            "Email",
            "Role",
            "Nama Tempat",
            "Alamat",
            "Status",
            "Aksi",
        ].map((item, index, arr) => (
            <th
                key={item}
                style={{
                    color: "#94a3b8",
                    textAlign: "left",
                    padding: "14px 16px",
                    fontSize: "14px",
                    fontWeight: "600",
                    borderBottom:
                        "1px solid rgba(255,255,255,0.06)",

                    borderTopLeftRadius:
                        index === 0 ? "12px" : "0",

                    borderTopRightRadius:
                        index === arr.length - 1
                            ? "12px"
                            : "0",
                }}
            >
                {item}
            </th>
        ))}
    </tr>
</thead>

                            <tbody>
                                {filteredUsers.map(
                                    (
                                        user
                                    ) => (
                                        <tr
                                            key={
                                                user.id
                                            }
                                        >
                                            <td
    style={{
        padding:"14px 16px",
        color:"#cbd5e1",
        fontSize:"13px",
        maxWidth:"140px",
        overflow:"hidden",
        textOverflow:"ellipsis",
        whiteSpace:"nowrap",
    }}
>
    <div
        style={{
            display:"flex",
            alignItems:"center",
            gap:"12px",
        }}
    >
        <div
            style={{
                width:"38px",
                height:"38px",
                borderRadius:"12px",
                background:
                "rgba(59,130,246,.15)",
                color:"#60a5fa",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                fontWeight:"700",
                flexShrink: 0,
            }}
        >
            {user.name.charAt(0).toUpperCase()}
        </div>

        <div style={{ minWidth: 0 }}>
            <div
                style={{
                    color:"white",
                    fontWeight:"600",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {user.name}
            </div>

            <div
                style={{
                    color:"#64748b",
                    fontSize:"12px",
                }}
            >
                ID #{user.id}
            </div>
        </div>
    </div>
</td>

                                            <td
    style={{
        padding:"14px 16px",
        color:"#cbd5e1",
        fontSize:"13px",
        maxWidth:"220px",
        overflow:"hidden",
        textOverflow:"ellipsis",
        whiteSpace:"nowrap",
    }}
>
                                                {
                                                    user.email
                                                }
                                            </td>

                                            <td style={{ 
                                                padding:"18px 16px",
                                                fontSize: "14px",
                                                }}>
    <span
        style={{
            padding:"6px 12px",
            borderRadius:"999px",
            background:
            "rgba(59,130,246,.15)",
            color:"#60a5fa",
            fontSize:"12px",
            fontWeight:"600",
        }}
    >
        {user.role}
    </span>
</td>

                                            <td
    style={{
        padding:"18px 16px",
        color:"#cbd5e1",
        fontSize: "14px",
    }}
>
{
user.role==="owner"
? user.nama_catering
: user.role==="kurir"
? user.nama_tempat_kurir
: user.role==="operator_sppg"
? user.nama_sppg
: "-"
}
</td>

<td
    style={{
        padding: "14px 16px",
        color: "#cbd5e1",
        fontSize: "13px",
        fontWeight: "400",
        maxWidth: "180px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        lineHeight: "1.4",
    }}
>
    
{
user.role==="owner"
? user.alamat_catering
: user.role==="kurir"
? user.alamat_tempat_kurir
: user.role==="operator_sppg"
? user.alamat_sppg
: "-"
}
</td>

                                            <td
                                                style={{
                                                    padding:"18px 16px",
                                                    fontSize: "14px",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        padding:
                                                            "6px 12px",
                                                        borderRadius:
                                                            "999px",
                                                        fontSize:
                                                            "12px",
                                                        fontWeight:
                                                            "600",
                                                        background:
                                                            user.status ===
                                                            "approved"
                                                                ? "rgba(34,197,94,0.15)"
                                                                : user.status ===
                                                                  "rejected"
                                                                ? "rgba(239,68,68,0.15)"
                                                                : "rgba(245,158,11,0.15)",
                                                        color:
                                                            user.status ===
                                                            "approved"
                                                                ? "#22c55e"
                                                                : user.status ===
                                                                  "rejected"
                                                                ? "#ef4444"
                                                                : "#f59e0b",
                                                    }}
                                                >
                                                    {
                                                        user.status
                                                    }
                                                </span>
                                            </td>

                                            <td
    style={{
        padding: "18px 16px",
        fontSize: "14px",
        minWidth: "90px",
    }}
>
                                                {user.status === "pending" ? (

    <div
    style={{
        display: "flex",
        gap: "8px",
    }}
>
    <button
        title="Approve"
        onClick={() => approveUser(user.id)}
        style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            border: "1px solid rgba(34,197,94,.2)",
            background: "rgba(34,197,94,.12)",
            color: "#4ade80",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}
    >
        <CheckCircle size={16} />
    </button>

    <button
        title="Reject"
        onClick={() => rejectUser(user.id)}
        style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            border: "1px solid rgba(239,68,68,.2)",
            background: "rgba(239,68,68,.12)",
            color: "#f87171",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}
    >
        <XCircle size={16} />
    </button>
</div>

) : (

    <button
    onClick={() =>
        deleteUser(user.id)
    }
    style={{
        border:
            "1px solid rgba(239,68,68,.25)",
        background:
            "rgba(239,68,68,.12)",
        color: "#f87171",
        padding: "8px 12px",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "600",
    }}
>
    Hapus
</button>
)}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            </div>
            </div>
        </AdminLayout>
    );
}