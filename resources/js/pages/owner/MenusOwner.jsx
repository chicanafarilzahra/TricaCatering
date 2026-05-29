// resources/js/pages/owner/MenusOwner.jsx

import { useEffect, useState } from "react";
import axios from "axios";

import {
    UtensilsCrossed,
    Plus,
    Pencil,
    Trash2,
    Search,
    Image as ImageIcon,
    X,
    Package,
    Layers3,
    MoreVertical,
} from "lucide-react";

import OwnerLayout from "../../layouts/OwnerLayout";

export default function MenusOwner() {
    const [menus, setMenus] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [showModal, setShowModal] =
        useState(false);

    const [editingId, setEditingId] =
        useState(null);

    const [form, setForm] = useState({
        name: "",
        price: "",
        category: "",
        stock: "",
        description: "",
        image: null,
    });

    /* =========================
       FETCH MENUS
    ========================= */

    const fetchMenus = async () => {
        try {
            const res =
                await axios.get(
                    "/api/owner/menus"
                );

            setMenus(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    /* =========================
       OPEN CREATE
    ========================= */

    const openCreateModal = () => {
        setEditingId(null);

        setForm({
            name: "",
            price: "",
            category: "",
            stock: "",
            description: "",
            image: null,
        });

        setShowModal(true);
    };

    /* =========================
       OPEN EDIT
    ========================= */

    const openEditModal = (
        menu
    ) => {
        setEditingId(menu.id);

        setForm({
            name: menu.name || "",
            price: menu.price || "",
            category:
                menu.category || "",
            stock: menu.stock || "",
            description:
                menu.description || "",
            image: null,
        });

        setShowModal(true);
    };

    /* =========================
       SUBMIT
    ========================= */

    const handleSubmit = async (
        e
    ) => {
        e.preventDefault();

        try {
            const data =
                new FormData();

            data.append(
                "name",
                form.name
            );

            data.append(
                "price",
                form.price
            );

            data.append(
                "category",
                form.category
            );

            data.append(
                "stock",
                form.stock
            );

            data.append(
                "description",
                form.description
            );

            if (form.image) {
                data.append(
                    "image",
                    form.image
                );
            }

            if (editingId) {
                data.append(
                    "_method",
                    "PUT"
                );

                await axios.post(
                    `/api/owner/menus/${editingId}`,
                    data,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data",
                        },
                    }
                );
            } else {
                await axios.post(
                    "/api/owner/menus",
                    data,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data",
                        },
                    }
                );
            }

            setShowModal(false);

            setForm({
                name: "",
                price: "",
                category: "",
                stock: "",
                description: "",
                image: null,
            });

            fetchMenus();
        } catch (err) {
            console.log(err);
        }
    };

    /* =========================
       DELETE
    ========================= */

    const handleDelete = async (
        id
    ) => {
        const confirmDelete =
            window.confirm(
                "Delete this menu?"
            );

        if (!confirmDelete)
            return;

        try {
            await axios.delete(
                `/api/owner/menus/${id}`
            );

            fetchMenus();
        } catch (err) {
            console.log(err);
        }
    };

    /* =========================
       FILTER
    ========================= */

    const filteredMenus =
        menus.filter((menu) =>
            menu.name
                ?.toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        );

    return (
        <OwnerLayout>
            {/* HEADER */}
            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems:
                        "center",
                    flexWrap: "wrap",
                    gap: "14px",
                    marginBottom:
                        "22px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems:
                            "center",
                        gap: "14px",
                    }}
                >
                    <div
                        style={{
                            width: "58px",
                            height: "58px",
                            borderRadius:
                                "18px",
                            background:
                                "linear-gradient(135deg,#1d4ed8,#0f172a)",
                            border:
                                "1px solid rgba(59,130,246,0.30)",
                            display:
                                "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            boxShadow:
                                "0 12px 24px rgba(37,99,235,0.20)",
                        }}
                    >
                        <UtensilsCrossed
                            size={28}
                            color="white"
                        />
                    </div>

                    <div>
                        <h1
                            style={{
                                margin: 0,
                                fontSize:
                                    "30px",
                                fontWeight:
                                    "900",
                                color:
                                    "white",
                                lineHeight:
                                    "1",
                            }}
                        >
                            Menu
                            Management
                        </h1>

                        <p
                            style={{
                                margin:
                                    "8px 0 0",
                                color:
                                    "#94a3b8",
                                fontSize:
                                    "13px",
                            }}
                        >
                            Manage
                            catering
                            menus,
                            pricing,
                            stock,
                            and
                            categories.
                        </p>
                    </div>
                </div>

                <button
                    onClick={
                        openCreateModal
                    }
                    style={{
                        height: "48px",
                        padding:
                            "0 18px",
                        border:
                            "1px solid rgba(59,130,246,0.35)",
                        borderRadius:
                            "14px",
                        background:
                            "linear-gradient(135deg,rgba(29,78,216,0.20),rgba(15,23,42,0.95))",
                        color:
                            "white",
                        fontWeight:
                            "800",
                        fontSize:
                            "14px",
                        display:
                            "flex",
                        alignItems:
                            "center",
                        gap: "8px",
                        cursor:
                            "pointer",
                        boxShadow:
                            "0 12px 28px rgba(37,99,235,0.18)",
                    }}
                >
                    <Plus size={18} />
                    Add Menu
                </button>
            </div>

            {/* STATS */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "16px",
                    marginBottom:
                        "22px",
                }}
            >
                <StatCard
                    title="Total Menus"
                    subtitle="All menu items"
                    value={
                        filteredMenus.length
                    }
                    icon={
                        <UtensilsCrossed
                            size={22}
                        />
                    }
                    color="#2563eb"
                />

                <StatCard
                    title="Total Stock"
                    subtitle="Available stock"
                    value={menus.reduce(
                        (
                            total,
                            item
                        ) =>
                            total +
                            Number(
                                item.stock ||
                                    0
                            ),
                        0
                    )}
                    icon={
                        <Package
                            size={22}
                        />
                    }
                    color="#22c55e"
                />

                <StatCard
                    title="Categories"
                    subtitle="Food categories"
                    value={
                        [
                            ...new Set(
                                menus.map(
                                    (
                                        item
                                    ) =>
                                        item.category
                                )
                            ),
                        ].length
                    }
                    icon={
                        <Layers3
                            size={22}
                        />
                    }
                    color="#f59e0b"
                />
            </div>

            {/* SEARCH */}
            <div
                style={{
                    background:
                        "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(15,23,42,0.95))",
                    border:
                        "1px solid rgba(59,130,246,0.15)",
                    borderRadius:
                        "22px",
                    padding: "20px",
                    boxShadow:
                        "0 16px 40px rgba(0,0,0,0.28)",
                }}
            >
                {/* TOP */}
                <div
                    style={{
                        display:
                            "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "center",
                        flexWrap:
                            "wrap",
                        gap: "16px",
                        marginBottom:
                            "22px",
                    }}
                >
                    <div>
                        <div
                            style={{
                                color:
                                    "#94a3b8",
                                fontSize:
                                    "12px",
                                marginBottom:
                                    "4px",
                            }}
                        >
                            Total
                            Result
                        </div>

                        <div
                            style={{
                                display:
                                    "flex",
                                alignItems:
                                    "baseline",
                                gap: "10px",
                            }}
                        >
                            <div
                                style={{
                                    color:
                                        "white",
                                    fontSize:
                                        "34px",
                                    fontWeight:
                                        "900",
                                    lineHeight:
                                        "1",
                                }}
                            >
                                {
                                    filteredMenus.length
                                }
                            </div>

                            <div
                                style={{
                                    color:
                                        "#cbd5e1",
                                    fontSize:
                                        "13px",
                                }}
                            >
                                menu
                                items
                                found
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            width:
                                "290px",
                            maxWidth:
                                "100%",
                            height:
                                "46px",
                            borderRadius:
                                "14px",
                            background:
                                "rgba(15,23,42,0.90)",
                            border:
                                "1px solid rgba(59,130,246,0.18)",
                            display:
                                "flex",
                            alignItems:
                                "center",
                            padding:
                                "0 14px",
                            gap: "10px",
                        }}
                    >
                        <Search
                            size={18}
                            color="#94a3b8"
                        />

                        <input
                            value={
                                search
                            }
                            onChange={(
                                e
                            ) =>
                                setSearch(
                                    e
                                        .target
                                        .value
                                )
                            }
                            placeholder="Search menu..."
                            style={{
                                flex: 1,
                                border:
                                    "none",
                                outline:
                                    "none",
                                background:
                                    "transparent",
                                color:
                                    "white",
                                fontSize:
                                    "14px",
                            }}
                        />
                    </div>
                </div>

                {/* MENU GRID */}
                <div
                    style={{
                        display:
                            "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(320px, 1fr))",
                        gap: "16px",
                    }}
                >
                    {filteredMenus.map(
                        (menu) => (
                            <div
                                key={
                                    menu.id
                                }
                                style={{
                                    background:
                                        "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(17,24,39,0.98))",
                                    border:
                                        "1px solid rgba(59,130,246,0.12)",
                                    borderRadius:
                                        "18px",
                                    padding:
                                        "14px",
                                    position:
                                        "relative",
                                    overflow:
                                        "hidden",
                                    boxShadow:
                                        "0 12px 30px rgba(0,0,0,0.28)",
                                }}
                            >
                                <div
                                    style={{
                                        position:
                                            "absolute",
                                        top: "-70px",
                                        right:
                                            "-70px",
                                        width:
                                            "140px",
                                        height:
                                            "140px",
                                        background:
                                            "rgba(37,99,235,0.10)",
                                        filter:
                                            "blur(50px)",
                                    }}
                                />

                                <div
                                    style={{
                                        display:
                                            "flex",
                                        gap: "14px",
                                        position:
                                            "relative",
                                        zIndex: 2,
                                    }}
                                >
                                    {/* IMAGE */}
                                    <div
                                        style={{
                                            width:
                                                "115px",
                                            height:
                                                "115px",
                                            borderRadius:
                                                "16px",
                                            overflow:
                                                "hidden",
                                            background:
                                                "#0f172a",
                                            border:
                                                "1px solid rgba(255,255,255,0.06)",
                                            flexShrink:
                                                0,
                                        }}
                                    >
                                        {menu.image ? (
                                            <img
                                                src={`/storage/${menu.image}`}
                                                alt={
                                                    menu.name
                                                }
                                                style={{
                                                    width: "100%",
                                                    height:
                                                        "100%",
                                                    objectFit:
                                                        "cover",
                                                }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: "100%",
                                                    height:
                                                        "100%",
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    color:
                                                        "#64748b",
                                                }}
                                            >
                                                <ImageIcon
                                                    size={
                                                        28
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* CONTENT */}
                                    <div
                                        style={{
                                            flex: 1,
                                            minWidth: 0,
                                            display:
                                                "flex",
                                            flexDirection:
                                                "column",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems:
                                                    "flex-start",
                                            }}
                                        >
                                            <div>
                                                <h3
                                                    style={{
                                                        margin: 0,
                                                        color:
                                                            "white",
                                                        fontSize:
                                                            "17px",
                                                        fontWeight:
                                                            "800",
                                                    }}
                                                >
                                                    {
                                                        menu.name
                                                    }
                                                </h3>

                                                <div
                                                    style={{
                                                        marginTop:
                                                            "7px",
                                                        display:
                                                            "inline-flex",
                                                        padding:
                                                            "4px 10px",
                                                        borderRadius:
                                                            "999px",
                                                        background:
                                                            "rgba(37,99,235,0.16)",
                                                        border:
                                                            "1px solid rgba(59,130,246,0.20)",
                                                        color:
                                                            "#93c5fd",
                                                        fontSize:
                                                            "10px",
                                                        fontWeight:
                                                            "700",
                                                    }}
                                                >
                                                    {menu.category ||
                                                        "Menu"}
                                                </div>
                                            </div>

                                            <button
                                                style={{
                                                    width:
                                                        "30px",
                                                    height:
                                                        "30px",
                                                    borderRadius:
                                                        "10px",
                                                    border:
                                                        "none",
                                                    background:
                                                        "rgba(255,255,255,0.05)",
                                                    color:
                                                        "#cbd5e1",
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    cursor:
                                                        "pointer",
                                                }}
                                            >
                                                <MoreVertical
                                                    size={
                                                        14
                                                    }
                                                />
                                            </button>
                                        </div>

                                        <p
                                            style={{
                                                margin:
                                                    "10px 0 0",
                                                color:
                                                    "#cbd5e1",
                                                fontSize:
                                                    "12px",
                                                lineHeight:
                                                    "1.5",
                                                minHeight:
                                                    "36px",
                                            }}
                                        >
                                            {menu.description ||
                                                "No description available"}
                                        </p>

                                        <div
                                            style={{
                                                marginTop:
                                                    "auto",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display:
                                                        "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems:
                                                        "center",
                                                    marginTop:
                                                        "12px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        color:
                                                            "#4ade80",
                                                        fontSize:
                                                            "22px",
                                                        fontWeight:
                                                            "900",
                                                        lineHeight:
                                                            "1",
                                                    }}
                                                >
                                                    Rp{" "}
                                                    {Number(
                                                        menu.price ||
                                                            0
                                                    ).toLocaleString()}
                                                </div>

                                                <div
                                                    style={{
                                                        color:
                                                            "#cbd5e1",
                                                        fontSize:
                                                            "12px",
                                                    }}
                                                >
                                                    Stock:{" "}
                                                    <span
                                                        style={{
                                                            color:
                                                                "white",
                                                            fontWeight:
                                                                "800",
                                                        }}
                                                    >
                                                        {
                                                            menu.stock
                                                        }
                                                    </span>
                                                </div>
                                            </div>

                                            {/* ACTION */}
                                            <div
                                                style={{
                                                    display:
                                                        "flex",
                                                    gap: "8px",
                                                    marginTop:
                                                        "14px",
                                                }}
                                            >
                                                <button
                                                    onClick={() =>
                                                        openEditModal(
                                                            menu
                                                        )
                                                    }
                                                    style={{
                                                        flex: 1,
                                                        height:
                                                            "36px",
                                                        borderRadius:
                                                            "10px",
                                                        border:
                                                            "1px solid rgba(59,130,246,0.45)",
                                                        background:
                                                            "linear-gradient(135deg,#1d4ed8,#1e3a8a)",
                                                        color:
                                                            "white",
                                                        fontWeight:
                                                            "700",
                                                        fontSize:
                                                            "12px",
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                        gap: "6px",
                                                        cursor:
                                                            "pointer",
                                                    }}
                                                >
                                                    <Pencil
                                                        size={
                                                            13
                                                        }
                                                    />
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            menu.id
                                                        )
                                                    }
                                                    style={{
                                                        flex: 1,
                                                        height:
                                                            "36px",
                                                        borderRadius:
                                                            "10px",
                                                        border:
                                                            "1px solid rgba(239,68,68,0.35)",
                                                        background:
                                                            "linear-gradient(135deg,#7f1d1d,#991b1b)",
                                                        color:
                                                            "white",
                                                        fontWeight:
                                                            "700",
                                                        fontSize:
                                                            "12px",
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                        gap: "6px",
                                                        cursor:
                                                            "pointer",
                                                    }}
                                                >
                                                    <Trash2
                                                        size={
                                                            13
                                                        }
                                                    />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div
                    style={{
                        position:
                            "fixed",
                        inset: 0,
                        background:
                            "rgba(0,0,0,0.75)",
                        display:
                            "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        zIndex: 9999,
                        padding:
                            "20px",
                    }}
                >
                    <div
                        style={{
                            width:
                                "100%",
                            maxWidth:
                                "460px",
                            background:
                                "#111827",
                            borderRadius:
                                "22px",
                            padding:
                                "22px",
                            border:
                                "1px solid rgba(59,130,246,0.15)",
                            boxShadow:
                                "0 20px 50px rgba(0,0,0,0.40)",
                        }}
                    >
                        <div
                            style={{
                                display:
                                    "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center",
                                marginBottom:
                                    "22px",
                            }}
                        >
                            <div>
                                <h2
                                    style={{
                                        margin: 0,
                                        color:
                                            "white",
                                        fontSize:
                                            "24px",
                                        fontWeight:
                                            "800",
                                    }}
                                >
                                    {editingId
                                        ? "Edit Menu"
                                        : "Add Menu"}
                                </h2>

                                <p
                                    style={{
                                        margin:
                                            "6px 0 0",
                                        color:
                                            "#94a3b8",
                                        fontSize:
                                            "13px",
                                    }}
                                >
                                    Complete
                                    menu
                                    information
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setShowModal(
                                        false
                                    )
                                }
                                style={{
                                    width:
                                        "36px",
                                    height:
                                        "36px",
                                    border:
                                        "none",
                                    borderRadius:
                                        "12px",
                                    background:
                                        "rgba(255,255,255,0.06)",
                                    color:
                                        "#cbd5e1",
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    cursor:
                                        "pointer",
                                }}
                            >
                                <X
                                    size={16}
                                />
                            </button>
                        </div>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >
                            <input
                                type="text"
                                placeholder="Menu Name"
                                value={
                                    form.name
                                }
                                onChange={(
                                    e
                                ) =>
                                    setForm(
                                        {
                                            ...form,
                                            name: e
                                                .target
                                                .value,
                                        }
                                    )
                                }
                                style={
                                    inputStyle
                                }
                            />

                            <input
                                type="number"
                                placeholder="Price"
                                value={
                                    form.price
                                }
                                onChange={(
                                    e
                                ) =>
                                    setForm(
                                        {
                                            ...form,
                                            price:
                                                e
                                                    .target
                                                    .value,
                                        }
                                    )
                                }
                                style={
                                    inputStyle
                                }
                            />

                            <input
                                type="text"
                                placeholder="Category"
                                value={
                                    form.category
                                }
                                onChange={(
                                    e
                                ) =>
                                    setForm(
                                        {
                                            ...form,
                                            category:
                                                e
                                                    .target
                                                    .value,
                                        }
                                    )
                                }
                                style={
                                    inputStyle
                                }
                            />

                            <input
                                type="number"
                                placeholder="Stock"
                                value={
                                    form.stock
                                }
                                onChange={(
                                    e
                                ) =>
                                    setForm(
                                        {
                                            ...form,
                                            stock:
                                                e
                                                    .target
                                                    .value,
                                        }
                                    )
                                }
                                style={
                                    inputStyle
                                }
                            />

                            <textarea
                                placeholder="Description"
                                value={
                                    form.description
                                }
                                onChange={(
                                    e
                                ) =>
                                    setForm(
                                        {
                                            ...form,
                                            description:
                                                e
                                                    .target
                                                    .value,
                                        }
                                    )
                                }
                                style={{
                                    ...inputStyle,
                                    height:
                                        "110px",
                                    resize:
                                        "none",
                                    paddingTop:
                                        "14px",
                                }}
                            />

                            <input
                                type="file"
                                onChange={(
                                    e
                                ) =>
                                    setForm(
                                        {
                                            ...form,
                                            image:
                                                e
                                                    .target
                                                    .files[0],
                                        }
                                    )
                                }
                                style={{
                                    marginTop:
                                        "16px",
                                    color:
                                        "#cbd5e1",
                                    fontSize:
                                        "13px",
                                }}
                            />

                            <div
                                style={{
                                    display:
                                        "flex",
                                    justifyContent:
                                        "flex-end",
                                    gap: "10px",
                                    marginTop:
                                        "22px",
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowModal(
                                            false
                                        )
                                    }
                                    style={{
                                        height:
                                            "42px",
                                        padding:
                                            "0 18px",
                                        border:
                                            "none",
                                        borderRadius:
                                            "12px",
                                        background:
                                            "rgba(255,255,255,0.06)",
                                        color:
                                            "#cbd5e1",
                                        fontWeight:
                                            "700",
                                        cursor:
                                            "pointer",
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    style={{
                                        height:
                                            "42px",
                                        padding:
                                            "0 18px",
                                        border:
                                            "none",
                                        borderRadius:
                                            "12px",
                                        background:
                                            "linear-gradient(135deg,#2563eb,#1d4ed8)",
                                        color:
                                            "white",
                                        fontWeight:
                                            "800",
                                        cursor:
                                            "pointer",
                                    }}
                                >
                                    {editingId
                                        ? "Update"
                                        : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </OwnerLayout>
    );
}

/* =========================
   STAT CARD
========================= */

function StatCard({
    title,
    subtitle,
    value,
    icon,
    color,
}) {
    return (
        <div
            style={{
                background:
                    "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(15,23,42,0.92))",
                border: `1px solid ${color}35`,
                borderRadius:
                    "20px",
                padding:
                    "18px",
                overflow:
                    "hidden",
                position:
                    "relative",
                minHeight:
                    "120px",
                boxShadow:
                    "0 12px 28px rgba(0,0,0,0.24)",
            }}
        >
            <div
                style={{
                    position:
                        "absolute",
                    top: "-70px",
                    right: "-70px",
                    width: "150px",
                    height:
                        "150px",
                    background: `${color}18`,
                    filter:
                        "blur(50px)",
                }}
            />

            <div
                style={{
                    position:
                        "relative",
                    zIndex: 2,
                }}
            >
                <div
                    style={{
                        width: "52px",
                        height:
                            "52px",
                        borderRadius:
                            "16px",
                        background: `${color}18`,
                        border: `1px solid ${color}40`,
                        display:
                            "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        color,
                        marginBottom:
                            "14px",
                    }}
                >
                    {icon}
                </div>

                <div
                    style={{
                        color:
                            "#cbd5e1",
                        fontSize:
                            "13px",
                        marginBottom:
                            "6px",
                    }}
                >
                    {title}
                </div>

                <div
                    style={{
                        color:
                            "white",
                        fontSize:
                            "32px",
                        fontWeight:
                            "900",
                        lineHeight:
                            "1",
                    }}
                >
                    {value}
                </div>

                <div
                    style={{
                        marginTop:
                            "6px",
                        color:
                            "#94a3b8",
                        fontSize:
                            "12px",
                    }}
                >
                    {subtitle}
                </div>
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    height: "44px",
    borderRadius: "12px",
    border:
        "1px solid rgba(59,130,246,0.14)",
    background: "#0f172a",
    padding: "0 14px",
    color: "white",
    marginTop: "14px",
    outline: "none",
    boxSizing: "border-box",
    fontSize: "14px",
};