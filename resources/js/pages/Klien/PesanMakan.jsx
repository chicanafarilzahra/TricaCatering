// resources/js/pages/Klien/PesanMakan.jsx

import React, { useEffect, useMemo, useState, useRef } from "react";
import {
    FaArrowLeft,
    FaShoppingCart,
    FaSearch,
    FaMapMarkerAlt,
    FaClock,
    FaUniversity,
    FaWallet,
    FaCheck,
    FaUtensils,
    FaTrash,
    FaUpload,
    FaImage,
    FaExclamationTriangle,
    FaHourglassHalf,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarKlien from "../../components/NavbarKlien";

/*
|--------------------------------------------------------------------------
| CONSTANTS
|--------------------------------------------------------------------------
*/

const CATEGORIES = [
    { id: "all", label: "Semua" },
    { id: "harian", label: "Harian" },
    { id: "insidentil", label: "Insidentil" },
];

const PAYMENT_DURATION_SECONDS = 5 * 60; // 5 menit

/*
|--------------------------------------------------------------------------
| COMPONENT UTAMA
|--------------------------------------------------------------------------
*/

export default function PesanMakan() {
    const [selectedType, setSelectedType] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [menus, setMenus] = useState([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("default");

    const [clientLocation, setClientLocation] = useState(null);
    const [distanceKm, setDistanceKm] = useState(0);
    const [durationMinute, setDurationMinute] = useState(0);
    const navigate = useNavigate();
    const [geoStatus, setGeoStatus] = useState("idle"); // idle | searching | found | notfound

    const [payMethod, setPayMethod] = useState(null); // 'bank' | 'ewallet'
    const [payOption, setPayOption] = useState(null); // id akun pembayaran milik catering terkait

    // ===== Bukti Pembayaran & Timer 15 Menit =====
    const [buktiBayar, setBuktiBayar] = useState(null); // File
    const [buktiBayarPreview, setBuktiBayarPreview] = useState(null);
    const [paymentDeadline, setPaymentDeadline] = useState(null); // timestamp ms
    const [timeLeft, setTimeLeft] = useState(null); // detik
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        nama: "",
        phone: "",
        alamat: "",
        jumlah: "",
        durasi: "",
        tanggalMulai: "",
        tanggal: "",
        jam: "",
        tema: "",
        catatan: "",
    });

    const geoTimerRef = useRef(null);

    /*
    |--------------------------------------------------------------------------
    | LOAD MENUS
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const load = async () => {
            try {
                const res = await axios.get("/klien/menus");
                setMenus(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        load();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | RESET STATE SAAT GANTI TIPE CATERING
    | (mencegah menu/pembayaran dari tipe sebelumnya "nempel"
    | ketika pindah dari Harian -> Insidentil atau sebaliknya)
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        setSelectedMenu(null);
        setPayMethod(null);
        setPayOption(null);
        setSearch("");
        setSortBy("default");
        resetPaymentProof();
        setForm((f) => ({
            ...f,
            jumlah: "",
            durasi: "",
            tanggalMulai: "",
            tanggal: "",
            jam: "",
            tema: "",
        }));
    }, [selectedType]);

    /*
    |--------------------------------------------------------------------------
    | GEOCODING ALAMAT
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
    console.log("🔍 form.alamat berubah:", form.alamat);   // TAMBAHIN
    if (geoTimerRef.current) clearTimeout(geoTimerRef.current);
    if (!form.alamat) {
        setGeoStatus("idle");
        setClientLocation(null);
        return;
    }

    // alamat lengkap minimal punya beberapa kata (jalan, kelurahan, kecamatan, dst)
    // supaya geocoding tidak menembak alamat yang masih setengah jalan diketik
    if (form.alamat.trim().length < 8) {
        setGeoStatus("idle");
        return;
    }

    setGeoStatus("searching");

    geoTimerRef.current = setTimeout(() => {
        console.log("📡 mengirim request geocode...");   // TAMBAHIN
        axios.get("/klien/geocode", { params: { q: form.alamat } })
            .then((res) => {
                console.log("✅ response geocode:", res.data);   // TAMBAHIN
                if (res.data?.found) {
                    setClientLocation({
                        lat: res.data.lat,
                        lng: res.data.lng,
                    });
                    setGeoStatus("found");
                } else {
                    setClientLocation(null);
                    setGeoStatus("notfound");
                }
            })
            .catch((err) => {
                console.error("❌ Geocode error:", err.response?.data || err.message);
                setClientLocation(null);
                setGeoStatus("notfound");
            });
    }, 1200);

    return () => clearTimeout(geoTimerRef.current);
}, [form.alamat]);
    /*
    |--------------------------------------------------------------------------
    | HITUNG JARAK
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
    console.log("🚚 cek jarak — clientLocation:", clientLocation, "selectedMenu:", selectedMenu);
    if (!clientLocation || !selectedMenu?.cateringLat || !selectedMenu?.cateringLng) {
        console.log("⛔ berhenti — data belum lengkap");
        return;
    }
    console.log("📡 mengirim request route...");
    axios.get("/klien/route", {
        params: {
            from_lat: selectedMenu.cateringLat,
            from_lng: selectedMenu.cateringLng,
            to_lat: clientLocation.lat,
            to_lng: clientLocation.lng,
        },
    })
        .then((res) => {
            console.log("✅ response route:", res.data);
            if (res.data?.found) {
                setDistanceKm(res.data.distance_km);
                setDurationMinute(res.data.duration_minute);
            }
        })
        .catch((err) => {
            console.error("❌ Route error:", err.response?.data || err.message);
        });
}, [clientLocation, selectedMenu]);

    /*
    |--------------------------------------------------------------------------
    | TIMER 15 MENIT PROSES PEMBAYARAN
    | (mulai otomatis begitu klien sudah memilih metode + akun pembayaran,
    | artinya form pemesanan sudah lengkap diisi)
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (payMethod && payOption && !paymentDeadline) {
            setPaymentDeadline(Date.now() + PAYMENT_DURATION_SECONDS * 1000);
        }
    }, [payMethod, payOption, paymentDeadline]);

    useEffect(() => {
        if (!paymentDeadline) {
            setTimeLeft(null);
            return;
        }
        const tick = () => {
            const remaining = Math.max(0, Math.round((paymentDeadline - Date.now()) / 1000));
            setTimeLeft(remaining);
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [paymentDeadline]);

    const isPaymentExpired = paymentDeadline !== null && timeLeft === 0;

    const formatTimeLeft = (seconds) => {
        if (seconds === null || seconds === undefined) return "--:--";
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const resetPaymentProof = () => {
        setBuktiBayar(null);
        setBuktiBayarPreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        setPaymentDeadline(null);
        setTimeLeft(null);
    };

    const handleBuktiBayarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            alert("File bukti pembayaran harus berupa gambar (jpg/png).");
            return;
        }
        setBuktiBayar(file);
        setBuktiBayarPreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(file);
        });
    };

    const handleRestartPaymentTimer = () => {
        // batalkan pilihan akun pembayaran supaya klien pilih ulang & timer baru dimulai
        resetPaymentProof();
        setPayOption(null);
    };

    /*
    |--------------------------------------------------------------------------
    | KALKULASI
    |--------------------------------------------------------------------------
    */

    const COURIER_RATE_PER_KM = 5000; // Rp 5.000/km

    const courierFee = useMemo(
    () => Math.round(distanceKm * 10) / 10 * COURIER_RATE_PER_KM,
    [distanceKm]
);

    const totalCourierFee = useMemo(() => {
    if (!courierFee) return 0;
    if (selectedType === "harian") return courierFee * Number(form.durasi || 0);
    return courierFee;
}, [courierFee, form.durasi, selectedType]);

    const hargaProduk = useMemo(() => {
        if (!selectedMenu || !form.jumlah) return 0;
        if (selectedType === "harian")
            return selectedMenu.price * Number(form.jumlah) * Number(form.durasi || 0);
        return selectedMenu.price * Number(form.jumlah);
    }, [selectedMenu, form.jumlah, form.durasi, selectedType]);

    const totalHarian = useMemo(
        () => hargaProduk + totalCourierFee,
        [hargaProduk, totalCourierFee]
    );

    const totalInsidentil = useMemo(() => {
        if (!selectedMenu || !form.jumlah) return 0;
        return selectedMenu.price * Number(form.jumlah) + courierFee;
    }, [selectedMenu, form.jumlah, courierFee]);

    const grandTotal = selectedType === "harian" ? totalHarian : totalInsidentil;
    // Catering harian = wajib lunas 100% (tanpa DP).
    // Catering insidentil = DP 50% saat pemesanan, sisanya dilunasi via invoice
    // setelah pesanan di-approve (lihat halaman Invoice).
    const dp = totalInsidentil * 0.5;
    const jumlahYangHarusDibayarSekarang = selectedType === "harian" ? totalHarian : dp;

    const tanggalSelesai = useMemo(() => {
        if (!form.tanggalMulai || !form.durasi) return "";
        const d = new Date(form.tanggalMulai);
        d.setDate(d.getDate() + Number(form.durasi) - 1);
        return d.toISOString().split("T")[0];
    }, [form.tanggalMulai, form.durasi]);

    // Tanggal hari ini, dipakai sebagai batas minimal tanggal mulai / tanggal event
    // (poin 4: tanggal pengiriman pertama mengikuti tanggal pemesanan, jadi
    // klien tidak boleh memilih tanggal yang sudah lewat)
    const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

    /*
    |--------------------------------------------------------------------------
    | FILTER MENUS
    |--------------------------------------------------------------------------
    */

    const filteredMenus = useMemo(() => {
        let m = menus.filter(
            (x) => x.category?.toLowerCase() === selectedType?.toLowerCase()
        );
        if (search.trim())
            m = m.filter((x) => x.name?.toLowerCase().includes(search.toLowerCase()));

        if (sortBy === "termurah") m = [...m].sort((a, b) => a.price - b.price);
        else if (sortBy === "termahal") m = [...m].sort((a, b) => b.price - a.price);
        else if (sortBy === "minporsi") m = [...m].sort((a, b) => a.min_porsi - b.min_porsi);

        return m;
    }, [menus, selectedType, search, sortBy]);

    /*
    |--------------------------------------------------------------------------
    | KELOMPOKKAN MENU PER CATERING
    | (biar menu antar catering tidak tercampur jadi satu daftar)
    |--------------------------------------------------------------------------
    */

    const groupedMenus = useMemo(() => {
        const groups = {};
        const order = [];

        filteredMenus.forEach((m) => {
            const key = m.catering_id ?? m.owner ?? "lainnya";
            if (!groups[key]) {
                groups[key] = {
                    key,
                    ownerName: m.owner || "Catering",
                    ownerAddress: m.ownerAddress || "",
                    items: [],
                };
                order.push(key);
            }
            groups[key].items.push(m);
        });

        return order.map((key) => groups[key]);
    }, [filteredMenus]);

    /*
    |--------------------------------------------------------------------------
    | DATA PEMBAYARAN (REAL, MILIK CATERING YANG DIPILIH)
    |--------------------------------------------------------------------------
    */

    const paymentAccounts = selectedMenu?.payment_accounts || [];
    const bankAccounts = useMemo(
        () => paymentAccounts.filter((p) => p.type === "bank"),
        [paymentAccounts]
    );
    const ewalletAccounts = useMemo(
        () => paymentAccounts.filter((p) => p.type === "ewallet"),
        [paymentAccounts]
    );

    /*
    |--------------------------------------------------------------------------
    | HAPUS MENU YANG SUDAH DIPILIH
    |--------------------------------------------------------------------------
    */

    const handleRemoveMenu = () => {
        setSelectedMenu(null);
        setPayMethod(null);
        setPayOption(null);
        resetPaymentProof();
        setForm((f) => ({
            ...f,
            jumlah: "",
            durasi: "",
            tanggalMulai: "",
            tanggal: "",
            jam: "",
            tema: "",
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.id) { alert("Silakan login ulang"); return; }
        if (!selectedMenu) return;
        if (Number(form.jumlah) < Number(selectedMenu.min_porsi)) {
            alert(`Minimal ${selectedMenu.min_porsi} porsi`); return;
        }
        if (!clientLocation) { alert("Alamat tidak valid atau belum ditemukan. Mohon masukkan alamat lengkap (jalan, kelurahan, kecamatan, kabupaten/kota)."); return; }

        // Validasi tanggal tidak boleh di masa lalu (poin 4)
        if (selectedType === "harian" && form.tanggalMulai && form.tanggalMulai < todayStr) {
            alert("Tanggal mulai tidak boleh sebelum hari ini."); return;
        }
        if (selectedType === "insidentil" && form.tanggal && form.tanggal < todayStr) {
            alert("Tanggal event tidak boleh sebelum hari ini."); return;
        }

        if (!payMethod) { alert("Pilih metode pembayaran"); return; }
        if (!payOption) { alert(`Pilih ${payMethod === "bank" ? "rekening bank" : "e-wallet"} tujuan`); return; }

        if (isPaymentExpired) {
            alert("Waktu 15 menit untuk menyelesaikan pembayaran sudah habis. Silakan pilih ulang metode pembayaran.");
            return;
        }
        if (!buktiBayar) {
            alert("Mohon unggah foto/screenshot bukti pembayaran terlebih dahulu.");
            return;
        }

        const selectedAccount = [...bankAccounts, ...ewalletAccounts].find(
            (a) => a.id === payOption
        );

        const courierFeeCalc = Math.ceil(distanceKm) * 7000;
        const totalPrice =
            selectedType === "harian"
                ? selectedMenu.price * Number(form.jumlah) * Number(form.durasi) +
                  courierFeeCalc * Number(form.durasi)
                : selectedMenu.price * Number(form.jumlah) + courierFeeCalc;

        const amountPaidNow = selectedType === "harian" ? totalPrice : totalPrice * 0.5;

        try {
            setSubmitting(true);

            const payload = new FormData();
            payload.append("client_id", user.id);
            payload.append("customer_name", form.nama);
            payload.append("phone", form.phone);
            payload.append("order_date", new Date().toISOString().split("T")[0]);
            payload.append("type", selectedType);
            payload.append("menu_id", selectedMenu.id);
            payload.append("owner_id", selectedMenu.catering_id);
            payload.append("quantity", form.jumlah);
            if (selectedType === "harian") {
                payload.append("duration", form.durasi);
                payload.append("tanggal", form.tanggalMulai);     // ganti dari "start_date"
                payload.append("end_date", tanggalSelesai);        // boleh tetap dikirim, opsional buat referensi
            } else {
                payload.append("event_date", form.tanggal);
                payload.append("theme", form.tema || "");
            }
            payload.append("jam", form.jam);
            payload.append("notes", form.catatan || "");
            payload.append("address", form.alamat);
            payload.append("lat", clientLocation.lat);
            payload.append("lng", clientLocation.lng);
            payload.append("total_price", totalPrice);
            payload.append("courier_fee", courierFeeCalc);
            payload.append("payment_method", payMethod);
            payload.append("payment_account_id", payOption);
            payload.append("payment_provider", selectedAccount?.provider_name || "");
            payload.append("payment_account_number", selectedAccount?.account_number || "");
            // Pembayaran tahap pertama: harian = lunas 100%, insidentil = DP 50%
            // (sisa 50% insidentil dilunasi nanti lewat halaman Invoice, tempo 3 hari
            // sebelum tanggal pengiriman pertama)
            payload.append("payment_stage", selectedType === "harian" ? "lunas" : "dp_50");
            payload.append("amount_paid", amountPaidNow);
            payload.append("payment_proof", buktiBayar);

            await axios.post("/klien/orders", payload, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("✅ Pesanan & bukti pembayaran berhasil dikirim! Menunggu konfirmasi catering.");
            setTimeout(() => { navigate("/klien/pesanan"); }, 500);
        } catch (err) {
            console.error(err);
            alert("Gagal membuat pesanan.");
        } finally {
            setSubmitting(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | RENDER — PILIH TIPE
    |--------------------------------------------------------------------------
    */

    if (!selectedType) {
        return (
            <PageWrapper>
                <NavbarKlien title="Pesan Makan" />
                <ScrollArea>
                    <SectionHeader
                        title="Pilih Tipe Catering"
                        sub="Pilih jenis catering sesuai kebutuhan Anda"
                    />
                    <div style={styles.typeGrid}>
                        {[
                            {
                                id: "harian",
                                title: "Catering Harian",
                                desc: "Catering harian untuk makan siang dan makan malam dengan sistem langganan harian.",
                                icon: "🗓",
                                accent: "#3b82f6",
                                bg: "rgba(59,130,246,0.08)",
                                border: "rgba(59,130,246,0.2)",
                            },
                            {
                                id: "insidentil",
                                title: "Catering Insidentil",
                                desc: "Catering khusus acara seperti ulang tahun, rapat, gathering, dan pernikahan.",
                                icon: "🎉",
                                accent: "#8b5cf6",
                                bg: "rgba(139,92,246,0.08)",
                                border: "rgba(139,92,246,0.2)",
                            },
                        ].map((item) => (
                            <TypeCard key={item.id} item={item} onSelect={setSelectedType} />
                        ))}
                    </div>
                </ScrollArea>
            </PageWrapper>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | RENDER — POS LAYOUT
    |--------------------------------------------------------------------------
    */

    return (
        <PageWrapper>
            <NavbarKlien title="Pesan Makan" />

            {/* POS Layout */}
            <div style={styles.posLayout}>
                {/* ===== LEFT: MENU PANEL (scroll sendiri) ===== */}
                <div style={styles.menuPanel}>
                    {/* Topbar */}
                    <div style={styles.menuTopbar}>
                        <button onClick={() => setSelectedType(null)} style={styles.backBtn}>
                            <FaArrowLeft /> Kembali
                        </button>
                        <h2 style={styles.menuTitle}>
                            {selectedType === "harian" ? "Menu Catering Harian" : "Menu Catering Insidentil"}
                        </h2>
                        {distanceKm > 0 && (
                            <div style={styles.infoChips}>
                                <Chip icon={<FaMapMarkerAlt />} text={`${distanceKm.toFixed(1)} km`} color="#60a5fa" />
                                <Chip icon={<FaClock />} text={`${durationMinute} mnt`} color="#fbbf24" />
                            </div>
                        )}
                    </div>

                    {/* Search + Sort */}
                    <div style={styles.filterBar}>
                        <div style={styles.searchBox}>
                            <FaSearch style={{ color: "#64748b", fontSize: 14 }} />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari menu..."
                                style={styles.searchInput}
                            />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={styles.sortSelect}
                        >
                            <option value="default">Urutkan</option>
                            <option value="termurah">Termurah</option>
                            <option value="termahal">Termahal</option>
                            <option value="minporsi">Min. Porsi Kecil</option>
                        </select>
                    </div>

                    {/* Menu per Catering */}
                    <div className="hide-scrollbar" style={styles.menuScrollArea}>
                        {filteredMenus.length === 0 ? (
                            <div style={styles.emptyState}>
                                <FaUtensils style={{ fontSize: 40, marginBottom: 12, opacity: .2 }} />
                                <p>Tidak ada menu ditemukan</p>
                            </div>
                        ) : (
                            groupedMenus.map((group) => (
                                <div key={group.key} style={styles.cateringGroup}>
                                    <div style={styles.cateringGroupHeader}>
                                        <div style={styles.cateringGroupIcon}>
                                            <FaUtensils style={{ fontSize: 13 }} />
                                        </div>
                                        <div>
                                            <div style={{ color: "#fff", fontSize: 13 }}>{group.ownerName}</div>
                                            {group.ownerAddress && (
                                                <div style={{ color: "#64748b", fontSize: 11 }}>{group.ownerAddress}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div style={styles.menuGrid}>
                                        {group.items.map((menu) => (
                                            <MenuCard
                                                key={menu.id}
                                                menu={menu}
                                                selected={selectedMenu?.id === menu.id}
                                                onSelect={() => setSelectedMenu(menu)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* ===== RIGHT: ORDER PANEL ===== */}
                <div style={styles.orderPanel}>
                    <div style={styles.orderHeader}>
                        <FaShoppingCart style={{ color: "#60a5fa" }} />
                        <span style={{ fontSize: 16, color: "#fff", fontWeight: 700 }}>Form Pesanan</span>
                        {selectedMenu && (
                            <span style={styles.menuBadge}>1 menu dipilih</span>
                        )}
                    </div>

                    <div className="hide-scrollbar" style={styles.orderBody}>
                        {!selectedMenu ? (
                            <div style={styles.noMenuState}>
                                <FaUtensils style={{ fontSize: 36, opacity: .15 }} />
                                <p style={{ color: "#64748b", fontSize: 13, marginTop: 12 }}>
                                    Pilih menu dari daftar untuk mulai memesan
                                </p>
                            </div>
                        ) : (
                            <>
                                <div style={styles.selectedMenuCard}>
                                    <img
                                        src={selectedMenu.image ? `/storage/${selectedMenu.image}` : "/no-image.png"}
                                        alt={selectedMenu.name}
                                        style={styles.selectedMenuImg}
                                    />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ color: "#fff", fontSize: 14 }}>{selectedMenu.name}</div>
                                        <div style={{ color: "#22c55e", fontSize: 13, marginTop: 3 }}>
                                            Rp {selectedMenu.price.toLocaleString("id-ID")} / porsi
                                        </div>
                                        <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}>
                                            Min. {selectedMenu.min_porsi} porsi
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleRemoveMenu}
                                        title="Hapus menu ini"
                                        style={styles.removeMenuBtn}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>

                                <InfoBox>
                                    <div style={{ color: "#fff", fontSize: 12 }}>
                                        <strong>{selectedMenu.owner}</strong>
                                    </div>
                                    <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}>
                                        {selectedMenu.ownerAddress}
                                    </div>
                                </InfoBox>

                                <SectionLabel>Data Pemesan</SectionLabel>
                                <div style={styles.inpRow}>
                                    <FormInput
                                        label="Nama Pemesan"
                                        value={form.nama}
                                        onChange={(e) => setForm({ ...form, nama: e.target.value })}
                                        placeholder="Nama lengkap"
                                    />
                                    <FormInput
                                        label="No. Telepon"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        placeholder="08xx-xxxx-xxxx"
                                    />
                                </div>

                                <SectionLabel>Detail Pesanan</SectionLabel>
                                {selectedType === "harian" ? (
                                    <>
                                        <div style={styles.inpRow}>
                                            
<FormInput
    label={`Jumlah Porsi (min ${selectedMenu.min_porsi})`}
    type="number"
    min={selectedMenu.min_porsi}
    value={form.jumlah}
    onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
    placeholder={`${selectedMenu.min_porsi}`}
    error={
        form.jumlah && Number(form.jumlah) < Number(selectedMenu.min_porsi)
            ? `Minimal pemesanan ${selectedMenu.min_porsi} porsi`
            : null
    }
/>
                                            <FormInput
                                                label="Durasi (Hari)"
                                                type="number"
                                                min="1"
                                                value={form.durasi}
                                                onChange={(e) => setForm({ ...form, durasi: e.target.value })}
                                                placeholder="30"
                                            />
                                        </div>
                                        <div style={styles.inpRow}>
                                            <FormInput
                                                label="Tanggal Mulai"
                                                type="date"
                                                min={todayStr}
                                                value={form.tanggalMulai}
                                                onChange={(e) => setForm({ ...form, tanggalMulai: e.target.value })}
                                            />
                                            <FormInput
                                                label="Jam Kirim"
                                                type="time"
                                                value={form.jam}
                                                onChange={(e) => setForm({ ...form, jam: e.target.value })}
                                            />
                                        </div>
                                        {tanggalSelesai && (
                                            <div style={{ color: "#64748b", fontSize: 11, marginTop: -6, marginBottom: 12 }}>
                                                Pengiriman setiap hari pukul {form.jam || "--:--"}, mulai {form.tanggalMulai} sampai {tanggalSelesai} ({form.durasi} hari). Kurir akan otomatis berhenti mengirim setelah tanggal tersebut.
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div style={styles.inpRow}>
                                            <FormInput
                                                label="Tanggal Event"
                                                type="date"
                                                min={todayStr}
                                                value={form.tanggal}
                                                onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                                            />
                                            <FormInput
                                                label="Jam Event"
                                                type="time"
                                                value={form.jam}
                                                onChange={(e) => setForm({ ...form, jam: e.target.value })}
                                            />
                                        </div>

                                            <div style={styles.inpRow}>
    <FormInput
        label={`Jumlah Porsi (min ${selectedMenu.min_porsi})`}
        type="number"
        min={selectedMenu.min_porsi}
        value={form.jumlah}
        onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
        error={
            form.jumlah && Number(form.jumlah) < Number(selectedMenu.min_porsi)
                ? `Minimal pemesanan ${selectedMenu.min_porsi} porsi`
                : null
        }
    />
    <FormInput
        label="Tema Event"
        value={form.tema}
        onChange={(e) => setForm({ ...form, tema: e.target.value })}
        placeholder="Ulang Tahun..."
    />
</div>
                                        
                                    </>
                                )}

                                <FormInput
                                    label="Alamat Pengiriman Lengkap"
                                    value={form.alamat}
                                    onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                                    placeholder="Jl. Tongkol No.3, Sukalipuro, Dermo, Kec. Bangil, Pasuruan, Jawa Timur 67153"
                                />
                                <div style={{ marginTop: -8, marginBottom: 12, fontSize: 11 }}>
                                    {geoStatus === "idle" && (
                                        <span style={{ color: "#475569" }}>
                                            Tulis alamat selengkap mungkin (jalan, kelurahan, kecamatan, kabupaten/kota, kode pos) agar jarak & estimasi tiba lebih akurat.
                                        </span>
                                    )}
                                    {geoStatus === "searching" && (
                                        <span style={{ color: "#fbbf24" }}>🔍 Mencari lokasi alamat...</span>
                                    )}
                                    {geoStatus === "found" && (
                                        <span style={{ color: "#34d399" }}>✅ Alamat ditemukan, jarak & estimasi tiba sudah dihitung.</span>
                                    )}
                                    {geoStatus === "notfound" && (
                                        <span style={{ color: "#f87171" }}>❌ Alamat belum ditemukan. Mohon lengkapi alamat (kecamatan/kabupaten/kode pos).</span>
                                    )}
                                </div>

                                <SectionLabel>Ringkasan Pesanan</SectionLabel>
                                <InfoBox>
                                    <SummaryRow label="Harga Produk" value={`Rp ${hargaProduk.toLocaleString("id-ID")}`} yellow />
                                    <SummaryRow label="Biaya Kurir" value={`Rp ${totalCourierFee.toLocaleString("id-ID")}`} yellow />
                                    <SummaryRow label="Jarak" value={distanceKm ? `${distanceKm.toFixed(1)} km` : "-"} />
                                    <SummaryRow label="Estimasi Tiba" value={durationMinute ? `${durationMinute} menit` : "-"} />
                                    <div style={styles.divider} />
                                    <div style={styles.totalRow}>
                                        <span>Total Keseluruhan</span>
                                        <span style={{ color: "#fbbf24" }}>
                                            Rp {grandTotal.toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                    {selectedType === "harian" ? (
                                        <div style={{ color: "#34d399", fontSize: 12, marginTop: 8, fontWeight: 600 }}>
                                            Status: Wajib Lunas 100% (catering harian tidak ada DP)
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ color: "#fbbf24", fontSize: 13, marginTop: 8, fontWeight: 700 }}>
                                                Bayar Sekarang — DP 50%: Rp {dp.toLocaleString("id-ID")}
                                            </div>
                                            <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>
                                                Sisa 50% (Rp {dp.toLocaleString("id-ID")}) dilunasi lewat halaman Invoice setelah pesanan disetujui, paling lambat 3 hari sebelum tanggal event.
                                            </div>
                                        </>
                                    )}
                                </InfoBox>

                                <SectionLabel>Metode Pembayaran</SectionLabel>
                                <div style={styles.payMethodGrid}>
                                    <PayMethodBtn
                                        icon={<FaUniversity />}
                                        label="Transfer Bank"
                                        active={payMethod === "bank"}
                                        onClick={() => { setPayMethod("bank"); setPayOption(null); }}
                                    />
                                    <PayMethodBtn
                                        icon={<FaWallet />}
                                        label="E-Wallet"
                                        active={payMethod === "ewallet"}
                                        onClick={() => { setPayMethod("ewallet"); setPayOption(null); }}
                                    />
                                </div>

                                {payMethod === "bank" && (
                                    bankAccounts.length === 0 ? (
                                        <div style={styles.noAccountNote}>
                                            Catering ini belum menambahkan rekening bank.
                                        </div>
                                    ) : (
                                        <div style={styles.payOptGrid}>
                                            {bankAccounts.map((acc) => (
                                                <PayOptionBtn
                                                    key={acc.id}
                                                    label={acc.provider_name}
                                                    sub={`${acc.account_number} • a.n. ${acc.account_name}`}
                                                    active={payOption === acc.id}
                                                    onClick={() => setPayOption(acc.id)}
                                                />
                                            ))}
                                        </div>
                                    )
                                )}

                                {payMethod === "ewallet" && (
                                    ewalletAccounts.length === 0 ? (
                                        <div style={styles.noAccountNote}>
                                            Catering ini belum menambahkan e-wallet.
                                        </div>
                                    ) : (
                                        <div style={styles.payOptGrid}>
                                            {ewalletAccounts.map((acc) => (
                                                <PayOptionBtn
                                                    key={acc.id}
                                                    label={acc.provider_name}
                                                    sub={`${acc.account_number} • a.n. ${acc.account_name}`}
                                                    active={payOption === acc.id}
                                                    onClick={() => setPayOption(acc.id)}
                                                />
                                            ))}
                                        </div>
                                    )
                                )}

                                {/* ===== CARD BUKTI PEMBAYARAN + TIMER 15 MENIT ===== */}
                                {payMethod && payOption && (
                                    <div
                                        style={{
                                            ...styles.proofCard,
                                            borderColor: isPaymentExpired
                                                ? "rgba(239,68,68,0.4)"
                                                : "rgba(59,130,246,0.25)",
                                        }}
                                    >
                                        <div style={styles.proofHeader}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <FaImage style={{ color: "#60a5fa" }} />
                                                <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>
                                                    Bukti Pembayaran
                                                </span>
                                            </div>
                                            <div
                                                style={{
                                                    ...styles.proofTimer,
                                                    color: isPaymentExpired ? "#f87171" : "#fbbf24",
                                                    borderColor: isPaymentExpired
                                                        ? "rgba(239,68,68,0.35)"
                                                        : "rgba(251,191,36,0.3)",
                                                }}
                                            >
                                                <FaHourglassHalf style={{ fontSize: 11 }} />
                                                {formatTimeLeft(timeLeft)}
                                            </div>
                                        </div>

                                        <div style={{ color: "#94a3b8", fontSize: 11.5, marginBottom: 10 }}>
                                            Transfer <strong style={{ color: "#fbbf24" }}>Rp {jumlahYangHarusDibayarSekarang.toLocaleString("id-ID")}</strong> ke{" "}
                                            {[...bankAccounts, ...ewalletAccounts].find((a) => a.id === payOption)?.provider_name}, lalu unggah foto/screenshot bukti transfer dalam waktu 15 menit.
                                        </div>

                                        {isPaymentExpired ? (
                                            <div style={styles.proofExpiredBox}>
                                                <FaExclamationTriangle style={{ color: "#f87171" }} />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ color: "#f87171", fontSize: 12, fontWeight: 700 }}>
                                                        Waktu pembayaran habis
                                                    </div>
                                                    <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>
                                                        Silakan pilih ulang metode pembayaran untuk memulai timer baru.
                                                    </div>
                                                </div>
                                                <button onClick={handleRestartPaymentTimer} style={styles.proofRestartBtn}>
                                                    Ulangi
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                {buktiBayarPreview ? (
                                                    <div style={styles.proofPreviewWrap}>
                                                        <img src={buktiBayarPreview} alt="Bukti Pembayaran" style={styles.proofPreviewImg} />
                                                        <label style={styles.proofChangeBtn}>
                                                            Ganti Foto
                                                            <input type="file" accept="image/*" onChange={handleBuktiBayarChange} style={{ display: "none" }} />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <label style={styles.proofUploadBox}>
                                                        <FaUpload style={{ fontSize: 18, color: "#60a5fa", marginBottom: 6 }} />
                                                        <span style={{ color: "#94a3b8", fontSize: 12 }}>
                                                            Klik untuk unggah foto bukti pembayaran
                                                        </span>
                                                        <input type="file" accept="image/*" onChange={handleBuktiBayarChange} style={{ display: "none" }} />
                                                    </label>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}

                                <FormInput
                                    label="Catatan (opsional)"
                                    value={form.catatan}
                                    onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                                    placeholder="Tidak pedas, alergi kacang..."
                                />

                                <button onClick={handleSubmit} disabled={submitting} style={{ ...styles.submitBtn, opacity: submitting ? 0.6 : 1 }}>
                                    <FaShoppingCart /> {submitting ? "Mengirim..." : "Kirim Pesanan"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}

/*
|--------------------------------------------------------------------------
| SUB-COMPONENTS
|--------------------------------------------------------------------------
*/

function PageWrapper({ children }) {
    return (
        <div style={{ width: "100%", height: "100vh", background: "#020817", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                * { margin:0; padding:0; box-sizing:border-box; font-family:'Inter', system-ui, sans-serif; }
                html, body, #root { height:100%; margin:0; padding:0; background:#020817; overflow:hidden; }
                .hide-scrollbar { scrollbar-width:none; -ms-overflow-style:none; }
                .hide-scrollbar::-webkit-scrollbar { display:none; width:0; height:0; }
                input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); }
                input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(1); }
                select option { background:#0d1117; color:#fff; }

                .type-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 16px 48px rgba(0,0,0,0.35);
                }
                .menu-card:hover {
                    transform: translateY(-2px);
                }
                .pay-method-btn:hover, .pay-option-btn:hover {
                    border-color: rgba(59,130,246,0.35) !important;
                }
            `}</style>
            {children}
        </div>
    );
}

function ScrollArea({ children }) {
    return (
        <div
            className="hide-scrollbar"
            style={{ flex: 1, overflowY: "auto", padding: "30px" }}
        >
            {children}
        </div>
    );
}

function SectionHeader({ title, sub }) {
    return (
        <div style={{ marginBottom: 28 }}>
            <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 800, letterSpacing: "-1px", marginBottom: 8 }}>{title}</h1>
            <p style={{ color: "#64748b", fontSize: 14 }}>{sub}</p>
        </div>
    );
}

function TypeCard({ item, onSelect }) {
    return (
        <div className="type-card" style={{ ...styles.typeCard, border: `1px solid ${item.border}`, transition: "transform .2s ease, box-shadow .2s ease" }}>
            <div style={{
                position: "absolute", top: 0, left: "28px", right: "28px",
                height: "2px", borderRadius: "0 0 4px 4px",
                background: `linear-gradient(90deg, ${item.accent}, transparent)`,
            }} />
            <div style={{
                position: "absolute", top: "-40px", right: "-40px",
                width: "110px", height: "110px", borderRadius: "999px",
                background: item.bg, filter: "blur(30px)", pointerEvents: "none",
            }} />
            <div style={{ ...styles.typeIcon, background: item.bg, border: `1px solid ${item.border}` }}>{item.icon}</div>
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, letterSpacing: "-0.3px", marginBottom: 10 }}>{item.title}</h2>
            <p style={{ color: "#64748b", lineHeight: 1.7, fontSize: 13.5, flex: 1 }}>{item.desc}</p>
            <button onClick={() => onSelect(item.id)} style={styles.selectBtn}>
                Pilih Catering
            </button>
        </div>
    );
}

function MenuCard({ menu, selected, onSelect }) {
    return (
        <div
            className="menu-card"
            onClick={onSelect}
            style={{
                ...styles.menuCard,
                border: selected ? "1.5px solid #3b82f6" : "1px solid rgba(255,255,255,0.07)",
                boxShadow: selected ? "0 0 0 3px rgba(59,130,246,0.15)" : "none",
                transition: "transform .15s ease, box-shadow .15s ease",
            }}
        >
            <div style={{ position: "relative" }}>
                <img
                    src={menu.image ? `/storage/${menu.image}` : "/no-image.png"}
                    alt={menu.name}
                    style={styles.menuCardImg}
                />
                {selected && (
                    <div style={styles.selectedBadge}>
                        <FaCheck style={{ fontSize: 10 }} /> Dipilih
                    </div>
                )}
            </div>
            <div style={{ padding: "14px" }}>
                <div style={styles.catTag}>{menu.category}</div>
                <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{menu.name}</div>
                <div style={{ color: "#fbbf24", fontSize: 11, marginBottom: 6 }}>Min. {menu.min_porsi} porsi</div>
                <div style={{ color: "#34d399", fontSize: 17, fontWeight: 700 }}>
                    Rp {menu.price.toLocaleString("id-ID")}
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onSelect(); }}
                    style={{ ...styles.addBtn, background: selected ? "#16a34a" : "linear-gradient(135deg,#3b82f6,#60a5fa)" }}
                >
                    {selected ? <><FaCheck /> Dipilih</> : "+ Pilih Menu"}
                </button>
            </div>
        </div>
    );
}

function Chip({ icon, text, color }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "6px 12px", fontSize: 12, fontWeight: 600, color }}>
            {icon} {text}
        </div>
    );
}

function InfoBox({ children }) {
    return (
        <div style={{ background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
            {children}
        </div>
    );
}

function SectionLabel({ children }) {
    return (
        <div style={{ color: "#475569", fontWeight: 700, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, marginTop: 6 }}>
            {children}
        </div>
    );
}

function FormInput({ label, error, ...props }) {
    return (
        <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", color: "#64748b", fontSize: 12, fontWeight: 500, marginBottom: 6 }}>{label}</label>
            <input
                {...props}
                style={{
                    width: "100%",
                    height: 46,
                    borderRadius: 12,
                    border: error ? "1.5px solid rgba(239,68,68,0.6)" : "1px solid rgba(255,255,255,0.07)",
                    background: error ? "rgba(239,68,68,0.06)" : "#0d1117",
                    padding: "0 14px",
                    color: "#fff",
                    outline: "none",
                    fontSize: 13,
                    fontFamily: "inherit",
                    fontWeight: 600,
                    opacity: props.readOnly ? 0.6 : 1,
                    transition: "border .15s, background .15s",
                }}
            />
            {error && (
                <div style={{ color: "#f87171", fontSize: 11, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                    <FaExclamationTriangle style={{ fontSize: 10, flexShrink: 0 }} />
                    {error}
                </div>
            )}
        </div>
    );
}
function SummaryRow({ label, value, yellow }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8, color: "#64748b" }}>
            <span>{label}</span>
            <span style={{ color: yellow ? "#fbbf24" : "#fff", fontWeight: 600 }}>{value}</span>
        </div>
    );
}

function PayMethodBtn({ icon, label, active, onClick }) {
    return (
        <button
            className="pay-method-btn"
            onClick={onClick}
            style={{
                flex: 1,
                height: 56,
                background: active ? "rgba(59,130,246,0.12)" : "#0d1117",
                border: active ? "1.5px solid #3b82f6" : "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                color: active ? "#60a5fa" : "#64748b",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                transition: "all .2s",
            }}
        >
            <span style={{ fontSize: 18 }}>{icon}</span>
            {label}
        </button>
    );
}

function PayOptionBtn({ label, sub, active, onClick }) {
    return (
        <button
            className="pay-option-btn"
            onClick={onClick}
            style={{
                background: active ? "rgba(59,130,246,0.12)" : "#0d1117",
                border: active ? "1.5px solid #3b82f6" : "1px solid rgba(255,255,255,0.07)",
                borderRadius: 10,
                color: active ? "#60a5fa" : "#64748b",
                padding: "8px 10px",
                cursor: "pointer",
                fontSize: 12,
                textAlign: "left",
                transition: "all .2s",
                fontFamily: "inherit",
                fontWeight: 600,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {active && <FaCheck style={{ fontSize: 10 }} />}
                <span>{label}</span>
            </div>
            {sub && (
                <div style={{ fontSize: 10, color: active ? "#93c5fd" : "#475569", marginTop: 2, fontWeight: 500 }}>
                    {sub}
                </div>
            )}
        </button>
    );
}

/*
|--------------------------------------------------------------------------
| STYLES
|--------------------------------------------------------------------------
*/

const styles = {
    typeGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
        gap: 16,
    },
    typeCard: {
        background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
        borderRadius: 20,
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        position: "relative",
        overflow: "hidden",
    },
    typeIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 26,
        marginBottom: 18,
        position: "relative",
        zIndex: 2,
    },
    selectBtn: {
        marginTop: 22,
        width: "100%",
        height: 48,
        border: "none",
        borderRadius: 14,
        background: "linear-gradient(135deg,#3b82f6,#60a5fa)",
        color: "#fff",
        fontSize: 14,
        cursor: "pointer",
        fontFamily: "inherit",
        fontWeight: 700,
        position: "relative",
        zIndex: 2,
    },

    /* POS */
    posLayout: {
        flex: 1,
        minHeight: 0,
        display: "flex",
        overflow: "hidden",
    },
    menuPanel: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        minWidth: 0,
    },
    menuTopbar: {
        padding: "16px 22px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
    },
    backBtn: {
        height: 38,
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "0 14px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.04)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
        fontSize: 13,
        fontFamily: "inherit",
        fontWeight: 600,
        flexShrink: 0,
    },
    menuTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: "-0.3px",
        flex: 1,
    },
    infoChips: {
        display: "flex",
        gap: 8,
    },
    filterBar: {
        padding: "12px 22px",
        display: "flex",
        gap: 10,
        borderBottom: "1px solid rgba(255,255,255,0.05)",
    },
    searchBox: {
        flex: 1,
        background: "#0d1117",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 14px",
        height: 40,
    },
    searchInput: {
        flex: 1,
        background: "transparent",
        border: "none",
        color: "#fff",
        fontSize: 13,
        outline: "none",
        fontFamily: "inherit",
        fontWeight: 500,
    },
    sortSelect: {
        background: "#0d1117",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
        padding: "0 12px",
        height: 40,
        color: "#94a3b8",
        fontSize: 13,
        outline: "none",
        cursor: "pointer",
        fontFamily: "inherit",
        fontWeight: 500,
    },
    menuScrollArea: {
        flex: 1,
        overflowY: "auto",
        padding: "18px 22px",
    },
    cateringGroup: {
        marginBottom: 22,
    },
    cateringGroupHeader: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 12,
    },
    cateringGroupIcon: {
        width: 30,
        height: 30,
        borderRadius: 9,
        background: "rgba(59,130,246,0.12)",
        border: "1px solid rgba(59,130,246,0.2)",
        color: "#60a5fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    menuGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))",
        gap: 16,
    },
    menuCard: {
        background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
        borderRadius: 18,
        overflow: "hidden",
        cursor: "pointer",
    },
    menuCardImg: {
        width: "100%",
        height: 130,
        objectFit: "cover",
    },
    selectedBadge: {
        position: "absolute",
        top: 8,
        right: 8,
        background: "#16a34a",
        color: "#fff",
        fontSize: 10,
        fontWeight: 600,
        padding: "3px 8px",
        borderRadius: 20,
        display: "flex",
        alignItems: "center",
        gap: 4,
    },
    catTag: {
        display: "inline-block",
        background: "rgba(59,130,246,0.12)",
        border: "1px solid rgba(59,130,246,0.2)",
        color: "#60a5fa",
        fontSize: 10,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 6,
        marginBottom: 6,
        textTransform: "capitalize",
    },
    addBtn: {
        marginTop: 10,
        width: "100%",
        height: 34,
        border: "none",
        borderRadius: 9,
        color: "#fff",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        fontFamily: "inherit",
        transition: "background .2s",
    },
    emptyState: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "300px",
        color: "#475569",
    },

    orderPanel: {
        width: 430,
        background: "linear-gradient(160deg, #0f172a 0%, #0d1117 100%)",
        borderLeft: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flexShrink: 0,
    },
    orderHeader: {
        padding: "16px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        gap: 10,
    },
    menuBadge: {
        marginLeft: "auto",
        background: "rgba(59,130,246,0.15)",
        border: "1px solid rgba(59,130,246,0.25)",
        color: "#60a5fa",
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: 20,
    },
    orderBody: {
        flex: 1,
        overflowY: "auto",
        padding: "18px 20px",
    },
    noMenuState: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: "#475569",
    },
    selectedMenuCard: {
        background: "#0d1117",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 14,
        padding: "12px",
        display: "flex",
        gap: 12,
        marginBottom: 12,
        alignItems: "center",
    },
    selectedMenuImg: {
        width: 52,
        height: 52,
        borderRadius: 10,
        objectFit: "cover",
        flexShrink: 0,
    },
    removeMenuBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        border: "1px solid rgba(239,68,68,0.3)",
        background: "rgba(239,68,68,0.1)",
        color: "#f87171",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
        fontSize: 13,
        transition: "background .2s",
    },
    inpRow: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
    },
    divider: {
        height: 1,
        background: "rgba(255,255,255,0.06)",
        margin: "10px 0",
    },
    totalRow: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: 15,
        fontWeight: 700,
        color: "#fff",
    },
    payMethodGrid: {
        display: "flex",
        gap: 10,
        marginBottom: 14,
    },
    payOptGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))",
        gap: 8,
        marginBottom: 14,
    },
    noAccountNote: {
        background: "#0d1117",
        border: "1px dashed rgba(255,255,255,0.1)",
        borderRadius: 12,
        padding: "10px 12px",
        color: "#475569",
        fontSize: 12,
        marginBottom: 14,
    },
    proofCard: {
        background: "#0d1117",
        border: "1px solid rgba(59,130,246,0.25)",
        borderRadius: 14,
        padding: "14px",
        marginBottom: 14,
    },
    proofHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    proofTimer: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        border: "1px solid rgba(251,191,36,0.3)",
        borderRadius: 10,
        padding: "4px 10px",
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "monospace",
    },
    proofUploadBox: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: 110,
        border: "1.5px dashed rgba(255,255,255,0.12)",
        borderRadius: 12,
        cursor: "pointer",
        background: "rgba(255,255,255,0.02)",
    },
    proofPreviewWrap: {
        display: "flex",
        alignItems: "center",
        gap: 12,
    },
    proofPreviewImg: {
        width: 72,
        height: 72,
        borderRadius: 10,
        objectFit: "cover",
        border: "1px solid rgba(255,255,255,0.08)",
    },
    proofChangeBtn: {
        background: "rgba(59,130,246,0.12)",
        border: "1px solid rgba(59,130,246,0.25)",
        color: "#60a5fa",
        borderRadius: 10,
        padding: "8px 12px",
        fontSize: 11,
        fontWeight: 600,
        cursor: "pointer",
    },
    proofExpiredBox: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.2)",
        borderRadius: 10,
        padding: "10px 12px",
    },
    proofRestartBtn: {
        background: "rgba(239,68,68,0.15)",
        border: "1px solid rgba(239,68,68,0.3)",
        color: "#f87171",
        borderRadius: 8,
        padding: "6px 10px",
        fontSize: 11,
        fontWeight: 700,
        cursor: "pointer",
        flexShrink: 0,
    },
    submitBtn: {
        width: "100%",
        height: 50,
        border: "none",
        borderRadius: 14,
        background: "linear-gradient(135deg,#3b82f6,#60a5fa)",
        color: "#fff",
        fontSize: 14,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        marginTop: 14,
        fontFamily: "inherit",
        fontWeight: 700,
    },
};