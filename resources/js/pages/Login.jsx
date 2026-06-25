// resources/js/pages/Login.jsx

import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
        const response = await axios.post(
            "http://127.0.0.1:8000/api/login",
            { email, password }
        );

        console.log("LOGIN RESPONSE:", response.data);

        const role =
            (response.data.user.role || "").toLowerCase();

        // simpan auth
        localStorage.setItem(
            "auth_token",
            response.data.token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
        );

        axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${response.data.token}`;

        // 🔥 PAKAI NAVIGATE (INI KUNCI)
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
        alert(
            error.response?.data?.message ||
                "Login gagal"
        );
    } finally {
        setLoading(false);
    }
}
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background:
                    "linear-gradient(135deg,#071028,#0f172a,#111827)",
                overflowY: "auto",
                overflowX: "hidden",
            }}
        >
            <div
                style={{
                    minHeight: "100vh",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    padding: "40px 20px",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "520px",
                        background: "#182338",
                        padding: "42px",
                        borderRadius: "28px",
                        border: "1px solid rgba(255,255,255,0.06)",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
                        marginTop: "20px",
                        marginBottom: "20px",
                    }}
                >
                    {/* BACK BUTTON */}
                    <div style={{ marginBottom: "20px" }}>
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                background: "transparent",
                                border: "none",
                                color: "#cbd5e1",
                                cursor: "pointer",
                                fontSize: "15px",
                                fontWeight: "600",
                                padding: 0,
                            }}
                        >
                            <FaArrowLeft size={12} />
                        </button>
                    </div>

                    {/* LOGO */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: "24px",
                        }}
                    >
                        <div
                            style={{
                                width: "72px",
                                height: "72px",
                                borderRadius: "22px",
                                background:
                                    "linear-gradient(135deg,#2563eb,#3b82f6)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: "38px",
                                fontWeight: "800",
                                boxShadow:
                                    "0 14px 40px rgba(37,99,235,0.45)",
                            }}
                        >
                            T
                        </div>
                    </div>

                    {/* TITLE */}
                    <h1
                        style={{
                            margin: 0,
                            textAlign: "center",
                            fontSize: "38px",
                            fontWeight: "800",
                            color: "#fff",
                        }}
                    >
                        TriCa Catering
                    </h1>

                    <p
                        style={{
                            margin: "10px 0 32px",
                            textAlign: "center",
                            color: "#94a3b8",
                            fontSize: "15px",
                        }}
                    >
                        Sign in to your account
                    </p>

                    {/* FORM */}
                    <form onSubmit={handleLogin}>
                        {/* EMAIL */}
                        <div style={{ marginBottom: "18px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: "#cbd5e1",
                                }}
                            >
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    height: "56px",
                                    border:
                                        "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: "14px",
                                    padding: "0 16px",
                                    fontSize: "14px",
                                    outline: "none",
                                    background: "#0f172a",
                                    color: "#fff",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        {/* PASSWORD */}
                        <div style={{ marginBottom: "24px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: "#cbd5e1",
                                }}
                            >
                                Password
                            </label>

                            <div style={{ position: "relative" }}>
                                <input
                                    type={
                                        showPassword ? "text" : "password"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    style={{
                                        width: "100%",
                                        height: "56px",
                                        border:
                                            "1px solid rgba(255,255,255,0.08)",
                                        borderRadius: "14px",
                                        padding: "0 50px 0 16px",
                                        fontSize: "14px",
                                        outline: "none",
                                        background: "#0f172a",
                                        color: "#fff",
                                        boxSizing: "border-box",
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        right: "16px",
                                        transform: "translateY(-50%)",
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#94a3b8",
                                    }}
                                >
                                    {showPassword ? (
                                        <FaEyeSlash size={18} />
                                    ) : (
                                        <FaEye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* BUTTON LOGIN */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                height: "58px",
                                border: "none",
                                borderRadius: "14px",
                                background:
                                    "linear-gradient(135deg,#2563eb,#3b82f6)",
                                color: "#fff",
                                fontWeight: "700",
                                fontSize: "15px",
                                cursor: loading
                                    ? "not-allowed"
                                    : "pointer",
                                opacity: loading ? 0.7 : 1,
                                boxShadow:
                                    "0 12px 30px rgba(37,99,235,0.35)",
                            }}
                        >
                            {loading ? "Signing In..." : "Login"}
                        </button>
                    </form>

                    {/* REGISTER */}
                    <div
                        style={{
                            marginTop: "24px",
                            textAlign: "center",
                            fontSize: "14px",
                            color: "#94a3b8",
                        }}
                    >
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            style={{
                                color: "#60a5fa",
                                textDecoration: "none",
                                fontWeight: "700",
                            }}
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}