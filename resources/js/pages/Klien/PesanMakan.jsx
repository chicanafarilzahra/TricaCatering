// resources/js/pages/Klien/PesanMakan.jsx

import React, { useMemo, useState } from "react";
import {
    FaArrowLeft,
    FaShoppingCart,
    FaMapMarkerAlt,
    FaInfoCircle,
    FaUtensils,
    FaUser,
} from "react-icons/fa";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

import SidebarKlien from "../../components/SidebarKlien";
import NavbarKlien from "../../components/NavbarKlien";

/* =========================================================
   FIX MARKER LEAFLET
========================================================= */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* =========================================================
   DUMMY DATA
========================================================= */

const cateringTypes = [
    {
        id: "harian",
        title: "Catering Harian",
        desc: "Menu makan harian sehat dan praktis",
    },
    {
        id: "insidentil",
        title: "Catering Insidentil",
        desc: "Pesanan catering untuk acara tertentu",
    },
];

const harianMenus = [
    {
        id: 1,
        name: "Nasi Ayam Crispy",
        owner: "Dapur Bu Siska",
        price: 28000,
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200&auto=format&fit=crop",
        description:
            "Nasi hangat dengan ayam crispy gurih, sambal, lalapan, dan sayur segar.",
    },
    {
        id: 2,
        name: "Nasi Rendang Padang",
        owner: "RM Padang Minang",
        price: 32000,
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
        description:
            "Rendang sapi empuk khas Padang lengkap dengan sambal dan sayur.",
    },
];

const insidentilMenus = [
    {
        id: 11,
        name: "Ayam Bakar Madu",
        owner: "Dapur Nusantara",
        price: 35000,
        image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=1200&auto=format&fit=crop",
        description:
            "Ayam bakar madu dengan bumbu rempah spesial dan aroma bakaran khas.",
    },
    {
        id: 12,
        name: "Sate Ayam",
        owner: "Sate Pak Joko",
        price: 30000,
        image: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=1200&auto=format&fit=crop",
        description:
            "Sate ayam empuk lengkap dengan bumbu kacang dan lontong.",
    },
];

