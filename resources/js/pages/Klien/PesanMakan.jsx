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
    phone: "",
    alamat: "",
    jumlah: "",
    durasi: "",
    tanggal: "",
    jam: "",
    tema: "",
    catatan: "",
});

// setelah hargaProduk
const tanggalSelesai = useMemo(() => {
    if (!form.tanggal || !form.durasi) return "";

    const tgl = new Date(form.tanggal);
    tgl.setDate(tgl.getDate() + Number(form.durasi) - 1);

    return tgl.toISOString().split("T")[0];
}, [form.tanggal, form.durasi]);

useEffect(() => {
    const loadMenus = async () => {
        try {
            const res = await axios.get("/api/klien/menus");

            console.log(res.data[0]);

            setMenus(res.data);
        } catch (err) {
            console.log(err);
        }
    };

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
        !selectedMenu ||
        !selectedMenu.cateringLat ||
        !selectedMenu.cateringLng
    ) {
        return;
    }
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
    return Math.ceil(distanceKm) * 7000;
}, [distanceKm]);

const totalCourierFee = useMemo(() => {
    if (!courierFee) return 0;

    if (selectedType === "harian") {
        return courierFee * Number(form.durasi || 0);
    }

    return courierFee;
}, [courierFee, form.durasi, selectedType]);

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

        const courier = totalCourierFee;

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

    const hargaProduk = useMemo(() => {
    if (!selectedMenu || !form.jumlah) return 0;

    if (selectedType === "harian") {
        return (
            selectedMenu.price *
            Number(form.jumlah) *
            Number(form.durasi || 0)
        );
    }

    return (
        selectedMenu.price *
        Number(form.jumlah)
    );
}, [
    selectedMenu,
    form.jumlah,
    form.durasi,
    selectedType,
]);

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
                                            menu.category?.toLowerCase() === selectedType.toLowerCase()
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
                                        src={menu.image ? `/storage/${menu.image}` : "/no-image.png"}
                                        alt={menu.name}
                                        style={{
                                            width: "100%",
                                            height: "210px",
                                            objectFit: "cover",
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

                                                    <div style={{ color:"#60a5fa", marginBottom:"10px", fontSize:"14px" }}>
                                                                {menu.category}
                                                        </div>      

                                                    <div
                                                        style={{
                                                            color:"#fbbf24",
                                                            marginBottom:"16px",
                                                            fontSize:"14px"
                                                        }}
                                                    >
                                                        Minimal {menu.min_porsi} Porsi
                                                    </div>

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
                                                            onClick={() => {
                                                                console.log(menu);
                                                                setSelectedMenu(menu);
                                                            }}
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
                                        ? `/storage/${selectedMenu.image}`
                                        : "/no-image.png"
                                }
                                alt={selectedMenu.name}
                                style={{
                                    width: "100%",
                                    height: "320px",
                                    objectFit: "cover",
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
                                            color:"#cbd5e1",
                                            lineHeight:1.8,
                                            marginBottom:"20px",
                                        }}
                                    >
                                        {selectedMenu.description}
                                    </p>

                                    <div
                                        style={{
                                            background:"#0f172a",
                                            padding:"16px",
                                            borderRadius:"12px",
                                            marginBottom:"20px",
                                            color:"#fff",
                                        }}
                                    >
                                                                            <div style={{ marginBottom:"8px" }}>
                                        <strong>Nama Catering :</strong> {selectedMenu.owner}
                                    </div>

                                    <div>
                                        <strong>Alamat Catering :</strong> {selectedMenu.ownerAddress}
                                    </div>                 
                                    </div>

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

                                        <Input
                                        label="No Telepon"
                                        value={form.phone}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                phone: e.target.value,
                                            })
                                        }
                                    />

                                        {selectedType === "harian" ? (
                                        <>
                                            <Input
                                                label={`Jumlah Porsi (minimal ${selectedMenu.min_porsi})`}
                                                type="number"
                                                min={selectedMenu.min_porsi}
                                                value={form.jumlah}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        jumlah: e.target.value,
                                                    })
                                                }
                                            />

                                            <Input
                                                label="Durasi Langganan (Hari)"
                                                type="number"
                                                value={form.durasi}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        durasi: e.target.value,
                                                    })
                                                }
                                            />

                                            <Input
                                                label="Tanggal Mulai Langganan"
                                                type="date"
                                                value={form.tanggal}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        tanggal: e.target.value,
                                                    })
                                                }
                                            />

                                            <Input
                                                label="Tanggal Selesai Langganan"
                                                type="date"
                                                value={tanggalSelesai}
                                                readOnly
                                            />

                                            <Input
                                                label="Jam Pengiriman"
                                                type="time"
                                                value={form.jam}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        jam: e.target.value,
                                                    })
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
                                                    label="Jam Event"
                                                    type="time"
                                                    value={form.jam}
                                                    onChange={(e) =>
                                                        setForm({
                                                            ...form,
                                                            jam: e.target.value,
                                                        })
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


                                        {/* INFO */}
                                        <div
                                        style={{
                                            background:"#0f172a",
                                            padding:"24px",
                                            borderRadius:"20px",
                                            color:"#fff"
                                        }}
                                    >
                                        <h3
                                            style={{
                                                marginBottom:"20px",
                                                fontSize:"22px"
                                            }}
                                        >
                                            Ringkasan Pesanan
                                        </h3>

                                        <div style={{ marginBottom:"12px" }}>
                                            Harga Produk :
                                            <span
                                                style={{
                                                    float:"right",
                                                    color:"#fbbf24"
                                                }}
                                            >
                                                Rp {(hargaProduk || 0).toLocaleString("id-ID")}
                                            </span>
                                        </div>

                                      <div style={{ marginBottom: "12px" }}>
                                        Biaya Kurir :
                                        <span style={{ float: "right", color: "#fbbf24" }}>
                                            Rp {totalCourierFee.toLocaleString("id-ID")}
                                        </span>
                                    </div>

                                        <div style={{ marginBottom:"12px" }}>
                                            Jarak :
                                            <span style={{ float:"right" }}>
                                                {distanceKm
                                                    ? distanceKm.toFixed(1)
                                                    : 0} KM
                                            </span>
                                        </div>

                                        <div style={{ marginBottom:"12px" }}>
                                            Estimasi Sampai :
                                            <span style={{ float:"right" }}>
                                                {durationMinute || 0} Menit
                                            </span>
                                        </div>

                                        <hr
                                            style={{
                                                margin:"18px 0",
                                                borderColor:"#334155"
                                            }}
                                        />

                                        <div
                                            style={{
                                                fontSize:"24px",
                                                fontWeight:"bold"
                                            }}
                                        >
                                            Total Keseluruhan

                                            <span
                                                style={{
                                                    float:"right",
                                                    color:"#fbbf24"
                                                }}
                                            >
                                                Rp {(
                                                    selectedType === "harian"
                                                        ? totalHarian
                                                        : totalInsidentil
                                                ).toLocaleString("id-ID")}
                                            </span>
                                        </div>

                                        {selectedType === "insidentil" && (
                                            <div
                                                style={{
                                                    marginTop:"16px",
                                                    color:"#fbbf24"
                                                }}
                                            >
                                                DP 50% :
                                                Rp {dp.toLocaleString("id-ID")}
                                            </div>
                                        )}
                                    </div>
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
                                                try {
                                                    const user = JSON.parse(localStorage.getItem("user"));

                                                    if (!user?.id) {
                                                        alert("User tidak ditemukan, silakan login ulang");
                                                        return;
                                                    }

                                                    if (!selectedMenu) return;

                                                    if (Number(form.jumlah) < Number(selectedMenu.min_porsi)) {
                                                        alert(`Minimal pemesanan ${selectedMenu.min_porsi} porsi`);
                                                        return;
                                                    }

                                                    if (!clientLocation) {
                                                        alert("Alamat tidak valid");
                                                        return;
                                                    }

                                                    const courierFeeCalculated =
                                                        Math.ceil(distanceKm) * 7000;

                                                    const totalPrice =
                                                        selectedType === "harian"
                                                            ? selectedMenu.price * Number(form.jumlah) * Number(form.durasi) +
                                                            courierFeeCalculated * Number(form.durasi)
                                                            : selectedMenu.price * Number(form.jumlah) +
                                                            courierFeeCalculated;

                                               await axios.post("/api/klien/orders", {
                                                        client_id: user.id,

                                                        customer_name: form.nama,
                                                        phone: form.phone,
                                                        order_date: new Date().toISOString().split("T")[0],

                                                        type: selectedType,
                                                        menu_id: selectedMenu.id,
                                                        quantity: form.jumlah,

                                                        duration: selectedType === "harian" ? form.durasi : null,
                                                        event_date: selectedType === "insidentil" ? form.tanggal : null,
                                                        theme: selectedType === "insidentil" ? form.tema : null,

                                                        jam: form.jam,
                                                        notes: form.catatan,

                                                        address: form.alamat,
                                                        lat: clientLocation.lat,
                                                        lng: clientLocation.lng,

                                                        total_price: totalPrice,
                                                        courier_fee: courierFeeCalculated,
                                                    });

                                                    alert("Pesanan berhasil dibuat!");
                                                    window.location.href = "/klien/orders";

                                                } catch (err) {
                                                    console.error(err);
                                                    alert("Gagal membuat pesanan.");
                                                }
                                            }}
                                        >
                                            <FaShoppingCart /> Kirim Pesanan
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