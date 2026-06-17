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
        const res = await axios.get("/api/menus");

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
            {/* HERO */}
            <div
                style={{
                    width: "100%",
                    borderRadius: "32px",
                    padding: "38px",
                    background:
                        "linear-gradient(135deg,#0f172a 0%,#111827 45%,#1e293b 100%)",
                    border:
                        "1px solid rgba(255,255,255,0.06)",
                    position: "relative",
                    overflow: "hidden",
                    marginBottom: "30px",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: "-120px",
                        right: "-80px",
                        width: "260px",
                        height: "260px",
                        borderRadius: "999px",
                        background:
                            "rgba(59,130,246,0.16)",
                        filter: "blur(100px)",
                    }}
                />

                <div
                    style={{
                        position: "relative",
                        zIndex: 2,
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "24px",
                    }}
                >
                    <div>
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
                                border:
                                    "1px solid rgba(59,130,246,0.18)",
                                color:
                                    "#60a5fa",
                                fontSize:
                                    "13px",
                                fontWeight:
                                    "600",
                                marginBottom:
                                    "20px",
                            }}
                        >
                            <UtensilsCrossed
                                size={15}
                            />
                            Catering Menus
                        </div>

                        <h1
                            style={{
                                margin: 0,
                                color: "white",
                                fontSize:
                                    "42px",
                                fontWeight:
                                    "800",
                                lineHeight:
                                    1.2,
                                letterSpacing:
                                    "-1px",
                            }}
                        >
                            Catering Menu
                            Overview
                        </h1>

                        <p
                            style={{
                                margin:
                                    "18px 0 0",
                                color:
                                    "#94a3b8",
                                fontSize:
                                    "15px",
                                lineHeight:
                                    "30px",
                                maxWidth:
                                    "720px",
                            }}
                        >
                            Lihat seluruh
                            daftar menu
                            catering dengan
                            tampilan modern,
                            clean, dan
                            elegant dalam
                            satu dashboard
                            admin.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            document
                                .getElementById(
                                    "menu-list"
                                )
                                ?.scrollIntoView(
                                    {
                                        behavior:
                                            "smooth",
                                    }
                                );
                        }}
                        style={{
                            height: "56px",
                            padding:
                                "0 24px",
                            border: "none",
                            borderRadius:
                                "16px",
                            background:
                                "linear-gradient(135deg,#2563eb,#3b82f6)",
                            color: "white",
                            fontWeight:
                                "700",
                            display: "flex",
                            alignItems:
                                "center",
                            gap: "10px",
                            cursor:
                                "pointer",
                            boxShadow:
                                "0 12px 30px rgba(37,99,235,0.35)",
                        }}
                    >
                        <Eye size={18} />
                        View Details
                    </button>
                </div>
            </div>

            {/* STATS */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(240px,1fr))",
                    gap: "22px",
                    marginBottom: "30px",
                }}
            >
                {stats.map(
                    (item, index) => (
                        <div
                            key={index}
                            style={{
                                background:
                                    "linear-gradient(180deg,#111827 0%,#0f172a 100%)",
                                border:
                                    "1px solid rgba(255,255,255,0.06)",
                                borderRadius:
                                    "26px",
                                padding:
                                    "24px",
                                position:
                                    "relative",
                                overflow:
                                    "hidden",
                            }}
                        >
                            <div
                                style={{
                                    position:
                                        "absolute",
                                    top: "-45px",
                                    right:
                                        "-45px",
                                    width:
                                        "130px",
                                    height:
                                        "130px",
                                    borderRadius:
                                        "999px",
                                    background:
                                        item.bg,
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
                                        width:
                                            "58px",
                                        height:
                                            "58px",
                                        borderRadius:
                                            "18px",
                                        background:
                                            item.bg,
                                        color:
                                            item.color,
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        marginBottom:
                                            "18px",
                                    }}
                                >
                                    {item.icon}
                                </div>

                                <div
                                    style={{
                                        color:
                                            "#94a3b8",
                                        fontSize:
                                            "14px",
                                        marginBottom:
                                            "10px",
                                    }}
                                >
                                    {
                                        item.title
                                    }
                                </div>

                                <div
                                    style={{
                                        color:
                                            "white",
                                        fontSize:
                                            "34px",
                                        fontWeight:
                                            "800",
                                    }}
                                >
                                    {
                                        item.value
                                    }
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* TABLE */}
            <div
                id="menu-list"
                style={{
                    background:
                        "linear-gradient(180deg,#111827 0%,#0f172a 100%)",
                    border:
                        "1px solid rgba(255,255,255,0.06)",
                    borderRadius:
                        "30px",
                    padding: "30px",
                    overflow: "hidden",
                }}
            >
                {/* HEADER */}
                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "center",
                        flexWrap: "wrap",
                        gap: "18px",
                        marginBottom:
                            "28px",
                    }}
                >
                    <div>
                        <h2
                            style={{
                                margin: 0,
                                color:
                                    "white",
                                fontSize:
                                    "26px",
                                fontWeight:
                                    "700",
                            }}
                        >
                            Menu List
                        </h2>

                        <p
                            style={{
                                margin:
                                    "8px 0 0",
                                color:
                                    "#94a3b8",
                                fontSize:
                                    "14px",
                            }}
                        >
                            Available
                            catering food &
                            beverage menus
                        </p>
                    </div>

                    {/* ACTION */}
                    <div
                        style={{
                            display: "flex",
                            alignItems:
                                "center",
                            gap: "12px",
                            flexWrap:
                                "wrap",
                            position:
                                "relative",
                        }}
                    >
                        {/* SEARCH */}
                        <div
                            style={{
                                height: "50px",
                                minWidth:
                                    "250px",
                                border:
                                    "1px solid rgba(255,255,255,0.06)",
                                background:
                                    "rgba(255,255,255,0.04)",
                                borderRadius:
                                    "16px",
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                padding:
                                    "0 16px",
                                gap: "10px",
                            }}
                        >
                            <Search
                                size={18}
                                color="#94a3b8"
                            />

                            <input
                                type="text"
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
                                placeholder="Search menus..."
                                style={{
                                    flex: 1,
                                    background:
                                        "transparent",
                                    border:
                                        "none",
                                    outline:
                                        "none",
                                    color:
                                        "white",
                                    fontSize:
                                        "14px",
                                }}
                            />
                        </div>

                        {/* FILTER */}
                        <button
                            onClick={() =>
                                setFilterOpen(
                                    !filterOpen
                                )
                            }
                            style={{
                                height: "50px",
                                padding:
                                    "0 20px",
                                border:
                                    "1px solid rgba(255,255,255,0.06)",
                                borderRadius:
                                    "16px",
                                background:
                                    filterOpen
                                        ? "#2563eb"
                                        : "rgba(255,255,255,0.04)",
                                color:
                                    "white",
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                gap: "10px",
                                fontWeight:
                                    "600",
                                cursor:
                                    "pointer",
                            }}
                        >
                            <Filter
                                size={18}
                            />
                            Filter
                        </button>

                        {/* FILTER MENU */}
                        {filterOpen && (
                            <div
                                style={{
                                    position:
                                        "absolute",
                                    top: "62px",
                                    right: 0,
                                    width:
                                        "220px",
                                    background:
                                        "#0f172a",
                                    border:
                                        "1px solid rgba(255,255,255,0.08)",
                                    borderRadius:
                                        "18px",
                                    padding:
                                        "14px",
                                    zIndex: 10,
                                    boxShadow:
                                        "0 20px 40px rgba(0,0,0,0.35)",
                                }}
                            >
                                {[
                                    "All",
                                    "Food",
                                    "Drink",
                                ].map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <button
                                            key={
                                                index
                                            }
                                            onClick={() => {
                                                setSelectedCategory(
                                                    item
                                                );

                                                setFilterOpen(
                                                    false
                                                );
                                            }}
                                            style={{
                                                width:
                                                    "100%",
                                                height:
                                                    "44px",
                                                border:
                                                    "none",
                                                borderRadius:
                                                    "12px",
                                                background:
                                                    selectedCategory ===
                                                    item
                                                        ? "rgba(59,130,246,0.15)"
                                                        : "transparent",
                                                color:
                                                    "#e2e8f0",
                                                textAlign:
                                                    "left",
                                                padding:
                                                    "0 14px",
                                                cursor:
                                                    "pointer",
                                                marginBottom:
                                                    "4px",
                                            }}
                                        >
                                            {
                                                item
                                            }
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* TABLE */}
                <div
                    style={{
                        width: "100%",
                        overflowX:
                            "auto",
                    }}
                >
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
                            <tr>
                                {[
                                    
                                    "Owner Catering",
                                    "Foto",
                                    "Menu Name",
                                    "Category",
                                    "Price",
                                    "Status",
                                    
                                ].map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <th
                                            key={
                                                index
                                            }
                                            style={{
                                                textAlign:
                                                    "left",
                                                padding:
                                                    "18px 20px",
                                                color:
                                                    "#94a3b8",
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
                            {filteredMenus.length >
                            0 ? (
                                filteredMenus.map(
                                    (
                                        menu,
                                        index
                                    ) => (
                                        <tr
                                        
                                            key={
                                                index
                                            }
                                            style={{
                                                borderBottom:
                                                    "1px solid rgba(255,255,255,0.04)",
                                            }}
                                        >
                                            <td
                                                style={{
                                                    padding: "18px 20px",
                                                    color: "#cbd5e1",
                                                }}
                                            >
                                                {menu.owner?.nama_catering || "-"}
                                            </td>

                                            <td
    style={{
        padding: "18px 20px",
    }}
>
    <img
    src={`http://localhost:8000/storage/${menu.image}`}
    alt={menu.name}
    onClick={() =>
        setPreviewImage(
            `http://localhost:8000/storage/${menu.image}`
        )
    }
    style={{
        width: "60px",
        height: "60px",
        objectFit: "cover",
        borderRadius: "12px",
        cursor: "pointer",
        transition: "0.2s",
    }}
/>
</td>
                                            <td
                                                style={{
                                                    padding:
                                                        "18px 20px",
                                                    color:
                                                        "white",
                                                    fontWeight:
                                                        "600",
                                                }}
                                            >
                                                {
                                                    menu.name
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "18px 20px",
                                                    color:
                                                        "#cbd5e1",
                                                }}
                                            >
                                                {
                                                    menu.category
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "18px 20px",
                                                    color:
                                                        "white",
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

                                            <td
                                                style={{
                                                    padding:
                                                        "18px 20px",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        padding: "8px 14px",
                                                        borderRadius: "999px",
                                                        fontSize: "12px",
                                                        fontWeight: "700",
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
                                        colSpan={
                                            6
                                        }
                                        style={{
                                            padding:
                                                "80px 20px",
                                            textAlign:
                                                "center",
                                            color:
                                                "#64748b",
                                            fontSize:
                                                "15px",
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