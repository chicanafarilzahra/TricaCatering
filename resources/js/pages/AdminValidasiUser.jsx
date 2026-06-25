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

            setUsers(res.data);
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
            `/api/users/${id}/approve`
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
            `/api/users/${id}/reject`
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
            {/* HERO */}
            <div
    style={{
    width: "100%",
    borderRadius: "32px",
    padding: "36px",
    background:
        "linear-gradient(135deg,#0f172a 0%,#111827 45%,#1e293b 100%)",
    border:
        "1px solid rgba(255,255,255,0.06)",
    marginBottom: "28px",
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
}}
>   
                <div
                    style={{
                        position:
                            "absolute",
                        top: "-100px",
                        right: "-50px",
                        width:
                            "220px",
                        height:
                            "220px",
                        borderRadius:
                            "999px",
                        background:
                            "rgba(59,130,246,0.15)",
                        filter:
                            "blur(90px)",
                    }}
                />

                <div
    style={{
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
        gap: "18px",
        marginBottom: "28px",
    }}
>
    {[
        {
            title: "Owner",
            value: ownerCount,
            icon: <Store />,
        },
        {
            title: "Kurir",
            value: kurirCount,
            icon: <Truck />,
        },
        {
            title: "Operator SPPG",
            value: sppgCount,
            icon: (
                <ClipboardList />
            ),
        },
        {
            title: "Rejected",
            value: rejectedCount,
            icon: <UserX />,
        },
    ].map((item) => (
        <div
            key={item.title}
            style={{
                background:
                    "#111827",
                border:
                    "1px solid rgba(255,255,255,.06)",
                borderRadius:
                    "24px",
                padding: "24px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems:
                        "center",
                }}
            >
                <div>
                    <div
                        style={{
                            color:
                                "#94a3b8",
                            fontSize:
                                "14px",
                        }}
                    >
                        {item.title}
                    </div>

                    <h2
                        style={{
                            color:
                                "white",
                            margin:
                                "8px 0 0",
                        }}
                    >
                        {item.value}
                    </h2>
                </div>

                <div
                    style={{
                        color:
                            "#60a5fa",
                    }}
                >
                    {item.icon}
                </div>
            </div>
        </div>
    ))}
</div>

                <div
                    style={{
                        position:
                            "relative",
                        zIndex: 2,
                    }}
                >
                    <div
                        style={{
                            display:
                                "inline-flex",
                            alignItems:
                                "center",
                            gap: "8px",
                            padding:
                                "8px 16px",
                            borderRadius:
                                "999px",
                            background:
                                "rgba(59,130,246,0.12)",
                            color:
                                "#60a5fa",
                            marginBottom:
                                "18px",
                            fontSize:
                                "13px",
                            fontWeight:
                                "600",
                        }}
                    >
                        <ShieldCheck
                            size={16}
                        />
                        User Validation
                    </div>

                    <h1
                        style={{
                            margin: 0,
                            color:
                                "white",
                            fontSize:
                                "40px",
                            fontWeight:
                                "800",
                        }}
                    >
                        Validasi User
                    </h1>

                    <p
                        style={{
                            color:
                                "#94a3b8",
                            marginTop:
                                "12px",
                            lineHeight:
                                "28px",
                        }}
                    >
                        Kelola pendaftaran
                        Owner, Kurir, dan
                        Operator SPPG yang
                        menunggu persetujuan
                        admin.
                    </p>
                </div>
            </div>

            {/* CARD */}
<div
    style={{
    width: "100%",
    boxSizing: "border-box",
    background:
        "linear-gradient(180deg,#111827 0%,#0f172a 100%)",
    border:
        "1px solid rgba(255,255,255,0.06)",
    borderRadius: "30px",
    padding: "28px",
}}
>
                <div
                    style={{
                        display: "flex",
                        alignItems:
                            "center",
                        gap: "12px",
                        marginBottom:
                            "24px",
                    }}
                >
                    <div
                        style={{
                            width: "52px",
                            height: "52px",
                            borderRadius:
                                "16px",
                            background:
                                "rgba(59,130,246,0.12)",
                            display:
                                "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
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
                            Total{" "}
                            {filteredUsers.length}
                            {" "}
                            user
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
                            overflowX:
                                "auto",
                        }}
                    >
                        <table
                            style={{
                                width:
                                    "100%",
                                borderCollapse:
                                    "collapse",
                            }}
                        >
                            <thead>
                                <tr>
                                    {[
                                        "Nama",
                                        "Email",
                                        "Role",
                                        "Nama Tempat",
                                        "Alamat",
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
                                                    color:
                                                        "#94a3b8",
                                                    textAlign:
                                                        "left",
                                                    padding:
                                                        "16px",
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
                                                    padding:
                                                        "16px",
                                                    color:
                                                        "white",
                                                }}
                                            >
                                                {
                                                    user.name
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "16px",
                                                    color:
                                                        "#cbd5e1",
                                                }}
                                            >
                                                {
                                                    user.email
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "16px",
                                                    color:
                                                        "#cbd5e1",
                                                }}
                                            >
                                                {
                                                    user.role
                                                }
                                            </td>

                                            <td
    style={{
        padding:"16px",
        color:"#cbd5e1",
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
        padding:"16px",
        color:"#cbd5e1",
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
                                                    padding:
                                                        "16px",
                                                }}
                                            >
                                                {user.status === "pending" ? (

    <div
        style={{
            display: "flex",
            gap: "10px",
        }}
    >
        <button
            onClick={() =>
                approveUser(user.id)
            }
            style={{
                border: "none",
                background: "#22c55e",
                color: "white",
                padding: "10px 14px",
                borderRadius: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
            }}
        >
            <CheckCircle size={16} />
            Approve
        </button>

        <button
            onClick={() =>
                rejectUser(user.id)
            }
            style={{
                border: "none",
                background: "#ef4444",
                color: "white",
                padding: "10px 14px",
                borderRadius: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
            }}
        >
            <XCircle size={16} />
            Reject
        </button>
    </div>

) : (

    <button
        onClick={() =>
            deleteUser(user.id)
        }
        style={{
            border: "none",
            background: "#ef4444",
            color: "white",
            padding: "10px 14px",
            borderRadius: "12px",
            cursor: "pointer",
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
        </AdminLayout>
    );
}