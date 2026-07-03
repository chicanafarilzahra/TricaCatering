// resources/js/pages/Register.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";

const styles = {
    page: {
        position: "fixed",
        inset: 0,
        background: "#080d18",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        overflowY: "auto",
        padding: "40px 20px",
        boxSizing: "border-box",
    },
    card: {
        width: "100%",
        maxWidth: "460px",
        marginBottom: "40px",
        padding: "48px 44px",
        background: "#0f1623",
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        boxSizing: "border-box",
    },
    backBtn: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: "transparent",
        border: "none",
        color: "#475569",
        cursor: "pointer",
        fontSize: "13px",
        padding: 0,
        marginBottom: "36px",
        transition: "color 0.2s",
    },
    brandRow: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "32px",
    },
    logoMark: {
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        background: "linear-gradient(135deg,#2563eb,#60a5fa)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: "20px",
        fontWeight: "800",
        flexShrink: 0,
        boxShadow: "0 8px 24px rgba(37,99,235,0.35)",
    },
    brandName: {
        fontSize: "18px",
        fontWeight: "700",
        color: "#f1f5f9",
        letterSpacing: "-0.3px",
    },
    brandSub: {
        fontSize: "11px",
        color: "#475569",
        fontWeight: "500",
        letterSpacing: "0.5px",
        textTransform: "uppercase",
    },
    divider: {
        width: "100%",
        height: "1px",
        background: "rgba(255,255,255,0.05)",
        marginBottom: "28px",
    },
    heading: {
        fontSize: "26px",
        fontWeight: "700",
        color: "#f1f5f9",
        margin: "0 0 6px",
        letterSpacing: "-0.5px",
    },
    subheading: {
        fontSize: "14px",
        color: "#475569",
        margin: "0 0 28px",
    },
    label: {
        display: "block",
        fontSize: "12px",
        fontWeight: "600",
        color: "#64748b",
        marginBottom: "8px",
        letterSpacing: "0.4px",
        textTransform: "uppercase",
    },
    inputWrap: {
        marginBottom: "18px",
    },
    inputBase: {
        width: "100%",
        height: "50px",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "12px",
        padding: "0 16px",
        fontSize: "14px",
        outline: "none",
        background: "#07090f",
        color: "#f1f5f9",
        boxSizing: "border-box",
        transition: "border-color 0.2s, box-shadow 0.2s",
    },
    textareaBase: {
        width: "100%",
        minHeight: "100px",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "12px",
        padding: "14px 16px",
        fontSize: "14px",
        outline: "none",
        background: "#07090f",
        color: "#f1f5f9",
        boxSizing: "border-box",
        resize: "vertical",
        fontFamily: "inherit",
        transition: "border-color 0.2s, box-shadow 0.2s",
    },
    passwordWrap: {
        position: "relative",
    },
    eyeBtn: {
        position: "absolute",
        top: "50%",
        right: "14px",
        transform: "translateY(-50%)",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "#334155",
        display: "flex",
        alignItems: "center",
        padding: 0,
    },
    selectBase: {
        width: "100%",
        height: "50px",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "12px",
        padding: "0 16px",
        fontSize: "14px",
        outline: "none",
        background: "#07090f",
        color: "#f1f5f9",
        boxSizing: "border-box",
        cursor: "pointer",
        appearance: "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
    },
    locationBtn: {
        width: "100%",
        height: "44px",
        marginTop: "10px",
        border: "1px solid rgba(37,99,235,0.4)",
        borderRadius: "12px",
        background: "rgba(37,99,235,0.12)",
        color: "#60a5fa",
        fontWeight: "600",
        fontSize: "13px",
        cursor: "pointer",
        letterSpacing: "0.2px",
        transition: "background 0.2s",
    },
    locationInfo: {
        marginTop: "8px",
        color: "#475569",
        fontSize: "12px",
        lineHeight: "1.6",
    },
    submitBtn: {
        width: "100%",
        height: "50px",
        border: "none",
        borderRadius: "12px",
        background: "linear-gradient(135deg,#2563eb,#3b82f6)",
        color: "#fff",
        fontWeight: "700",
        fontSize: "14px",
        cursor: "pointer",
        letterSpacing: "0.2px",
        boxShadow: "0 8px 24px rgba(37,99,235,0.3)",
        transition: "opacity 0.2s, transform 0.1s",
        marginTop: "10px",
    },
    loginRow: {
        marginTop: "20px",
        textAlign: "center",
        fontSize: "13px",
        color: "#475569",
    },
    loginLink: {
        color: "#60a5fa",
        textDecoration: "none",
        fontWeight: "600",
    },
    alertSuccess: {
        marginBottom: "18px",
        padding: "12px 16px",
        borderRadius: "10px",
        background: "rgba(34,197,94,0.1)",
        color: "#22c55e",
        fontSize: "13px",
        fontWeight: "600",
        border: "1px solid rgba(34,197,94,0.2)",
    },
    alertError: {
        marginBottom: "18px",
        padding: "12px 16px",
        borderRadius: "10px",
        background: "rgba(239,68,68,0.1)",
        color: "#ef4444",
        fontSize: "13px",
        fontWeight: "600",
        border: "1px solid rgba(239,68,68,0.2)",
    },
    segmentWrap: {
        display: "flex",
        gap: "8px",
        padding: "4px",
        background: "#07090f",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "12px",
    },
    segmentBtn: {
        flex: 1,
        height: "42px",
        border: "none",
        borderRadius: "9px",
        background: "transparent",
        color: "#64748b",
        fontWeight: "600",
        fontSize: "13px",
        cursor: "pointer",
        transition: "all 0.15s",
    },
    segmentBtnActive: {
        background: "rgba(37,99,235,0.18)",
        color: "#60a5fa",
        boxShadow: "0 0 0 1px rgba(59,130,246,0.4) inset",
    },
};

