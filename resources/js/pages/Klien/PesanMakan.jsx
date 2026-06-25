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
} from "react-icons/fa";
import axios from "axios";
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

    const [payMethod, setPayMethod] = useState(null); // 'bank' | 'ewallet'
    const [payOption, setPayOption] = useState(null); // id akun pembayaran milik catering terkait

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
        if (geoTimerRef.current) clearTimeout(geoTimerRef.current);
        if (!form.alamat) return;

        geoTimerRef.current = setTimeout(() => {
            fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.alamat)}`
            )
                .then((r) => r.json())
                .then((data) => {
                    if (data && data[0]) {
                        setClientLocation({
                            lat: parseFloat(data[0].lat),
                            lng: parseFloat(data[0].lon),
                        });
                    }
                })
                .catch(() => {});
        }, 1200);

        return () => clearTimeout(geoTimerRef.current);
    }, [form.alamat]);

    /*
    |--------------------------------------------------------------------------
    | HITUNG JARAK
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!clientLocation || !selectedMenu?.cateringLat || !selectedMenu?.cateringLng) return;

        const start = `${selectedMenu.cateringLng},${selectedMenu.cateringLat}`;
        const end   = `${clientLocation.lng},${clientLocation.lat}`;

        fetch(
            `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=false`
        )
            .then((r) => r.json())
            .then((data) => {
                if (data.routes?.length) {
                    setDistanceKm(data.routes[0].distance / 1000);
                    setDurationMinute(Math.round(data.routes[0].duration / 60));
                }
            })
            .catch(() => {});
    }, [clientLocation, selectedMenu]);

    /*
    |--------------------------------------------------------------------------
    | KALKULASI
    |--------------------------------------------------------------------------
    */

    const courierFee = useMemo(() => Math.ceil(distanceKm) * 7000, [distanceKm]);

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
    const dp = totalInsidentil * 0.5;

    const tanggalSelesai = useMemo(() => {
        if (!form.tanggalMulai || !form.durasi) return "";
        const d = new Date(form.tanggalMulai);
        d.setDate(d.getDate() + Number(form.durasi) - 1);
        return d.toISOString().split("T")[0];
    }, [form.tanggalMulai, form.durasi]);

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
    | Diharapkan endpoint /klien/menus menyertakan field
    | `payment_accounts` pada setiap menu/catering, contoh:
    | payment_accounts: [
    |   { id, type: 'bank', provider_name: 'BCA', account_number: '1234567890', account_name: 'CV Dapur Bahagia' },
    |   { id, type: 'ewallet', provider_name: 'GoPay', account_number: '0812xxxxxxx', account_name: 'CV Dapur Bahagia' },
    | ]
    | Jika field ini belum ada di backend, sesuaikan key di bawah.
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
        if (!clientLocation) { alert("Alamat tidak valid atau belum ditemukan"); return; }
        if (!payMethod) { alert("Pilih metode pembayaran"); return; }
        if (!payOption) { alert(`Pilih ${payMethod === "bank" ? "rekening bank" : "e-wallet"} tujuan`); return; }

        const selectedAccount = [...bankAccounts, ...ewalletAccounts].find(
            (a) => a.id === payOption
        );

        const courierFeeCalc = Math.ceil(distanceKm) * 7000;
        const totalPrice =
            selectedType === "harian"
                ? selectedMenu.price * Number(form.jumlah) * Number(form.durasi) +
                  courierFeeCalc * Number(form.durasi)
                : selectedMenu.price * Number(form.jumlah) + courierFeeCalc;

        try {
            await axios.post("/klien/orders", {
                client_id: user.id,
                customer_name: form.nama,
                phone: form.phone,
                order_date: new Date().toISOString().split("T")[0],
                type: selectedType,
                menu_id: selectedMenu.id,
                catering_id: selectedMenu.catering_id,
                quantity: form.jumlah,
                duration: selectedType === "harian" ? form.durasi : null,
                start_date: selectedType === "harian" ? form.tanggalMulai : null,
                event_date: selectedType === "insidentil" ? form.tanggal : null,
                theme: selectedType === "insidentil" ? form.tema : null,
                jam: form.jam,
                notes: form.catatan,
                address: form.alamat,
                lat: clientLocation.lat,
                lng: clientLocation.lng,
                total_price: totalPrice,
                courier_fee: courierFeeCalc,
                payment_method: payMethod,
                payment_account_id: payOption,
                payment_provider: selectedAccount?.provider_name,
                payment_account_number: selectedAccount?.account_number,
            });

            alert("✅ Pesanan berhasil dibuat!");
            setTimeout(() => { window.location.href = "/klien/pesanan-saya"; }, 500);
        } catch (err) {
            console.error(err);
            alert("Gagal membuat pesanan.");
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
                            },
                            {
                                id: "insidentil",
                                title: "Catering Insidentil",
                                desc: "Catering khusus acara seperti ulang tahun, rapat, gathering, dan pernikahan.",
                                icon: "🎉",
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

                    {/* Menu per Catering — masing-masing catering punya kelompoknya sendiri */}
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

                {/* ===== RIGHT: ORDER PANEL (lebih besar, scroll sendiri) ===== */}
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
                                {/* Selected Menu Info + Hapus Menu */}
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

                                {/* Catering Owner */}
                                <InfoBox>
                                    <div style={{ color: "#fff", fontSize: 12 }}>
                                        <strong>{selectedMenu.owner}</strong>
                                    </div>
                                    <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}>
                                        {selectedMenu.ownerAddress}
                                    </div>
                                </InfoBox>

                                {/* FORM */}
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
                                                Selesai pada {tanggalSelesai}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div style={styles.inpRow}>
                                            <FormInput
                                                label="Tanggal Event"
                                                type="date"
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
                                    label="Alamat Pengiriman"
                                    value={form.alamat}
                                    onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                                    placeholder="Jl. Contoh No.1, Kota..."
                                />

                                {/* Ringkasan */}
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
                                    {selectedType === "insidentil" && (
                                        <div style={{ color: "#fbbf24", fontSize: 13, marginTop: 8 }}>
                                            DP 50%: Rp {dp.toLocaleString("id-ID")}
                                        </div>
                                    )}
                                </InfoBox>

                                {/* PEMBAYARAN — data rekening/e-wallet asli milik catering ini */}
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

                                <FormInput
                                    label="Catatan (opsional)"
                                    value={form.catatan}
                                    onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                                    placeholder="Tidak pedas, alergi kacang..."
                                />

                                {/* Submit */}
                                <button onClick={handleSubmit} style={styles.submitBtn}>
                                    <FaShoppingCart /> Kirim Pesanan
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
        <div style={{ width: "100%", height: "100vh", background: "#071028", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <style>{`
                * { margin:0; padding:0; box-sizing:border-box; font-family:'Times New Roman',serif; font-weight:700; }
                html, body, #root { height:100%; margin:0; padding:0; background:#071028; overflow:hidden; }
                .hide-scrollbar { scrollbar-width:none; -ms-overflow-style:none; }
                .hide-scrollbar::-webkit-scrollbar { display:none; width:0; height:0; }
                input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); }
                input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(1); }
                select option { background:#0f172a; color:#fff; }
            `}</style>
            {children}
        </div>
    );
}

function ScrollArea({ children }) {
    return (
        <div
            className="hide-scrollbar"
            style={{ flex: 1, overflowY: "auto", padding: "28px" }}
        >
            {children}
        </div>
    );
}

function SectionHeader({ title, sub }) {
    return (
        <div style={{ marginBottom: 28 }}>
            <h1 style={{ color: "#fff", fontSize: 32, marginBottom: 8 }}>{title}</h1>
            <p style={{ color: "#94a3b8", fontSize: 15 }}>{sub}</p>
        </div>
    );
}

function TypeCard({ item, onSelect }) {
    return (
        <div style={styles.typeCard}>
            <div style={styles.typeIcon}>{item.icon}</div>
            <h2 style={{ color: "#fff", fontSize: 24, marginBottom: 10 }}>{item.title}</h2>
            <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: 14, flex: 1 }}>{item.desc}</p>
            <button onClick={() => onSelect(item.id)} style={styles.selectBtn}>
                Pilih Catering
            </button>
        </div>
    );
}

function MenuCard({ menu, selected, onSelect }) {
    return (
        <div
            onClick={onSelect}
            style={{
                ...styles.menuCard,
                border: selected ? "2px solid #2563eb" : "1px solid rgba(255,255,255,0.06)",
                boxShadow: selected ? "0 0 0 3px rgba(37,99,235,0.2)" : "none",
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
                <div style={{ color: "#fff", fontSize: 14, marginBottom: 4 }}>{menu.name}</div>
                <div style={{ color: "#fbbf24", fontSize: 11, marginBottom: 6 }}>Min. {menu.min_porsi} porsi</div>
                <div style={{ color: "#22c55e", fontSize: 17 }}>
                    Rp {menu.price.toLocaleString("id-ID")}
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onSelect(); }}
                    style={{ ...styles.addBtn, background: selected ? "#16a34a" : "linear-gradient(90deg,#2563eb,#3b82f6)" }}
                >
                    {selected ? <><FaCheck /> Dipilih</> : "+ Pilih Menu"}
                </button>
            </div>
        </div>
    );
}

function Chip({ icon, text, color }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "6px 12px", fontSize: 12, color }}>
            {icon} {text}
        </div>
    );
}

function InfoBox({ children }) {
    return (
        <div style={{ background: "#0f172a", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
            {children}
        </div>
    );
}

function SectionLabel({ children }) {
    return (
        <div style={{ color: "#64748b", fontSize: 11, letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 8, marginTop: 4 }}>
            {children}
        </div>
    );
}

function FormInput({ label, ...props }) {
    return (
        <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", color: "#94a3b8", fontSize: 12, marginBottom: 6 }}>{label}</label>
            <input
                {...props}
                style={{
                    width: "100%",
                    height: 46,
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "#0f172a",
                    padding: "0 14px",
                    color: "#fff",
                    outline: "none",
                    fontSize: 13,
                    fontFamily: "inherit",
                    fontWeight: 700,
                    opacity: props.readOnly ? 0.6 : 1,
                }}
            />
        </div>
    );
}

function SummaryRow({ label, value, yellow }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8, color: "#94a3b8" }}>
            <span>{label}</span>
            <span style={{ color: yellow ? "#fbbf24" : "#fff" }}>{value}</span>
        </div>
    );
}

function PayMethodBtn({ icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                flex: 1,
                height: 56,
                background: active ? "rgba(37,99,235,0.15)" : "#0f172a",
                border: active ? "1.5px solid #2563eb" : "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                color: active ? "#60a5fa" : "#94a3b8",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                cursor: "pointer",
                fontSize: 11,
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
            onClick={onClick}
            style={{
                background: active ? "rgba(37,99,235,0.15)" : "#0f172a",
                border: active ? "1.5px solid #2563eb" : "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10,
                color: active ? "#60a5fa" : "#94a3b8",
                padding: "8px 10px",
                cursor: "pointer",
                fontSize: 12,
                textAlign: "left",
                transition: "all .2s",
                fontFamily: "inherit",
                fontWeight: 700,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {active && <FaCheck style={{ fontSize: 10 }} />}
                <span>{label}</span>
            </div>
            {sub && (
                <div style={{ fontSize: 10, color: active ? "#93c5fd" : "#64748b", marginTop: 2, fontWeight: 600 }}>
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
        gap: 22,
    },
    typeCard: {
        background: "#182338",
        borderRadius: 24,
        padding: "28px",
        border: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        gap: 0,
    },
    typeIcon: {
        width: 64,
        height: 64,
        borderRadius: 18,
        background: "rgba(37,99,235,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28,
        marginBottom: 18,
    },
    selectBtn: {
        marginTop: 22,
        width: "100%",
        height: 50,
        border: "none",
        borderRadius: 14,
        background: "linear-gradient(90deg,#2563eb,#3b82f6)",
        color: "#fff",
        fontSize: 15,
        cursor: "pointer",
        fontFamily: "inherit",
        fontWeight: 700,
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
        border: "none",
        padding: "0 14px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.07)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
        fontSize: 13,
        fontFamily: "inherit",
        fontWeight: 700,
        flexShrink: 0,
    },
    menuTitle: {
        color: "#fff",
        fontSize: 20,
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
        background: "#182338",
        border: "1px solid rgba(255,255,255,0.06)",
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
        fontWeight: 700,
    },
    sortSelect: {
        background: "#182338",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12,
        padding: "0 12px",
        height: 40,
        color: "#94a3b8",
        fontSize: 13,
        outline: "none",
        cursor: "pointer",
        fontFamily: "inherit",
        fontWeight: 700,
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
        background: "rgba(37,99,235,0.15)",
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
        background: "#182338",
        borderRadius: 18,
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform .15s",
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
        padding: "3px 8px",
        borderRadius: 20,
        display: "flex",
        alignItems: "center",
        gap: 4,
    },
    catTag: {
        display: "inline-block",
        background: "rgba(37,99,235,0.15)",
        color: "#60a5fa",
        fontSize: 10,
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
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        fontFamily: "inherit",
        fontWeight: 700,
        transition: "background .2s",
    },
    emptyState: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "300px",
        color: "#64748b",
    },

    /* Order panel — diperbesar dari 360 ke 430, dan punya scroll-area sendiri */
    orderPanel: {
        width: 430,
        background: "#182338",
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
        background: "rgba(37,99,235,0.2)",
        color: "#60a5fa",
        fontSize: 11,
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
        color: "#64748b",
    },
    selectedMenuCard: {
        background: "#0f172a",
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
        background: "rgba(239,68,68,0.12)",
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
        background: "#0f172a",
        border: "1px dashed rgba(255,255,255,0.1)",
        borderRadius: 12,
        padding: "10px 12px",
        color: "#64748b",
        fontSize: 12,
        marginBottom: 14,
    },
    submitBtn: {
        width: "100%",
        height: 50,
        border: "none",
        borderRadius: 14,
        background: "linear-gradient(90deg,#2563eb,#3b82f6)",
        color: "#fff",
        fontSize: 15,
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