// resources/js/pages/Klien/PesanMakan.jsx

import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FaArrowLeft,
    FaClock,
    FaMapMarkerAlt,
    FaMotorcycle,
    FaShoppingCart,
    FaUtensils,
    FaUserTie,
} from "react-icons/fa";

import axios from "axios";
import NavbarKlien from "../../components/NavbarKlien";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap,
} from "react-leaflet";

import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

/*
|--------------------------------------------------------------------------
| FIX MARKER LEAFLET
|--------------------------------------------------------------------------
*/

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/*
|--------------------------------------------------------------------------
| DUMMY DATA
|--------------------------------------------------------------------------
*/

const cateringTypes = [
    {
        id: "harian",
        title: "Catering Harian",
        description:
            "Catering harian untuk makan siang dan makan malam dengan sistem langganan harian.",
    },
    {
        id: "insidentil",
        title: "Catering Insidentil",
        description:
            "Catering khusus acara seperti ulang tahun, rapat, gathering, dan pernikahan.",
    },
];


/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export default function PesanMakan() {
    const [selectedType, setSelectedType] =
        useState(null);

    const [selectedMenu, setSelectedMenu] =
        useState(null);
    
    const [menus, setMenus] = useState([]);

    const [clientLocation, setClientLocation] =
        useState(null);

    const [distanceKm, setDistanceKm] =
        useState(0);

    const [durationMinute, setDurationMinute] =
        useState(0);
    
    const [routeCoords, setRouteCoords] =
    useState([]);
    

    const [form, setForm] = useState({
    nama: "",
    alamat: "",
    jumlah: "",
    durasi: "",
    tanggal: "",
    tema: "",
    catatan: "",
});

const loadMenus = async () => {
    try {
        const res = await axios.get(
            "/api/klien/menus"
        );

        setMenus(res.data);
    } catch (error) {
        console.log(error);
    }
};

useEffect(() => {
    loadMenus();
}, []);

    /*
    |--------------------------------------------------------------------------
    | GEOCODING ALAMAT
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!form.alamat) return;

            fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    form.alamat
                )}`
            )
                .then((res) => res.json())
                .then((data) => {
                    if (data && data[0]) {
                        const lat = parseFloat(
                            data[0].lat
                        );

                        const lng = parseFloat(
                            data[0].lon
                        );

                        setClientLocation({
                            lat,
                            lng,
                        });
                    }
                });
        }, 1000);

        return () => clearTimeout(timer);
    }, [form.alamat]);

    /*
    |--------------------------------------------------------------------------
    | HITUNG JARAK
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
    if (
        !clientLocation ||
        !selectedMenu
    )
        return;

    const start =
        `${selectedMenu.cateringLng},${selectedMenu.cateringLat}`;

    const end =
        `${clientLocation.lng},${clientLocation.lat}`;

    fetch(
        `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`
    )
        .then((res) => res.json())
        .then((data) => {
            if (
                data.routes &&
                data.routes.length > 0
            ) {
                const route =
                    data.routes[0];

                const distance =
                    route.distance / 1000;

                const duration =
                    route.duration / 60;

                setDistanceKm(distance);

                setDurationMinute(
                    Math.round(duration)
                );

                const coords =
                    route.geometry.coordinates.map(
                        (item) => [
                            item[1],
                            item[0],
                        ]
                    );

                setRouteCoords(coords);
            }
        });
}, [clientLocation, selectedMenu]);

    /*
    |--------------------------------------------------------------------------
    | BIAYA KURIR
    |--------------------------------------------------------------------------
    */

    const courierFee = useMemo(() => {
        if (!distanceKm) return 0;

        return Math.ceil(distanceKm) * 10000;
    }, [distanceKm]);

    /*
    |--------------------------------------------------------------------------
    | TOTAL HARIAN
    |--------------------------------------------------------------------------
    */

    const totalHarian = useMemo(() => {
        if (
            !selectedMenu ||
            !form.jumlah ||
            !form.durasi
        )
            return 0;

        const subtotal =
            selectedMenu.price *
            Number(form.jumlah) *
            Number(form.durasi);

        const courier =
            courierFee *
            Number(form.durasi);

        return subtotal + courier;
    }, [
        selectedMenu,
        form.jumlah,
        form.durasi,
        courierFee,
    ]);

    /*
    |--------------------------------------------------------------------------
    | TOTAL INSIDENTIL
    |--------------------------------------------------------------------------
    */

    const totalInsidentil = useMemo(() => {
        if (
            !selectedMenu ||
            !form.jumlah
        )
            return 0;

        const subtotal =
            selectedMenu.price *
            Number(form.jumlah);

        return subtotal + courierFee;
    }, [
        selectedMenu,
        form.jumlah,
        courierFee,
    ]);

    const dp =
        totalInsidentil * 0.5;

    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (
        <div
            style={{
                width: "100%",
                minHeight: "100vh",
                background: "#071028",
                fontFamily:
                    '"Times New Roman", serif',
                fontWeight: "700",
            }}
        >

          <div
            style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
                <NavbarKlien title="Pesan Makan" />

                <div
                    className="hide-scrollbar"
                    style={{
                        height: "calc(100vh - 70px)", // sesuaikan tinggi navbar
                        overflowY: "auto",
                        padding: "22px",
                        scrollbarWidth: "none", // Firefox
                        msOverflowStyle: "none", // IE & Edge lama
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
                                    fontSize: "36px",
                                    marginBottom:
                                        "8px",
                                }}
                            >
                                Pilih Tipe Catering
                            </h1>

                            <p
                                style={{
                                    color:
                                        "#94a3b8",
                                    marginBottom:
                                        "24px",
                                    fontSize:
                                        "16px",
                                }}
                            >
                                Pilih jenis
                                catering sesuai
                                kebutuhan Anda
                            </p>

                            <div
                                style={{
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit,minmax(320px,1fr))",
                                    gap: "22px",
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
                                                    "26px",
                                                padding:
                                                    "28px",
                                                border:
                                                    "1px solid rgba(255,255,255,0.05)",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width:
                                                        "70px",
                                                    height:
                                                        "70px",
                                                    borderRadius:
                                                        "20px",
                                                    background:
                                                        "rgba(37,99,235,0.15)",
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    color:
                                                        "#60a5fa",
                                                    fontSize:
                                                        "28px",
                                                    marginBottom:
                                                        "22px",
                                                }}
                                            >
                                                <FaUtensils />
                                            </div>

                                            <h2
                                                style={{
                                                    color:
                                                        "#fff",
                                                    fontSize:
                                                        "28px",
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
                                                    lineHeight: 1.7,
                                                    fontSize:
                                                        "15px",
                                                }}
                                            >
                                                {
                                                    item.description
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
                                                    border:
                                                        "none",
                                                    borderRadius:
                                                        "16px",
                                                    marginTop:
                                                        "22px",
                                                    background:
                                                        "linear-gradient(90deg,#2563eb,#3b82f6)",
                                                    color:
                                                        "#fff",
                                                    fontSize:
                                                        "16px",
                                                    cursor:
                                                        "pointer",
                                                    fontWeight:
                                                        "700",
                                                }}
                                            >
                                                Pilih
                                                Catering
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
                                        backStyle
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
                                            "34px",
                                        marginBottom:
                                            "24px",
                                    }}
                                >
                                    Menu Catering
                                </h1>

                                <div
                                    style={{
                                        display:
                                            "grid",
                                        gridTemplateColumns:
                                            "repeat(auto-fit,minmax(300px,1fr))",
                                        gap: "22px",
                                    }}
                                >
                                   {menus
                                    .filter(
                                        (menu) =>
                                            menu.category?.toLowerCase() ===
                                            selectedType.toLowerCase()
                                    )
                                    .map((menu) => (
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
                                                            ? `/storage/${menu.image}`
                                                            : "/no-image.png"
                                                    }
                                                    alt=""
                                                    style={{
                                                        width:
                                                            "100%",
                                                        height:
                                                            "210px",
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
                                                                "24px",
                                                            marginBottom:
                                                                "14px",
                                                        }}
                                                    >
                                                        {
                                                            menu.name
                                                        }
                                                    </h2>

                                                    <div
                                                        style={{
                                                            color:
                                                                "#22c55e",
                                                            fontSize:
                                                                "28px",
                                                            marginBottom:
                                                                "18px",
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
                                                            onClick={() =>
                                                                setSelectedMenu(
                                                                    menu
                                                                )
                                                            }
                                                            style={
                                                                primaryButton
                                                            }
                                                        >
                                                            Detail
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
                    {/* DETAIL + FORM */}
                    {/* ================================================= */}

                    {selectedMenu && (
                        <div
                            style={{
                                maxWidth:
                                    "1100px",
                                margin:
                                    "0 auto",
                            }}
                        >
                            <button
                                onClick={() =>
                                    setSelectedMenu(
                                        null
                                    )
                                }
                                style={
                                    backStyle
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
                                    alt=""
                                    style={{
                                        width:
                                            "100%",
                                        height:
                                            "320px",
                                        objectFit:
                                            "cover",
                                    }}
                                />

                                <div
                                    style={{
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
                                                "18px",
                                        }}
                                    >
                                        {
                                            selectedMenu.name
                                        }
                                    </h1>

                                    <p
                                        style={{
                                            color:
                                                "#cbd5e1",
                                            lineHeight: 1.8,
                                            marginBottom:
                                                "20px",
                                        }}
                                    >
                                        {selectedMenu.description}
                                    </p>

                                    {/* FORM */}
                                    <div
                                        style={{
                                            display:
                                                "grid",
                                            gap: "18px",
                                        }}
                                    >
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

                                        {selectedType ===
                                        "harian" ? (
                                            <>
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

                                                <Input
                                                    label="Tema Event"
                                                    value={
                                                        form.tema
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        setForm(
                                                            {
                                                                ...form,
                                                                tema: e
                                                                    .target
                                                                    .value,
                                                            }
                                                        )
                                                    }
                                                />
                                            </>
                                        )}

                                        <Input
                                            label="Alamat Pengiriman"
                                            value={
                                                form.alamat
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setForm(
                                                    {
                                                        ...form,
                                                        alamat:
                                                            e
                                                                .target
                                                                .value,
                                                    }
                                                )
                                            }
                                        />

                                        {/* MAP */}
                                        {clientLocation && (
                                            <div
                                                style={{
                                                    overflow:
                                                        "hidden",
                                                    borderRadius:
                                                        "24px",
                                                }}
                                            >
                                                <MapContainer
                                                    center={[
                                                        selectedMenu.cateringLat,
                                                        selectedMenu.cateringLng,
                                                    ]}
                                                    zoom={
                                                        12
                                                    }
                                                    style={{
                                                        height:
                                                            "400px",
                                                        width:
                                                            "100%",
                                                    }}
                                                >
                                                    <TileLayer
                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    />

                                                    <Marker
                                                        position={[
                                                            selectedMenu.cateringLat,
                                                            selectedMenu.cateringLng,
                                                        ]}
                                                    >
                                                        <Popup>
                                                            Lokasi
                                                            Catering
                                                        </Popup>
                                                    </Marker>

                                                    <Marker
                                                        position={[
                                                            clientLocation.lat,
                                                            clientLocation.lng,
                                                        ]}
                                                    >
                                                        <Popup>
                                                            Lokasi
                                                            Klien
                                                        </Popup>
                                                    </Marker>

                                                    {routeCoords.length > 0 && (
                                                            <Polyline
                                                                positions={routeCoords}
                                                                pathOptions={{
                                                                    color: "#2563eb",
                                                                    weight: 6,
                                                                }}
                                                            />
                                                        )}

                                                    <MapFly
                                                        lat={
                                                            clientLocation.lat
                                                        }
                                                        lng={
                                                            clientLocation.lng
                                                        }
                                                    />
                                                </MapContainer>
                                            </div>
                                        )}

                                        {/* INFO */}
                                        {distanceKm >
                                            0 && (
                                            <div
                                                style={{
                                                    background:
                                                        "#0f172a",
                                                    padding:
                                                        "24px",
                                                    borderRadius:
                                                        "22px",
                                                    color:
                                                        "#fff",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        marginBottom:
                                                            "14px",
                                                    }}
                                                >
                                                    Jarak Rute Jalan :
                                                    {" "}
                                                    <span
                                                        style={{
                                                            color:
                                                                "#60a5fa",
                                                        }}
                                                    >
                                                        {distanceKm.toFixed(
                                                            1
                                                        )} KM
                                                    </span>
                                                </div>
                                                
                                                <div
                                                    style={{
                                                        marginBottom:
                                                            "14px",
                                                    }}
                                                >
                                                    Estimasi
                                                    Tiba :
                                                    {" "}
                                                    <span
                                                        style={{
                                                            color:
                                                                "#60a5fa",
                                                        }}
                                                    >
                                                        {
                                                            durationMinute
                                                        }{" "}
                                                        Menit
                                                    </span>
                                                </div>

                                                <div
                                                    style={{
                                                        marginBottom:
                                                            "14px",
                                                    }}
                                                >
                                                    Biaya
                                                    Kurir :
                                                    {" "}
                                                    <span
                                                        style={{
                                                            color:
                                                                "#22c55e",
                                                        }}
                                                    >
                                                        Rp{" "}
                                                        {courierFee.toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </span>
                                                </div>

                                                <div
                                                    style={{
                                                        fontSize:
                                                            "28px",
                                                        color:
                                                            "#fff",
                                                    }}
                                                >
                                                    TOTAL
                                                    :
                                                    {" "}
                                                    <span
                                                        style={{
                                                            color:
                                                                "#22c55e",
                                                        }}
                                                    >
                                                        Rp{" "}
                                                        {(
                                                            selectedType ===
                                                            "harian"
                                                                ? totalHarian
                                                                : totalInsidentil
                                                        ).toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </span>
                                                </div>

                                                {selectedType ===
                                                    "insidentil" && (
                                                    <div
                                                        style={{
                                                            marginTop:
                                                                "16px",
                                                            color:
                                                                "#fbbf24",
                                                        }}
                                                    >
                                                        DP
                                                        50%
                                                        :
                                                        Rp{" "}
                                                        {dp.toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <button
                                            style={{
                                                height: "58px",
                                                border: "none",
                                                borderRadius: "18px",
                                                background: "linear-gradient(90deg,#2563eb,#3b82f6)",
                                                color: "#fff",
                                                fontSize: "16px",
                                                cursor: "pointer",
                                            }}
                                            onClick={async () => {
                                                if (!selectedMenu) return;

                                                try {
                                                    const res = await axios.post('/api/klien/orders', {
                                                        type: selectedType,
                                                        menu_id: selectedMenu.id,
                                                        quantity: form.jumlah,
                                                        duration: selectedType === 'harian' ? form.durasi : null,
                                                        event_date: selectedType === 'insidentil' ? form.tanggal : null,
                                                        theme: selectedType === 'insidentil' ? form.tema : null,
                                                        notes: form.catatan,
                                                        address: form.alamat,
                                                        lat: clientLocation.lat,
                                                        lng: clientLocation.lng,
                                                        total_price: selectedType === 'harian' ? totalHarian : totalInsidentil,
                                                        courier_fee: courierFee,
                                                    });

                                                    alert('Pesanan berhasil dibuat!');
                                                    // redirect ke invoice atau reset form
                                                } catch (err) {
                                                    console.error(err);
                                                    alert('Gagal membuat pesanan.');
                                                }
                                            }}
                                        >
                                            <FaShoppingCart /> {selectedType === "harian" ? "Kirim Pesanan Harian" : "Ajukan Pesanan Insidentil"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>
                {`
                    *{
                        margin:0;
                        padding:0;
                        box-sizing:border-box;
                        font-family:'Times New Roman',serif;
                        font-weight:700;
                    }

                    body{
                        overflow:auto;
                        background:#071028;
                    }
                    .hide-scrollbar{
                            scrollbar-width:none;
                            -ms-overflow-style:none;
                        }

                        .hide-scrollbar::-webkit-scrollbar{
                            width:0;
                            height:0;
                            display:none;
                        }
                `}
            </style>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| INPUT
|--------------------------------------------------------------------------
*/

function Input({
    label,
    ...props
}) {
    return (
        <div>
            <label
                style={{
                    display: "block",
                    marginBottom: "10px",
                    color: "#fff",
                    fontSize: "16px",
                }}
            >
                {label}
            </label>

            <input
                {...props}
                style={{
                    width: "100%",
                    height: "58px",
                    borderRadius: "18px",
                    border:
                        "1px solid rgba(255,255,255,0.05)",
                    background: "#0f172a",
                    padding: "0 18px",
                    color: "#fff",
                    outline: "none",
                    fontSize: "15px",
                }}
            />
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| MAP FLY
|--------------------------------------------------------------------------
*/

function MapFly({
    lat,
    lng,
}) {
    const map = useMap();

    useEffect(() => {
        map.flyTo([lat, lng], 13);
    }, [lat, lng]);

    return null;
}

/*
|--------------------------------------------------------------------------
| STYLE
|--------------------------------------------------------------------------
*/

const primaryButton = {
    flex: 1,
    height: "50px",
    border: "none",
    borderRadius: "14px",
    background:
        "linear-gradient(90deg,#2563eb,#3b82f6)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "15px",
};

const backStyle = {
    height: "48px",
    border: "none",
    padding: "0 18px",
    borderRadius: "14px",
    background:
        "rgba(255,255,255,0.08)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    marginBottom: "24px",
};