export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [role, setRole] = useState("klien");
    const [namaCatering, setNamaCatering] = useState("");
    const [alamatCatering, setAlamatCatering] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [namaSppg, setNamaSppg] = useState("");
    const [alamatSppg, setAlamatSppg] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    // ── Kurir: pilih daftar ke Catering atau ke SPPG ──
    const [kurirType, setKurirType] = useState("catering"); // "catering" | "sppg"
    const [employerId, setEmployerId] = useState(null);
    const [employerList, setEmployerList] = useState([]);
    const [loadingEmployers, setLoadingEmployers] = useState(false);

    // Ambil daftar catering/SPPG setiap kali role=kurir & kurirType berubah
    useEffect(() => {
        if (role !== "kurir") return;

        let active = true;
        setLoadingEmployers(true);
        setEmployerId(null);

        const endpoint = kurirType === "sppg" ? "/sppgs/list" : "/owners/list";

        axios.get(endpoint)
            .then(res => {
                if (active) setEmployerList(res.data ?? []);
            })
            .catch(err => {
                console.error(err);
                if (active) setEmployerList([]);
            })
            .finally(() => {
                if (active) setLoadingEmployers(false);
            });

        return () => { active = false; };
    }, [role, kurirType]);

    const handleKurirTypeChange = (type) => {
        setKurirType(type);
        setEmployerId(null);
    };

    const selectedEmployer = employerList.find(
        (item) => item.id === employerId
    );

    const getLocation = () => {
        if (!navigator.geolocation) {
            alert("Browser tidak mendukung GPS");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                alert("Lokasi berhasil diambil");
            },
            (error) => {
                console.log(error);
                alert("Gagal mengambil lokasi");
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            await axios.post("/register", {
                name,
                email,
                phone: role === "kurir" ? phone : null,
                password,
                password_confirmation: passwordConfirmation,
                role,
                latitude: role === "owner" ? latitude : null,
                longitude: role === "owner" ? longitude : null,
                nama_catering: role === "owner" ? namaCatering : null,
                alamat_catering: role === "owner" ? alamatCatering : null,
                nama_sppg: role === "operator_sppg" ? namaSppg : null,
                alamat_sppg: role === "operator_sppg" ? alamatSppg : null,

                // ── kurir: kirim pilihan tipe + id catering/SPPG yang dipilih ──
                kurir_type: role === "kurir" ? kurirType : null,
                employer_id: role === "kurir" ? employerId : null,
            });

            setMessage("Register berhasil! Silakan login.");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setMessage(err.response?.data?.message || "Register gagal");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = (field) => ({
        ...styles.inputBase,
        borderColor: focusedField === field
            ? "rgba(59,130,246,0.5)"
            : "rgba(255,255,255,0.07)",
        boxShadow: focusedField === field
            ? "0 0 0 3px rgba(59,130,246,0.08)"
            : "none",
    });

    const textareaStyle = (field) => ({
        ...styles.textareaBase,
        borderColor: focusedField === field
            ? "rgba(59,130,246,0.5)"
            : "rgba(255,255,255,0.07)",
        boxShadow: focusedField === field
            ? "0 0 0 3px rgba(59,130,246,0.08)"
            : "none",
    });

    const selectStyle = (field) => ({
        ...styles.selectBase,
        borderColor: focusedField === field
            ? "rgba(59,130,246,0.5)"
            : "rgba(255,255,255,0.07)",
        boxShadow: focusedField === field
            ? "0 0 0 3px rgba(59,130,246,0.08)"
            : "none",
    });

    const isSuccess = message === "Register berhasil! Silakan login.";

    return (
        <div style={styles.page}>
            <div style={styles.card}>

                {/* BACK */}
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    style={styles.backBtn}
                    onMouseEnter={e => e.currentTarget.style.color = "#94a3b8"}
                    onMouseLeave={e => e.currentTarget.style.color = "#475569"}
                >
                    <FaArrowLeft size={11} />
                    Back
                </button>

                {/* BRAND */}
                <div style={styles.brandRow}>
                    <div style={styles.logoMark}>T</div>
                    <div>
                        <div style={styles.brandName}>TriCa Catering</div>
                        <div style={styles.brandSub}>Management System</div>
                    </div>
                </div>

                <div style={styles.divider} />

                {/* HEADING */}
                <h1 style={styles.heading}>Create account</h1>
                <p style={styles.subheading}>Fill in the details to get started</p>

                {/* MESSAGE */}
                {message && (
                    <div style={isSuccess ? styles.alertSuccess : styles.alertError}>
                        {message}
                    </div>
                )}

                {/* FORM */}
                <form onSubmit={handleSubmit}>

                    {/* NAMA */}
                    <div style={styles.inputWrap}>
                        <label style={styles.label}>Nama</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            onFocus={() => setFocusedField("name")}
                            onBlur={() => setFocusedField(null)}
                            required
                            placeholder="Nama lengkap"
                            style={inputStyle("name")}
                        />
                    </div>

                    {/* EMAIL */}
                    <div style={styles.inputWrap}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onFocus={() => setFocusedField("email")}
                            onBlur={() => setFocusedField(null)}
                            required
                            placeholder="you@example.com"
                            style={inputStyle("email")}
                        />
                    </div>

                    {/* PASSWORD */}
                    <div style={styles.inputWrap}>
                        <label style={styles.label}>Password</label>
                        <div style={styles.passwordWrap}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onFocus={() => setFocusedField("password")}
                                onBlur={() => setFocusedField(null)}
                                required
                                placeholder="••••••••"
                                style={{ ...inputStyle("password"), paddingRight: "46px" }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.eyeBtn}
                            >
                                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div style={styles.inputWrap}>
                        <label style={styles.label}>Konfirmasi Password</label>
                        <div style={styles.passwordWrap}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={passwordConfirmation}
                                onChange={e => setPasswordConfirmation(e.target.value)}
                                onFocus={() => setFocusedField("confirm")}
                                onBlur={() => setFocusedField(null)}
                                required
                                placeholder="••••••••"
                                style={{ ...inputStyle("confirm"), paddingRight: "46px" }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.eyeBtn}
                            >
                                {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* ROLE */}
                    <div style={styles.inputWrap}>
                        <label style={styles.label}>Role</label>
                        <select
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            onFocus={() => setFocusedField("role")}
                            onBlur={() => setFocusedField(null)}
                            style={selectStyle("role")}
                        >
                            <option value="owner">Owner</option>
                            <option value="klien">Klien</option>
                            <option value="kurir">Kurir</option>
                            <option value="operator_sppg">Operator SPPG</option>
                        </select>
                    </div>

                    {/* OWNER FIELDS */}
                    {role === "owner" && (
                        <>
                            <div style={styles.inputWrap}>
                                <label style={styles.label}>Nama Catering</label>
                                <input
                                    type="text"
                                    placeholder="Masukkan nama catering"
                                    value={namaCatering}
                                    onChange={e => setNamaCatering(e.target.value)}
                                    onFocus={() => setFocusedField("namaCatering")}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    style={inputStyle("namaCatering")}
                                />
                            </div>

                            <div style={{ marginBottom: "28px" }}>
                                <label style={styles.label}>Alamat Catering</label>
                                <textarea
                                    placeholder="Masukkan alamat catering"
                                    value={alamatCatering}
                                    onChange={e => setAlamatCatering(e.target.value)}
                                    onFocus={() => setFocusedField("alamatCatering")}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    style={textareaStyle("alamatCatering")}
                                />
                                <button
                                    type="button"
                                    onClick={getLocation}
                                    style={styles.locationBtn}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(37,99,235,0.2)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "rgba(37,99,235,0.12)"}
                                >
                                    📍 Ambil Lokasi Saya
                                </button>
                                {latitude && longitude && (
                                    <div style={styles.locationInfo}>
                                        Latitude: {latitude}<br />
                                        Longitude: {longitude}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* OPERATOR SPPG FIELDS */}
                    {role === "operator_sppg" && (
                        <>
                            <div style={styles.inputWrap}>
                                <label style={styles.label}>Nama SPPG</label>
                                <input
                                    type="text"
                                    placeholder="Masukkan nama SPPG"
                                    value={namaSppg}
                                    onChange={e => setNamaSppg(e.target.value)}
                                    onFocus={() => setFocusedField("namaSppg")}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    style={inputStyle("namaSppg")}
                                />
                            </div>

                            <div style={{ marginBottom: "28px" }}>
                                <label style={styles.label}>Alamat SPPG</label>
                                <textarea
                                    placeholder="Masukkan alamat SPPG"
                                    value={alamatSppg}
                                    onChange={e => setAlamatSppg(e.target.value)}
                                    onFocus={() => setFocusedField("alamatSppg")}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    style={textareaStyle("alamatSppg")}
                                />
                            </div>
                        </>
                    )}

                    {/* KURIR FIELDS */}
                    {role === "kurir" && (
                        <>
                            <div style={styles.inputWrap}>
                                <label style={styles.label}>No. Telepon</label>
                                <input
                                    type="text"
                                    placeholder="08xxxxxxxxxx"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    onFocus={() => setFocusedField("phone")}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    style={inputStyle("phone")}
                                />
                            </div>

                            {/* Pilih daftar ke Catering atau SPPG */}
                            <div style={styles.inputWrap}>
                                <label style={styles.label}>Daftar Sebagai Kurir</label>
                                <div style={styles.segmentWrap}>
                                    <button
                                        type="button"
                                        onClick={() => handleKurirTypeChange("catering")}
                                        style={{
                                            ...styles.segmentBtn,
                                            ...(kurirType === "catering" ? styles.segmentBtnActive : {}),
                                        }}
                                    >
                                        Kurir Catering
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleKurirTypeChange("sppg")}
                                        style={{
                                            ...styles.segmentBtn,
                                            ...(kurirType === "sppg" ? styles.segmentBtnActive : {}),
                                        }}
                                    >
                                        Kurir SPPG
                                    </button>
                                </div>
                            </div>

                            {/* Dropdown pilihan catering / SPPG (data asli dari backend) */}
                            <div style={{ marginBottom: "28px" }}>
                                <label style={styles.label}>
                                    {kurirType === "sppg" ? "Pilih SPPG" : "Pilih Catering"}
                                </label>
                                <select
                                    value={employerId ?? ""}
                                    onChange={e => setEmployerId(e.target.value ? Number(e.target.value) : null)}
                                    onFocus={() => setFocusedField("employer")}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    disabled={loadingEmployers || employerList.length === 0}
                                    style={selectStyle("employer")}
                                >
                                    <option value="" disabled>
                                        {loadingEmployers
                                            ? "Memuat data..."
                                            : employerList.length === 0
                                                ? (kurirType === "sppg" ? "Belum ada SPPG terdaftar" : "Belum ada catering terdaftar")
                                                : "-- Pilih --"}
                                    </option>
                                    {employerList.map(item => (
                                        <option key={item.id} value={item.id}>
                                            {kurirType === "sppg" ? item.nama_sppg : item.nama_catering}
                                        </option>
                                    ))}
                                </select>

                                {selectedEmployer && (
                                    <div style={styles.locationInfo}>
                                        {kurirType === "sppg"
                                            ? selectedEmployer.alamat_sppg
                                            : selectedEmployer.alamat_catering}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.submitBtn,
                            opacity: loading ? 0.65 : 1,
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                        onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.88" }}
                        onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = "1" }}
                    >
                        {loading ? "Registering…" : "Create Account"}
                    </button>
                </form>

                {/* FOOTER */}
                <div style={styles.loginRow}>
                    Sudah punya akun?{" "}
                    <Link to="/login" style={styles.loginLink}>
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}