export default function PesanMakan() {
    const [selectedType, setSelectedType] =
        useState(null);

    const [selectedMenu, setSelectedMenu] =
        useState(null);

    const [showDetail, setShowDetail] =
        useState(false);

    const [alamat, setAlamat] = useState("");

    const [form, setForm] = useState({
        nama: "",
        jumlah: "",
        durasi: "",
        tanggal: "",
        event: "",
        catatan: "",
    });

    const menus =
        selectedType === "harian"
            ? harianMenus
            : insidentilMenus;

    /* =========================================================
       LOKASI & ONGKIR DUMMY
    ========================================================= */

    const cateringLocation = {
        lat: -7.2575,
        lng: 112.7521,
    };

    const clientLocation = alamat
        ? {
              lat: -7.267,
              lng: 112.744,
          }
        : cateringLocation;

    const distanceKm = alamat ? 5 : 0;

    const ongkir = distanceKm * 10000;

    /* =========================================================
       TOTAL
    ========================================================= */

    const subtotal = useMemo(() => {
        if (!selectedMenu) return 0;

        if (selectedType === "harian") {
            if (
                !form.jumlah ||
                !form.durasi
            )
                return 0;

            return (
                selectedMenu.price *
                Number(form.jumlah) *
                Number(form.durasi)
            );
        }

        if (!form.jumlah) return 0;

        return (
            selectedMenu.price *
            Number(form.jumlah)
        );
    }, [form, selectedMenu, selectedType]);

    const total =
        selectedType === "harian"
            ? subtotal +
              ongkir *
                  Number(form.durasi || 0)
            : subtotal + ongkir;

    const dp =
        selectedType === "insidentil"
            ? total * 0.5
            : 0;

    /* ========================================================= */

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                overflow: "hidden",
                background: "#071028",
                fontFamily: "Times New Roman",
                fontWeight: "700",
            }}
        >
            <SidebarKlien />

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                <NavbarKlien title="Pesan Makan" />

                <div
                    className="hide-scrollbar"
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "24px",
                    }}
                >
                    {/* ================================================= */}
                    {/* PILIH TIPE */}
                    {/* ================================================= */}

                    {!selectedType && (
                        <>
                            <h1
                                style={{
                                    color: "#fff",
                                    fontSize: "38px",
                                    marginBottom:
                                        "24px",
                                }}
                            >
                                Pilih Tipe Catering
                            </h1>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit,minmax(320px,1fr))",
                                    gap: "24px",
                                }}
                            >
                                {cateringTypes.map(
                                    (item) => (
                                        <div
                                            key={
                                                item.id
                                            }
                                            style={{
                                                background:
                                                    "#182338",
                                                borderRadius:
                                                    "24px",
                                                padding:
                                                    "28px",
                                                border:
                                                    "1px solid rgba(255,255,255,0.05)",
                                            }}
                                        >
                                            <FaUtensils
                                                style={{
                                                    color:
                                                        "#60a5fa",
                                                    fontSize:
                                                        "46px",
                                                    marginBottom:
                                                        "18px",
                                                }}
                                            />

                                            <h2
                                                style={{
                                                    color:
                                                        "#fff",
                                                    fontSize:
                                                        "30px",
                                                    marginBottom:
                                                        "12px",
                                                }}
                                            >
                                                {
                                                    item.title
                                                }
                                            </h2>

                                            <p
                                                style={{
                                                    color:
                                                        "#94a3b8",
                                                    fontSize:
                                                        "16px",
                                                    lineHeight: 1.8,
                                                }}
                                            >
                                                {
                                                    item.desc
                                                }
                                            </p>

                                            <button
                                                onClick={() =>
                                                    setSelectedType(
                                                        item.id
                                                    )
                                                }
                                                style={{
                                                    width:
                                                        "100%",
                                                    height:
                                                        "54px",
                                                    marginTop:
                                                        "24px",
                                                    border:
                                                        "none",
                                                    borderRadius:
                                                        "16px",
                                                    background:
                                                        "linear-gradient(90deg,#2563eb,#3b82f6)",
                                                    color:
                                                        "#fff",
                                                    fontSize:
                                                        "17px",
                                                    cursor:
                                                        "pointer",
                                                    fontWeight:
                                                        "700",
                                                }}
                                            >
                                                Pilih
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        </>
                    )}

                    {/* ================================================= */}
                    {/* MENU */}
                    {/* ================================================= */}

                    {selectedType &&
                        !selectedMenu && (
                            <>
                                <button
                                    onClick={() =>
                                        setSelectedType(
                                            null
                                        )
                                    }
                                    style={
                                        backButton
                                    }
                                >
                                    <FaArrowLeft />
                                    Kembali
                                </button>

                                <h1
                                    style={{
                                        color:
                                            "#fff",
                                        fontSize:
                                            "38px",
                                        marginBottom:
                                            "24px",
                                    }}
                                >
                                    Menu{" "}
                                    {selectedType ===
                                    "harian"
                                        ? "Catering Harian"
                                        : "Catering Insidentil"}
                                </h1>

                                <div
                                    style={{
                                        display:
                                            "grid",
                                        gridTemplateColumns:
                                            "repeat(auto-fill,minmax(320px,1fr))",
                                        gap: "24px",
                                    }}
                                >
                                    {menus.map(
                                        (
                                            menu
                                        ) => (
                                            <div
                                                key={
                                                    menu.id
                                                }
                                                style={{
                                                    background:
                                                        "#182338",
                                                    borderRadius:
                                                        "24px",
                                                    overflow:
                                                        "hidden",
                                                }}
                                            >
                                                <img
                                                    src={
                                                        menu.image
                                                    }
                                                    alt={
                                                        menu.name
                                                    }
                                                    style={{
                                                        width:
                                                            "100%",
                                                        height:
                                                            "220px",
                                                        objectFit:
                                                            "cover",
                                                    }}
                                                />

                                                <div
                                                    style={{
                                                        padding:
                                                            "22px",
                                                    }}
                                                >
                                                    <h2
                                                        style={{
                                                            color:
                                                                "#fff",
                                                            fontSize:
                                                                "26px",
                                                            marginBottom:
                                                                "10px",
                                                        }}
                                                    >
                                                        {
                                                            menu.name
                                                        }
                                                    </h2>

                                                    <div
                                                        style={{
                                                            color:
                                                                "#94a3b8",
                                                            marginBottom:
                                                                "10px",
                                                        }}
                                                    >
                                                        Owner:
                                                        {" "}
                                                        {
                                                            menu.owner
                                                        }
                                                    </div>

                                                    <div
                                                        style={{
                                                            color:
                                                                "#22c55e",
                                                            fontSize:
                                                                "28px",
                                                            marginBottom:
                                                                "20px",
                                                        }}
                                                    >
                                                        Rp{" "}
                                                        {menu.price.toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </div>

                                                    <div
                                                        style={{
                                                            display:
                                                                "flex",
                                                            gap: "12px",
                                                        }}
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                setSelectedMenu(
                                                                    menu
                                                                );
                                                                setShowDetail(
                                                                    true
                                                                );
                                                            }}
                                                            style={
                                                                detailBtn
                                                            }
                                                        >
                                                            <FaInfoCircle />
                                                            Detail
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                setSelectedMenu(
                                                                    menu
                                                                );
                                                                setShowDetail(
                                                                    false
                                                                );
                                                            }}
                                                            style={
                                                                pesanBtn
                                                            }
                                                        >
                                                            <FaShoppingCart />
                                                            Pesan
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </>
                        )}

                    {/* ================================================= */}
                    {/* DETAIL */}
                    {/* ================================================= */}

                    {selectedMenu &&
                        showDetail && (
                            <>
                                <button
                                    onClick={() =>
                                        setSelectedMenu(
                                            null
                                        )
                                    }
                                    style={
                                        backButton
                                    }
                                >
                                    <FaArrowLeft />
                                    Kembali
                                </button>

                                <div
                                    style={{
                                        background:
                                            "#182338",
                                        borderRadius:
                                            "28px",
                                        overflow:
                                            "hidden",
                                    }}
                                >
                                    <img
                                        src={
                                            selectedMenu.image
                                        }
                                        alt={
                                            selectedMenu.name
                                        }
                                        style={{
                                            width:
                                                "100%",
                                            height:
                                                "340px",
                                            objectFit:
                                                "cover",
                                        }}
                                    />

                                    <div
                                        style={{
                                            padding:
                                                "28px",
                                        }}
                                    >
                                        <h1
                                            style={{
                                                color:
                                                    "#fff",
                                                fontSize:
                                                    "42px",
                                                marginBottom:
                                                    "16px",
                                            }}
                                        >
                                            {
                                                selectedMenu.name
                                            }
                                        </h1>

                                        <div
                                            style={{
                                                color:
                                                    "#94a3b8",
                                                marginBottom:
                                                    "18px",
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                gap: "10px",
                                            }}
                                        >
                                            <FaUser />
                                            Owner:
                                            {" "}
                                            {
                                                selectedMenu.owner
                                            }
                                        </div>

                                        <p
                                            style={{
                                                color:
                                                    "#cbd5e1",
                                                fontSize:
                                                    "17px",
                                                lineHeight: 1.9,
                                            }}
                                        >
                                            {
                                                selectedMenu.description
                                            }
                                        </p>

                                        <div
                                            style={{
                                                marginTop:
                                                    "24px",
                                                color:
                                                    "#22c55e",
                                                fontSize:
                                                    "34px",
                                            }}
                                        >
                                            Rp{" "}
                                            {selectedMenu.price.toLocaleString(
                                                "id-ID"
                                            )}
                                        </div>

                                        <button
                                            onClick={() =>
                                                setShowDetail(
                                                    false
                                                )
                                            }
                                            style={{
                                                ...pesanBtn,
                                                marginTop:
                                                    "28px",
                                                width:
                                                    "100%",
                                                height:
                                                    "58px",
                                            }}
                                        >
                                            <FaShoppingCart />
                                            Pesan
                                            Sekarang
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                    {/* ================================================= */}
                    {/* FORM */}
                    {/* ================================================= */}

                    {selectedMenu &&
                        !showDetail && (
                            <>
                                <button
                                    onClick={() =>
                                        setSelectedMenu(
                                            null
                                        )
                                    }
                                    style={
                                        backButton
                                    }
                                >
                                    <FaArrowLeft />
                                    Kembali
                                </button>

                                <div
                                    style={{
                                        background:
                                            "#182338",
                                        borderRadius:
                                            "28px",
                                        padding:
                                            "30px",
                                    }}
                                >
                                    <h1
                                        style={{
                                            color:
                                                "#fff",
                                            fontSize:
                                                "38px",
                                            marginBottom:
                                                "24px",
                                        }}
                                    >
                                        {selectedType ===
                                        "harian"
                                            ? "Detail Pesanan Harian"
                                            : "Detail Event"}
                                    </h1>

                                    <Input
                                        label="Nama Pemesan"
                                        value={
                                            form.nama
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setForm(
                                                {
                                                    ...form,
                                                    nama: e
                                                        .target
                                                        .value,
                                                }
                                            )
                                        }
                                    />

                                    <div
                                        style={{
                                            height:
                                                "18px",
                                        }}
                                    />

                                    <Input
                                        label="Alamat"
                                        icon={
                                            <FaMapMarkerAlt />
                                        }
                                        value={
                                            alamat
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setAlamat(
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                    />

                                    <div
                                        style={{
                                            height:
                                                "18px",
                                        }}
                                    />

                                    <div
                                        style={{
                                            height:
                                                "320px",
                                            borderRadius:
                                                "22px",
                                            overflow:
                                                "hidden",
                                        }}
                                    >
                                        <MapContainer
                                            center={[
                                                clientLocation.lat,
                                                clientLocation.lng,
                                            ]}
                                            zoom={
                                                13
                                            }
                                            style={{
                                                width:
                                                    "100%",
                                                height:
                                                    "100%",
                                            }}
                                        >
                                            <TileLayer
                                                attribution='&copy; OpenStreetMap'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />

                                            <Marker
                                                position={[
                                                    clientLocation.lat,
                                                    clientLocation.lng,
                                                ]}
                                            >
                                                <Popup>
                                                    Lokasi
                                                    Client
                                                </Popup>
                                            </Marker>
                                        </MapContainer>
                                    </div>

                                    <div
                                        style={{
                                            height:
                                                "18px",
                                        }}
                                    />

                                    <Input
                                        label="Jumlah Porsi"
                                        type="number"
                                        value={
                                            form.jumlah
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setForm(
                                                {
                                                    ...form,
                                                    jumlah:
                                                        e
                                                            .target
                                                            .value,
                                                }
                                            )
                                        }
                                    />

                                    {selectedType ===
                                    "harian" ? (
                                        <>
                                            <div
                                                style={{
                                                    height:
                                                        "18px",
                                                }}
                                            />

                                            <Input
                                                label="Durasi Langganan"
                                                type="number"
                                                value={
                                                    form.durasi
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setForm(
                                                        {
                                                            ...form,
                                                            durasi:
                                                                e
                                                                    .target
                                                                    .value,
                                                        }
                                                    )
                                                }
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                style={{
                                                    height:
                                                        "18px",
                                                }}
                                            />

                                            <Input
                                                label="Tanggal Event"
                                                type="date"
                                                value={
                                                    form.tanggal
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setForm(
                                                        {
                                                            ...form,
                                                            tanggal:
                                                                e
                                                                    .target
                                                                    .value,
                                                        }
                                                    )
                                                }
                                            />

                                            <div
                                                style={{
                                                    height:
                                                        "18px",
                                                }}
                                            />

                                            <Input
                                                label="Nama / Tema Event"
                                                value={
                                                    form.event
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setForm(
                                                        {
                                                            ...form,
                                                            event:
                                                                e
                                                                    .target
                                                                    .value,
                                                        }
                                                    )
                                                }
                                            />
                                        </>
                                    )}

                                    <div
                                        style={{
                                            marginTop:
                                                "26px",
                                            background:
                                                "#0f172a",
                                            borderRadius:
                                                "24px",
                                            padding:
                                                "24px",
                                        }}
                                    >
                                        <Row
                                            title="Harga per porsi"
                                            value={`Rp ${selectedMenu.price.toLocaleString(
                                                "id-ID"
                                            )}`}
                                        />

                                        <Row
                                            title="Subtotal makanan"
                                            value={`Rp ${subtotal.toLocaleString(
                                                "id-ID"
                                            )}`}
                                        />

                                        <Row
                                            title="Biaya kurir"
                                            value={`Rp ${ongkir.toLocaleString(
                                                "id-ID"
                                            )}`}
                                        />

                                        <Row
                                            title="TOTAL"
                                            value={`Rp ${total.toLocaleString(
                                                "id-ID"
                                            )}`}
                                            big
                                        />

                                        {selectedType ===
                                            "insidentil" && (
                                            <Row
                                                title="DP 50%"
                                                value={`Rp ${dp.toLocaleString(
                                                    "id-ID"
                                                )}`}
                                            />
                                        )}
                                    </div>

                                    <button
                                        style={{
                                            width:
                                                "100%",
                                            height:
                                                "58px",
                                            border:
                                                "none",
                                            borderRadius:
                                                "18px",
                                            marginTop:
                                                "26px",
                                            background:
                                                "linear-gradient(90deg,#2563eb,#3b82f6)",
                                            color:
                                                "#fff",
                                            fontSize:
                                                "18px",
                                            cursor:
                                                "pointer",
                                            fontWeight:
                                                "700",
                                        }}
                                    >
                                        {selectedType ===
                                        "harian"
                                            ? "Kirim Pesanan Harian"
                                            : "Ajukan Pesanan Insidentil"}
                                    </button>
                                </div>
                            </>
                        )}
                </div>
            </div>

            <style>
                {`
                    *{
                        margin:0;
                        padding:0;
                        box-sizing:border-box;
                        font-family:Times New Roman;
                        font-weight:700;
                    }

                    body{
                        overflow:hidden;
                        background:#071028;
                    }

                    .hide-scrollbar::-webkit-scrollbar{
                        display:none;
                    }

                    .leaflet-control-attribution{
                        display:none;
                    }
                `}
            </style>
        </div>
    );
}

/* ========================================================= */

function Input({
    label,
    icon,
    ...props
}) {
    return (
        <div>
            <div
                style={{
                    color: "#fff",
                    marginBottom: "10px",
                    fontSize: "17px",
                }}
            >
                {label}
            </div>

            <div
                style={{
                    position: "relative",
                }}
            >
                {icon && (
                    <div
                        style={{
                            position:
                                "absolute",
                            left: "16px",
                            top: "50%",
                            transform:
                                "translateY(-50%)",
                            color:
                                "#94a3b8",
                        }}
                    >
                        {icon}
                    </div>
                )}

                <input
                    {...props}
                    style={{
                        width: "100%",
                        height: "58px",
                        borderRadius:
                            "18px",
                        border:
                            "1px solid rgba(255,255,255,0.05)",
                        background:
                            "#0f172a",
                        color: "#fff",
                        padding: icon
                            ? "0 18px 0 48px"
                            : "0 18px",
                        outline: "none",
                        fontSize: "15px",
                    }}
                />
            </div>
        </div>
    );
}

function Row({
    title,
    value,
    big,
}) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent:
                    "space-between",
                marginBottom: "16px",
                color: "#fff",
                fontSize: big
                    ? "28px"
                    : "18px",
            }}
        >
            <span>{title}</span>
            <span>{value}</span>
        </div>
    );
}

/* ========================================================= */

const backButton = {
    height: "48px",
    padding: "0 18px",
    border: "none",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    marginBottom: "24px",
    fontSize: "15px",
};

const detailBtn = {
    flex: 1,
    height: "48px",
    border: "none",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    fontSize: "15px",
};

const pesanBtn = {
    flex: 1,
    height: "48px",
    border: "none",
    borderRadius: "14px",
    background:
        "linear-gradient(90deg,#2563eb,#3b82f6)",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    fontSize: "15px",
};