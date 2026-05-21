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
} from "lucide-react";

import OwnerLayout from "../../layouts/OwnerLayout";

export default function MenusOwner() {
    const [menus, setMenus] = useState([]);
    const [search, setSearch] = useState("");

    const [showModal, setShowModal] =
        useState(false);

    const [editingId, setEditingId] =
        useState(null);

    const [form, setForm] = useState({
        name: "",
        price: "",
        description: "",
        image: null,
    });

    /* =========================
       FETCH MENUS
    ========================= */

    const fetchMenus = async () => {
        try {
            const res = await axios.get(
                "/api/owner/menus"
            );

            setMenus(res.data);

        } catch (err) {
            console.error(err);
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
                description: "",
                image: null,
            });

            fetchMenus();

        } catch (err) {
            console.error(err);
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
            console.error(err);
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
                    gap: "16px",
                    marginBottom:
                        "22px",
                }}
            >
                <div>
                    <h1
                        style={{
                            margin: 0,
                            color: "white",
                            fontSize:
                                "28px",
                            fontWeight:
                                "800",
                        }}
                    >
                        Menu Management
                    </h1>

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
                        Manage your
                        catering food
                        menu
                    </p>
                </div>

                <button
                    onClick={
                        openCreateModal
                    }
                    style={{
                        height: "42px",
                        padding:
                            "0 16px",
                        border: "none",
                        borderRadius:
                            "12px",
                        background:
                            "linear-gradient(135deg,#2563eb,#1d4ed8)",
                        color:
                            "white",
                        fontWeight:
                            "700",
                        fontSize:
                            "13px",
                        display:
                            "flex",
                        alignItems:
                            "center",
                        gap: "8px",
                        cursor:
                            "pointer",
                    }}
                >
                    <Plus size={16} />
                    Add Menu
                </button>
            </div>

            {/* TOP BAR */}

            <div
                style={{
                    background:
                        "#111827",
                    border:
                        "1px solid rgba(148,163,184,0.08)",
                    borderRadius:
                        "18px",
                    padding: "16px",
                    marginBottom:
                        "20px",
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems:
                        "center",
                    flexWrap: "wrap",
                    gap: "14px",
                }}
            >
                <div>
                    <div
                        style={{
                            color:
                                "#94a3b8",
                            fontSize:
                                "12px",
                        }}
                    >
                        Total Menus
                    </div>

                    <div
                        style={{
                            color:
                                "white",
                            fontSize:
                                "24px",
                            fontWeight:
                                "800",
                        }}
                    >
                        {
                            filteredMenus.length
                        }
                    </div>
                </div>

                {/* SEARCH */}

                <div
                    style={{
                        width: "240px",
                        height: "42px",
                        borderRadius:
                            "12px",
                        background:
                            "#0f172a",
                        border:
                            "1px solid rgba(148,163,184,0.08)",
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
                        size={15}
                        color="#64748b"
                    />

                    <input
                        value={
                            search
                        }
                        onChange={(
                            e
                        ) =>
                            setSearch(
                                e.target
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
                                "13px",
                        }}
                    />
                </div>
            </div>

            {/* EMPTY */}

            {filteredMenus.length ===
            0 ? (
                <div
                    style={{
                        background:
                            "#111827",
                        border:
                            "1px solid rgba(148,163,184,0.08)",
                        borderRadius:
                            "20px",
                        minHeight:
                            "300px",
                        display:
                            "flex",
                        flexDirection:
                            "column",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        textAlign:
                            "center",
                    }}
                >
                    <div
                        style={{
                            width: "70px",
                            height:
                                "70px",
                            borderRadius:
                                "20px",
                            background:
                                "rgba(59,130,246,0.1)",
                            display:
                                "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            color:
                                "#60a5fa",
                            marginBottom:
                                "16px",
                        }}
                    >
                        <UtensilsCrossed
                            size={30}
                        />
                    </div>

                    <h3
                        style={{
                            color:
                                "white",
                            margin: 0,
                        }}
                    >
                        No Menus Found
                    </h3>

                    <p
                        style={{
                            color:
                                "#94a3b8",
                            fontSize:
                                "14px",
                            marginTop:
                                "8px",
                        }}
                    >
                        Add your first
                        menu item
                    </p>
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(230px,1fr))",
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
                                        "#111827",
                                    border:
                                        "1px solid rgba(148,163,184,0.08)",
                                    borderRadius:
                                        "18px",
                                    overflow:
                                        "hidden",
                                }}
                            >
                                {/* IMAGE */}

                                <div
                                    style={{
                                        height:
                                            "145px",
                                        background:
                                            "#0f172a",
                                    }}
                                >
                                    {menu.image ? (
                                        <img
                                            src={`/storage/${menu.image}`}
                                            alt={
                                                menu.name
                                            }
                                            style={{
                                                width:
                                                    "100%",
                                                height:
                                                    "100%",
                                                objectFit:
                                                    "cover",
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width:
                                                    "100%",
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
                                        padding:
                                            "16px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            marginBottom:
                                                "12px",
                                        }}
                                    >
                                        <div>
                                            <div
                                                style={{
                                                    color:
                                                        "white",
                                                    fontWeight:
                                                        "700",
                                                    fontSize:
                                                        "15px",
                                                    marginBottom:
                                                        "6px",
                                                }}
                                            >
                                                {
                                                    menu.name
                                                }
                                            </div>

                                            <div
                                                style={{
                                                    color:
                                                        "#60a5fa",
                                                    fontWeight:
                                                        "800",
                                                    fontSize:
                                                        "17px",
                                                }}
                                            >
                                                Rp{" "}
                                                {Number(
                                                    menu.price ||
                                                        0
                                                ).toLocaleString()}
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                width:
                                                    "36px",
                                                height:
                                                    "36px",
                                                borderRadius:
                                                    "10px",
                                                background:
                                                    "rgba(59,130,246,0.12)",
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",
                                                color:
                                                    "#60a5fa",
                                            }}
                                        >
                                            <UtensilsCrossed
                                                size={
                                                    16
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            color:
                                                "#94a3b8",
                                            fontSize:
                                                "13px",
                                            lineHeight:
                                                "1.6",
                                            minHeight:
                                                "40px",
                                            marginBottom:
                                                "16px",
                                        }}
                                    >
                                        {menu.description ||
                                            "No description"}
                                    </div>

                                    {/* BUTTONS */}

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            gap: "10px",
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
                                                    "38px",
                                                border:
                                                    "none",
                                                borderRadius:
                                                    "10px",
                                                background:
                                                    "rgba(59,130,246,0.12)",
                                                color:
                                                    "#60a5fa",
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",
                                                gap: "8px",
                                                fontWeight:
                                                    "700",
                                                cursor:
                                                    "pointer",
                                            }}
                                        >
                                            <Pencil
                                                size={
                                                    14
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
                                                width:
                                                    "40px",
                                                border:
                                                    "none",
                                                borderRadius:
                                                    "10px",
                                                background:
                                                    "rgba(239,68,68,0.12)",
                                                color:
                                                    "#f87171",
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
                                            <Trash2
                                                size={
                                                    15
                                                }
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}

            {/* MODAL */}

            {showModal && (
                <div
                    style={{
                        position:
                            "fixed",
                        inset: 0,
                        background:
                            "rgba(0,0,0,0.65)",
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
                                "430px",
                            background:
                                "#111827",
                            borderRadius:
                                "20px",
                            padding:
                                "22px",
                            border:
                                "1px solid rgba(148,163,184,0.08)",
                        }}
                    >
                        {/* HEADER */}

                        <div
                            style={{
                                display:
                                    "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center",
                                marginBottom:
                                    "20px",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        color:
                                            "white",
                                        fontSize:
                                            "20px",
                                        fontWeight:
                                            "800",
                                    }}
                                >
                                    {editingId
                                        ? "Edit Menu"
                                        : "Add Menu"}
                                </div>

                                <div
                                    style={{
                                        color:
                                            "#94a3b8",
                                        fontSize:
                                            "13px",
                                        marginTop:
                                            "4px",
                                    }}
                                >
                                    Fill menu
                                    information
                                </div>
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
                                        "10px",
                                    background:
                                        "rgba(148,163,184,0.08)",
                                    color:
                                        "#94a3b8",
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

                        {/* FORM */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >
                            <input
                                type="text"
                                placeholder="Menu name"
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
                                        "100px",
                                    resize:
                                        "none",
                                    paddingTop:
                                        "12px",
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
                                        "14px",
                                    color:
                                        "#cbd5e1",
                                }}
                            />

                            {/* FOOTER */}

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
                                            "0 16px",
                                        border:
                                            "none",
                                        borderRadius:
                                            "10px",
                                        background:
                                            "rgba(148,163,184,0.08)",
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
                                            "10px",
                                        background:
                                            "linear-gradient(135deg,#2563eb,#1d4ed8)",
                                        color:
                                            "white",
                                        fontWeight:
                                            "700",
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

const inputStyle = {
    width: "100%",
    height: "46px",
    borderRadius: "12px",
    border: "1px solid rgba(148,163,184,0.08)",
    background: "#0f172a",
    padding: "0 14px",
    color: "white",
    marginTop: "14px",
    outline: "none",
    boxSizing: "border-box",
    fontSize: "13px",
};