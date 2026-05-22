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
            const res = await axios.get(
                "/api/owner/menus"
            );

            setMenus(res.data);

        } catch (err) {
            console.log(err);

            if (err.response) {
                console.log(err.response.data);

                alert(
                    JSON.stringify(
                        err.response.data
                    )
                );
            }
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
            category: menu.category || "",
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

            if (err.response) {
                console.log(err.response.data);

                alert(
                    JSON.stringify(
                        err.response.data
                    )
                );
            }
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

            if (err.response) {
                console.log(err.response.data);

                alert(
                    JSON.stringify(
                        err.response.data
                    )
                );
            }
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

            {filteredMenus.length === 0 ? (
    <div
        style={{
            background: "#111827",
            border:
                "1px solid rgba(148,163,184,0.08)",
            borderRadius: "24px",
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
        }}
    >
        <UtensilsCrossed
            size={42}
            color="#60a5fa"
        />

        <h3
            style={{
                color: "white",
                marginTop: "18px",
            }}
        >
            No Menus Found
        </h3>

        <p
            style={{
                color: "#94a3b8",
                fontSize: "14px",
            }}
        >
            Add your first menu item
        </p>
    </div>
) : (
    <div
        style={{
            background: "#111827",
            border:
                "1px solid rgba(148,163,184,0.08)",
            borderRadius: "24px",
            overflow: "hidden",
        }}
    >
        {/* TABLE HEADER */}

        <div
            style={{
                display: "grid",
                gridTemplateColumns:
                    "2fr 1fr 1fr 1fr 120px",
                padding: "22px 24px",
                borderBottom:
                    "1px solid rgba(148,163,184,0.08)",
                color: "#94a3b8",
                fontSize: "13px",
                fontWeight: "700",
            }}
        >
            <div>MENU</div>
            <div>CATEGORY</div>
            <div>STOCK</div>
            <div>PRICE</div>
            <div
                style={{
                    textAlign: "center",
                }}
            >
                ACTIONS
            </div>
        </div>

        {/* TABLE BODY */}

        {filteredMenus.map((menu) => (
            <div
                key={menu.id}
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "2fr 1fr 1fr 1fr 120px",
                    alignItems: "center",
                    padding: "22px 24px",
                    borderBottom:
                        "1px solid rgba(148,163,184,0.05)",
                }}
            >
                {/* MENU */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                    }}
                >
                    <div
                        style={{
                            width: "78px",
                            height: "78px",
                            borderRadius: "18px",
                            overflow: "hidden",
                            background: "#0f172a",
                            flexShrink: 0,
                        }}
                    >
                        {menu.image ? (
                            <img
                                src={`/storage/${menu.image}`}
                                alt={menu.name}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit:
                                        "cover",
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
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
                                    size={26}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <div
                            style={{
                                color: "white",
                                fontWeight:
                                    "700",
                                fontSize:
                                    "18px",
                                marginBottom:
                                    "6px",
                            }}
                        >
                            {menu.name}
                        </div>

                        <div
                            style={{
                                color: "#94a3b8",
                                fontSize:
                                    "14px",
                                marginBottom:
                                    "8px",
                            }}
                        >
                            {menu.description ||
                                "No description"}
                        </div>

                        <div
                            style={{
                                color: "#3b82f6",
                                fontWeight:
                                    "800",
                                fontSize:
                                    "28px",
                            }}
                        >
                            Rp{" "}
                            {Number(
                                menu.price || 0
                            ).toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* CATEGORY */}

                <div>
                    <span
                        style={{
                            padding:
                                "8px 14px",
                            borderRadius:
                                "999px",
                            background:
                                "rgba(59,130,246,0.12)",
                            color: "#60a5fa",
                            fontSize: "13px",
                            fontWeight: "700",
                        }}
                    >
                        {menu.category ||
                            "No Category"}
                    </span>
                </div>

                {/* STOCK */}

                <div>
                    <span
                        style={{
                            padding:
                                "8px 14px",
                            borderRadius:
                                "999px",
                            background:
                                "rgba(16,185,129,0.12)",
                            color: "#34d399",
                            fontSize: "13px",
                            fontWeight: "700",
                        }}
                    >
                        {menu.stock || 0}
                    </span>
                </div>

                {/* PRICE */}

                <div
                    style={{
                        color: "white",
                        fontWeight: "800",
                        fontSize: "24px",
                    }}
                >
                    Rp{" "}
                    {Number(
                        menu.price || 0
                    ).toLocaleString()}
                </div>

                {/* ACTIONS */}

                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "center",
                        gap: "10px",
                    }}
                >
                    <button
                        onClick={() =>
                            openEditModal(menu)
                        }
                        style={{
                            width: "46px",
                            height: "46px",
                            border: "none",
                            borderRadius: "14px",
                            background:
                                "#2563eb",
                            color: "white",
                            display: "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            cursor: "pointer",
                        }}
                    >
                        <Pencil size={18} />
                    </button>

                    <button
                        onClick={() =>
                            handleDelete(
                                menu.id
                            )
                        }
                        style={{
                            width: "46px",
                            height: "46px",
                            border: "none",
                            borderRadius: "14px",
                            background:
                                "#dc2626",
                            color: "white",
                            display: "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            cursor: "pointer",
                        }}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        ))}

        {/* FOOTER */}

        <div
            style={{
                padding: "20px 24px",
                color: "#94a3b8",
                fontSize: "14px",
            }}
        >
            Showing 1 to {filteredMenus.length} of{" "}
            {filteredMenus.length} menu
        </div>
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

                            <input
                                type="text"
                                placeholder="Category"
                                value={
                                    form.category
                                }
                                onChange={(
                                    e
                                ) =>
                                    setForm({
                                        ...form,
                                        category:
                                            e.target
                                                .value,
                                    })
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
                                    setForm({
                                        ...form,
                                        stock:
                                            e.target
                                                .value,
                                    })
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