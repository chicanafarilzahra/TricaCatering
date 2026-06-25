// resources/js/pages/Menus.jsx
import axios from "axios";

import {
    UtensilsCrossed,
    Soup,
    Coffee,
    BadgeCheck,
    Search,
    Filter,
    Eye,
} from "lucide-react";

import {
    useMemo,
    useState,
    useEffect,
} from "react";

import AdminLayout from "../layouts/AdminLayout";

export default function Menus() {
    const [search, setSearch] =
        useState("");

    const [filterOpen, setFilterOpen] =
        useState(false);

    const [selectedCategory, setSelectedCategory] =
        useState("All");

    const [menus, setMenus] =
        useState([]);

    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
    try {
        const res = await axios.get("/menus");

        console.log("DATA MENU:", res.data);

        if (res.data.length > 0) {
            console.log("MENU PERTAMA:", res.data[0]);
            console.log("IMAGE:", res.data[0].image);
        }

        setMenus(
            Array.isArray(res.data)
                ? res.data
                : []
        );
    } catch (err) {
        console.log(err);
    }
};

    // FILTER DATA
    const filteredMenus = useMemo(() => {
        return menus.filter((item) => {
            const keyword =
                search.toLowerCase();

            const matchSearch =
                item.name
                    ?.toLowerCase()
                    .includes(keyword) ||
                item.category
                    ?.toLowerCase()
                    .includes(keyword) ||
                item.owner
                    ?.nama_catering
                    ?.toLowerCase()
                    .includes(keyword);

            const matchCategory =
                selectedCategory ===
                    "All" ||
                item.category ===
                    selectedCategory;

            return (
                matchSearch &&
                matchCategory
            );
        });
    }, [
        menus,
        search,
        selectedCategory,
    ]);

    // STATS
    const totalMenus =
        menus.length;

    const foodMenus = menus.filter(
        (item) =>
            item.category?.toLowerCase() ===
            "makanan"
    ).length;

    const drinkMenus = menus.filter(
        (item) =>
            item.category?.toLowerCase() ===
            "minuman"
    ).length;

    const availableMenus =
    menus.filter(
        (item) => item.is_active == 1
    ).length;

    const stats = [
{
   title: "Total Menus",
   value: totalMenus,
   icon: <UtensilsCrossed size={22} />,
   color: "#3b82f6",
   bg: "rgba(59,130,246,0.12)",
},

{
   title: "Active Menus",
   value: availableMenus,
   icon: <BadgeCheck size={22} />,
   color: "#10b981",
   bg: "rgba(16,185,129,0.12)",
},
];

    const getStatusStyle = (
        isActive
    ) => {
        return isActive
            ? {
                  background:
                      "rgba(16,185,129,0.15)",
                  color: "#34d399",
              }
            : {
                  background:
                      "rgba(239,68,68,0.15)",
                  color: "#f87171",
              };
    };

    return (
    <>
        <AdminLayout>
            <style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.dash-root,
.dash-root *{
    font-family:'Inter',system-ui,sans-serif;
    box-sizing:border-box;
}

.stat-card:hover{
    transform:translateY(-3px);
    box-shadow:0 16px 48px rgba(0,0,0,.35);
}
`}</style>

<div className="dash-root">
            {/* HERO */}
<div
    style={{
        position: "relative",
        borderRadius: "24px",
        padding: "40px",
        background:
            "linear-gradient(135deg,#0d1117 0%,#0f172a 60%,#131c2e 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
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
            background: "rgba(59,130,246,0.12)",
            filter: "blur(90px)",
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
            background: "rgba(139,92,246,0.1)",
            filter: "blur(70px)",
        }}
    />

    <div
        style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "32px",
            flexWrap: "wrap",
        }}
    >
        {/* LEFT */}
        <div style={{ flex: 1 }}>
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
                    marginBottom: "22px",
                }}
            >
                <span
                    style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "999px",
                        background: "#60a5fa",
                    }}
                />
                Menu Management
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
                }}
            >
                Monitor seluruh
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
                    menu catering
                </span>
            </h1>

            <p
                style={{
                    margin: "16px 0 0",
                    color: "#64748b",
                    fontSize: "15px",
                    lineHeight: "1.8",
                    maxWidth: "600px",
                }}
            >
                Kelola dan monitor seluruh
                menu makanan serta minuman
                catering dalam satu dashboard
                modern yang cepat, rapi,
                dan realtime.
            </p>

            <div
                style={{
                    marginTop: "24px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    background:
                        "rgba(255,255,255,0.04)",
                    border:
                        "1px solid rgba(255,255,255,0.07)",
                    color: "#94a3b8",
                    fontSize: "13px",
                }}
            >
                <UtensilsCrossed
                    size={14}
                    color="#60a5fa"
                />
                Monitoring Menu Realtime
            </div>
        </div>

        {/* RIGHT CARD */}
        <div
            style={{
                width: "300px",
                background:
                    "rgba(255,255,255,0.03)",
                border:
                    "1px solid rgba(255,255,255,0.07)",
                borderRadius: "20px",
                padding: "24px",
                backdropFilter: "blur(12px)",
            }}
        >
            <div
                style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "0.08em",
                    textTransform:
                        "uppercase",
                    color: "#475569",
                    marginBottom: "18px",
                }}
            >
                Menu Overview
            </div>

            {[
                {
                    label: "Total Menu",
                    value: totalMenus,
                    color: "#60a5fa",
                },
                {
                    label: "Active Menu",
                    value: availableMenus,
                    color: "#22c55e",
                },
            ].map((row, i) => (
                <div
                    key={i}
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "center",
                        padding: "11px 0",
                        borderBottom:
                            i < 1
                                ? "1px solid rgba(255,255,255,0.05)"
                                : "none",
                    }}
                >
                    <span
                        style={{
                            color: "#94a3b8",
                            fontSize: "13px",
                        }}
                    >
                        {row.label}
                    </span>

                    <span
                        style={{
                            color: row.color,
                            fontWeight:
                                "700",
                        }}
                    >
                        {row.value}
                    </span>
                </div>
            ))}

            <div
                style={{
                    marginTop: "18px",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    background:
                        "rgba(34,197,94,0.08)",
                    border:
                        "1px solid rgba(34,197,94,0.15)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                }}
            >
                <BadgeCheck
                    size={14}
                    color="#22c55e"
                />
                <span
                    style={{
                        color: "#22c55e",
                        fontSize: "13px",
                        fontWeight: "600",
                    }}
                >
                    Sistem menu berjalan normal
                </span>
            </div>
        </div>
    </div>
</div>

            {/* STATS */}
<div
    style={{
        display: "grid",
        gridTemplateColumns:
            "repeat(2,minmax(0,1fr))",
        gap: "16px",
        marginBottom: "24px",
    }}
>
    {stats.map((item, index) => (
        <div
            key={index}
            className="stat-card"
            style={{
                background:
                    "linear-gradient(160deg,#0f172a 0%,#0d1117 100%)",
                border: `1px solid ${item.bg.replace(
                    "0.12",
                    "0.25"
                )}`,
                borderRadius: "20px",
                padding: "24px",
                position: "relative",
                overflow: "hidden",
                cursor: "default",
                transition:
                    "transform .2s ease, box-shadow .2s ease",
            }}
        >
            {/* Accent Line */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: "24px",
                    right: "24px",
                    height: "2px",
                    background: `linear-gradient(
                        90deg,
                        ${item.color},
                        transparent
                    )`,
                }}
            />

            {/* Glow */}
            <div
                style={{
                    position: "absolute",
                    top: "-40px",
                    right: "-40px",
                    width: "110px",
                    height: "110px",
                    borderRadius: "999px",
                    background: item.bg,
                    filter: "blur(30px)",
                }}
            />

            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                }}
            >
                {/* ICON */}
                <div
                    style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "14px",
                        background: item.bg,
                        color: item.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "20px",
                    }}
                >
                    {item.icon}
                </div>

                {/* VALUE */}
                <div
                    style={{
                        color: "white",
                        fontSize: "36px",
                        fontWeight: "800",
                        lineHeight: 1,
                        letterSpacing: "-1px",
                        marginBottom: "8px",
                    }}
                >
                    {item.value}
                </div>

                {/* TITLE */}
                <div
                    style={{
                        color: "#475569",
                        fontSize: "13px",
                        fontWeight: "500",
                    }}
                >
                    {item.title}
                </div>
            </div>
        </div>
    ))}
</div>

            {/* TABLE CONTAINER */}
<div
    id="menu-list"
    style={{
        background:
            "linear-gradient(160deg,#0f172a 0%,#0d1117 100%)",
        border:
            "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px",
        padding: "24px",
        overflow: "visible",
        marginBottom: "24px",
    }}
>
    {/* HEADER */}
    <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "24px",
        }}
    >
        <div>
            <h2
                style={{
                    margin: 0,
                    color: "white",
                    fontSize: "18px",
                    fontWeight: "700",
                    letterSpacing: "-0.3px",
                }}
            >
                Menu List
            </h2>

            <p
                style={{
                    margin: "4px 0 0",
                    color: "#475569",
                    fontSize: "13px",
                }}
            >
                Kelola seluruh menu catering
            </p>
        </div>

        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
                position: "relative",
            }}
        >
            {/* SEARCH */}
            <div
                style={{
                    width: "320px",
                    height: "42px",
                    border:
                        "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "10px",
                    background:
                        "rgba(255,255,255,0.03)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 14px",
                    gap: "10px",
                }}
            >
                <Search
                    size={16}
                    color="#64748b"
                />

                <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="Cari menu..."
                    style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "white",
                        fontSize: "13px",
                    }}
                />
            </div>

            {/* FILTER */}
            <button
                onClick={() =>
                    setFilterOpen(!filterOpen)
                }
                style={{
                    height: "42px",
                    padding: "0 16px",
                    border:
                        "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "10px",
                    background: filterOpen
                        ? "rgba(59,130,246,0.15)"
                        : "rgba(255,255,255,0.03)",
                    color: filterOpen
                        ? "#60a5fa"
                        : "#94a3b8",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                }}
            >
                <Filter size={15} />
                Filter
            </button>

            {/* FILTER MENU */}
            {filterOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "52px",
                        right: 0,
                        width: "220px",
                        background:
                            "linear-gradient(160deg,#0f172a 0%,#111827 100%)",
                        border:
                            "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "14px",
                        padding: "10px",
                        zIndex: 50,
                        boxShadow:
                            "0 20px 40px rgba(0,0,0,.4)",
                    }}
                >
                    {[
                        "All",
                        "Food",
                        "Drink",
                    ].map((item) => (
                        <button
                            key={item}
                            onClick={() => {
                                setSelectedCategory(item);
                                setFilterOpen(false);
                            }}
                            style={{
                                width: "100%",
                                height: "40px",
                                border: "none",
                                borderRadius: "10px",
                                background:
                                    selectedCategory === item
                                        ? "rgba(59,130,246,0.15)"
                                        : "transparent",
                                color:
                                    selectedCategory === item
                                        ? "#60a5fa"
                                        : "#cbd5e1",
                                textAlign: "left",
                                padding: "0 12px",
                                cursor: "pointer",
                                fontSize: "13px",
                                marginBottom: "4px",
                            }}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            )}
        </div>
    </div>

                {/* TABLE */}
<div
    style={{
        width: "100%",
        maxWidth: "100%",
        overflowX: "auto",
        borderRadius: "16px",
    }}
>
    <table
    style={{
        width: "100%",
        borderCollapse: "separate",
        borderSpacing: 0,
        tableLayout: "fixed",
    }}
>
        <thead>
            <tr
                style={{
                    background:
                        "rgba(255,255,255,0.03)",
                }}
            >
                {[
                    "Owner Catering",
                    "Foto",
                    "Menu Name",
                    "Category",
                    "Price",
                    "Status",
                ].map((item, index) => (
                    <th
                        key={index}
                        style={{
                            textAlign: "left",
                            padding: "16px",
                            color: "#94a3b8",
                            fontSize: "12px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            borderBottom:
                                "1px solid rgba(255,255,255,0.06)",

                            ...(index === 0 && {
                                borderTopLeftRadius:
                                    "14px",
                            }),

                            ...(index === 5 && {
                                borderTopRightRadius:
                                    "14px",
                            }),
                        }}
                    >
                        {item}
                    </th>
                ))}
            </tr>
        </thead>

        <tbody>
            {filteredMenus.length > 0 ? (
                filteredMenus.map(
                    (menu, index) => (
                        <tr
                            key={index}
                            style={{
                                borderBottom:
                                    "1px solid rgba(255,255,255,0.04)",
                                transition:
                                    "all .2s ease",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background =
                                    "rgba(255,255,255,0.025)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                    "transparent")
                            }
                        >
                            {/* OWNER */}
                            <td
                                style={{
                                    padding: "16px",
                                }}
                            >
                                <div
                                    style={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        gap: "12px",
                                    }}
                                >
                                    <div
                                        style={{
                                            width:
                                                "38px",
                                            height:
                                                "38px",
                                            borderRadius:
                                                "12px",
                                            background:
                                                "rgba(59,130,246,.15)",
                                            color:
                                                "#60a5fa",
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            fontWeight:
                                                "700",
                                            fontSize:
                                                "14px",
                                        }}
                                    >
                                        {menu.owner?.nama_catering
                                            ?.charAt(
                                                0
                                            )
                                            ?.toUpperCase()}
                                    </div>

                                    <div>
                                        <div
                                            style={{
                                                color:
                                                    "white",
                                                fontWeight:
                                                    "600",
                                                fontSize:
                                                    "14px",
                                            }}
                                        >
                                            {menu.owner
                                                ?.nama_catering ||
                                                "-"}
                                        </div>

                                        <div
                                            style={{
                                                color:
                                                    "#64748b",
                                                fontSize:
                                                    "12px",
                                            }}
                                        >
                                            Catering
                                        </div>
                                    </div>
                                </div>
                            </td>

                            {/* FOTO */}
                            <td
                                style={{
                                    padding: "16px",
                                }}
                            >
                                <img
                                    src={`http://localhost:8000/storage/${menu.image}`}
                                    alt={
                                        menu.name
                                    }
                                    onClick={() =>
                                        setPreviewImage(
                                            `http://localhost:8000/storage/${menu.image}`
                                        )
                                    }
                                    style={{
                                        width:
                                            "56px",
                                        height:
                                            "56px",
                                        objectFit:
                                            "cover",
                                        borderRadius:
                                            "14px",
                                        cursor:
                                            "pointer",
                                        border:
                                            "1px solid rgba(255,255,255,.08)",
                                    }}
                                />
                            </td>

                            {/* MENU */}
                            <td
                                style={{
                                    padding: "16px",
                                }}
                            >
                                <div
                                    style={{
                                        color:
                                            "white",
                                        fontWeight:
                                            "600",
                                        fontSize:
                                            "14px",
                                    }}
                                >
                                    {
                                        menu.name
                                    }
                                </div>
                            </td>

                            {/* CATEGORY */}
                            <td
                                style={{
                                    padding: "16px",
                                    color:
                                        "#94a3b8",
                                    fontSize:
                                        "14px",
                                }}
                            >
                                {
                                    menu.category
                                }
                            </td>

                            {/* PRICE */}
                            <td
                                style={{
                                    padding: "16px",
                                    color:
                                        "white",
                                    fontWeight:
                                        "700",
                                    fontSize:
                                        "14px",
                                }}
                            >
                                Rp{" "}
                                {Number(
                                    menu.price ||
                                        0
                                ).toLocaleString(
                                    "id-ID"
                                )}
                            </td>

                            {/* STATUS */}
                            <td
                                style={{
                                    padding: "16px",
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
                                        ...getStatusStyle(
                                            menu.is_active
                                        ),
                                    }}
                                >
                                    {menu.is_active
                                        ? "Active"
                                        : "Inactive"}
                                </span>
                            </td>
                        </tr>
                    )
                )
            ) : (
                <tr>
                    <td
                        colSpan={6}
                        style={{
                            padding:
                                "80px 20px",
                            textAlign:
                                "center",
                            color:
                                "#64748b",
                            fontSize:
                                "14px",
                        }}
                    >
                        {search
                            ? `Tidak ada hasil untuk "${search}"`
                            : selectedCategory !==
                              "All"
                            ? `Tidak ada menu kategori "${selectedCategory}"`
                            : "Belum ada data menu"}
                    </td>
                </tr>
            )}
        </tbody>
    </table>
</div>
            </div>
            </div>
        </AdminLayout>
        {previewImage && (
    <div
        onClick={() => setPreviewImage(null)}
        style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
        }}
    >
        <button
            onClick={() => setPreviewImage(null)}
            style={{
                position: "absolute",
                top: "20px",
                right: "25px",
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                fontSize: "24px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(8px)",
            }}
        >
            ✕
        </button>
                <img
                    src={previewImage}
                    alt="Preview"
                    onClick={(e) =>
                        e.stopPropagation()
                    }
                    style={{
                        maxWidth: "90%",
                        maxHeight: "90%",
                        borderRadius: "20px",
                        boxShadow:
                            "0 20px 60px rgba(0,0,0,0.5)",
                    }}
                />
            </div>
        )}
        
    </>
);
}