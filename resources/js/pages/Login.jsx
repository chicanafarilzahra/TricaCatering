// resources/js/pages/Login.jsx

import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";

const styles = {
    page: {
        position: "fixed",
        inset: 0,
        background: "#080d18",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        overflowY: "auto",
    },
    card: {
        width: "100%",
        maxWidth: "420px",
        margin: "40px 20px",
        padding: "48px 44px",
        background: "#0f1623",
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
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
    passwordWrap: {
        position: "relative",
        marginBottom: "28px",
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
    },
    registerRow: {
        marginTop: "20px",
        textAlign: "center",
        fontSize: "13px",
        color: "#475569",
    },
    registerLink: {
        color: "#60a5fa",
        textDecoration: "none",
        fontWeight: "600",
    },
};

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/login",
                { email, password }
            );

            console.log("LOGIN RESPONSE:", response.data);

            const role = (response.data.user.role || "").toLowerCase();

            localStorage.setItem("auth_token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

            const go = (path) => navigate("/" + path);

            switch (role) {
                case "admin":
                    go("dashboard");
                    break;
                case "owner":
                    go("owner");
                    break;
                case "kurir":
                    go("kurir");
                    break;
                case "klien":
                    go("klien");
                    break;
                case "operator_sppg":
                    go("sppg/dashboard");
                    break;
                default:
                    alert("Role tidak dikenal: " + role);
            }
        } catch (error) {
            alert(error.response?.data?.message || "Login gagal");
        } finally {
            setLoading(false);
        }
    }

    const inputStyle = (field) => ({
        ...styles.inputBase,
        borderColor: focusedField === field
            ? "rgba(59,130,246,0.5)"
            : "rgba(255,255,255,0.07)",
        boxShadow: focusedField === field
            ? "0 0 0 3px rgba(59,130,246,0.08)"
            : "none",
    });

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
                <h1 style={styles.heading}>Welcome back</h1>
                <p style={styles.subheading}>Sign in to continue</p>

                {/* FORM */}
                <form onSubmit={handleLogin}>

                    {/* EMAIL */}
                    <div style={styles.inputWrap}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocusedField("email")}
                            onBlur={() => setFocusedField(null)}
                            required
                            placeholder="you@example.com"
                            style={inputStyle("email")}
                        />
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label style={styles.label}>Password</label>
                        <div style={styles.passwordWrap}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setFocusedField("password")}
                                onBlur={() => setFocusedField(null)}
                                required
                                placeholder="••••••••"
                                style={{
                                    ...inputStyle("password"),
                                    paddingRight: "46px",
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.eyeBtn}
                            >
                                {showPassword
                                    ? <FaEyeSlash size={16} />
                                    : <FaEye size={16} />
                                }
                            </button>
                        </div>
                    </div>

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
                        {loading ? "Signing in…" : "Sign In"}
                    </button>
                </form>

                {/* REGISTER */}
                <div style={styles.registerRow}>
                    Don't have an account?{" "}
                    <Link to="/register" style={styles.registerLink}>
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}