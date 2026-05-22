// resources/js/pages/Login.jsx

import { useState } from "react";
import axios from "axios";
import {
    useNavigate,
    Link,
} from "react-router-dom";

import { FcGoogle } from "react-icons/fc";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    async function handleLogin(e) {
        e.preventDefault();

        setLoading(true);

        try {
            const response =
                await axios.post(
                    "/api/login",
                    {
                        email,
                        password,
                    }
                );

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(
                    response.data.user
                )
            );

            const role =
                response.data.user?.role?.toLowerCase();

            switch (role) {
                case "owner":
                    navigate("/owner");
                    break;

                case "admin":
                    navigate("/dashboard");
                    break;

                case "kurir":
                    navigate("/kurir");
                    break;

                case "klien":
                    navigate("/klien");
                    break;

                case "operator_sppg":
                    navigate("/sppg");
                    break;

                default:
                    navigate("/dashboard");
                    break;
            }
        } catch (error) {
            alert(
                error.response?.data
                    ?.message ||
                    "Login gagal"
            );
        } finally {
            setLoading(false);
        }
    }

    const handleGoogleLogin = () => {
        window.location.href =
            "/api/auth/google/redirect";
    };

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
                    justifyContent:
                        "center",

                    alignItems:
                        "flex-start",

                    padding:
                        "40px 20px",

                    boxSizing:
                        "border-box",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "520px",

                        background:
                            "#182338",

                        padding: "42px",

                        borderRadius:
                            "28px",

                        border:
                            "1px solid rgba(255,255,255,0.06)",

                        boxShadow:
                            "0 20px 60px rgba(0,0,0,0.45)",

                        boxSizing:
                            "border-box",

                        marginTop:
                            "20px",

                        marginBottom:
                            "20px",
                    }}
                >
                    {/* LOGO */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "center",

                            marginBottom:
                                "24px",
                        }}
                    >
                        <div
                            style={{
                                width: "72px",
                                height:
                                    "72px",

                                borderRadius:
                                    "22px",

                                background:
                                    "linear-gradient(135deg,#2563eb,#3b82f6)",

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "center",

                                color:
                                    "#ffffff",

                                fontSize:
                                    "38px",

                                fontWeight:
                                    "800",

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

                            textAlign:
                                "center",

                            fontSize:
                                "38px",

                            fontWeight:
                                "800",

                            color:
                                "#ffffff",
                        }}
                    >
                        TriCa Catering
                    </h1>

                    <p
                        style={{
                            margin:
                                "10px 0 32px",

                            textAlign:
                                "center",

                            color:
                                "#94a3b8",

                            fontSize:
                                "15px",
                        }}
                    >
                        Sign in to your
                        account
                    </p>

                    {/* GOOGLE LOGIN */}
                    <button
                        type="button"
                        onClick={
                            handleGoogleLogin
                        }
                        style={{
                            width: "100%",
                            height: "56px",

                            border:
                                "1px solid rgba(255,255,255,0.08)",

                            borderRadius:
                                "14px",

                            background:
                                "#0f172a",

                            color:
                                "#ffffff",

                            fontWeight:
                                "600",

                            fontSize:
                                "14px",

                            cursor:
                                "pointer",

                            display:
                                "flex",

                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            gap: "10px",

                            marginBottom:
                                "24px",
                        }}
                    >
                        <FcGoogle
                            size={22}
                        />
                        Login with
                        Google
                    </button>

                    {/* DIVIDER */}
                    <div
                        style={{
                            display: "flex",

                            alignItems:
                                "center",

                            gap: "12px",

                            marginBottom:
                                "24px",
                        }}
                    >
                        <div
                            style={{
                                flex: 1,
                                height:
                                    "1px",

                                background:
                                    "rgba(255,255,255,0.08)",
                            }}
                        />

                        <span
                            style={{
                                fontSize:
                                    "12px",

                                color:
                                    "#94a3b8",

                                fontWeight:
                                    "600",
                            }}
                        >
                            OR
                        </span>

                        <div
                            style={{
                                flex: 1,
                                height:
                                    "1px",

                                background:
                                    "rgba(255,255,255,0.08)",
                            }}
                        />
                    </div>

                    {/* FORM */}
                    <form
                        onSubmit={
                            handleLogin
                        }
                    >
                        {/* EMAIL */}
                        <div
                            style={{
                                marginBottom:
                                    "18px",
                            }}
                        >
                            <label
                                style={{
                                    display:
                                        "block",

                                    marginBottom:
                                        "8px",

                                    fontSize:
                                        "13px",

                                    fontWeight:
                                        "600",

                                    color:
                                        "#cbd5e1",
                                }}
                            >
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={
                                    email
                                }
                                onChange={(
                                    e
                                ) =>
                                    setEmail(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                required
                                style={{
                                    width:
                                        "100%",

                                    height:
                                        "56px",

                                    border:
                                        "1px solid rgba(255,255,255,0.08)",

                                    borderRadius:
                                        "14px",

                                    padding:
                                        "0 16px",

                                    fontSize:
                                        "14px",

                                    outline:
                                        "none",

                                    background:
                                        "#0f172a",

                                    color:
                                        "#ffffff",

                                    boxSizing:
                                        "border-box",
                                }}
                            />
                        </div>

                        {/* PASSWORD */}
                        <div
                            style={{
                                marginBottom:
                                    "24px",
                            }}
                        >
                            <label
                                style={{
                                    display:
                                        "block",

                                    marginBottom:
                                        "8px",

                                    fontSize:
                                        "13px",

                                    fontWeight:
                                        "600",

                                    color:
                                        "#cbd5e1",
                                }}
                            >
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={
                                    password
                                }
                                onChange={(
                                    e
                                ) =>
                                    setPassword(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                required
                                style={{
                                    width:
                                        "100%",

                                    height:
                                        "56px",

                                    border:
                                        "1px solid rgba(255,255,255,0.08)",

                                    borderRadius:
                                        "14px",

                                    padding:
                                        "0 16px",

                                    fontSize:
                                        "14px",

                                    outline:
                                        "none",

                                    background:
                                        "#0f172a",

                                    color:
                                        "#ffffff",

                                    boxSizing:
                                        "border-box",
                                }}
                            />
                        </div>

                        {/* BUTTON LOGIN */}
                        <button
                            type="submit"
                            disabled={
                                loading
                            }
                            style={{
                                width:
                                    "100%",

                                height:
                                    "58px",

                                border:
                                    "none",

                                borderRadius:
                                    "14px",

                                background:
                                    "linear-gradient(135deg,#2563eb,#3b82f6)",

                                color:
                                    "#ffffff",

                                fontWeight:
                                    "700",

                                fontSize:
                                    "15px",

                                cursor:
                                    loading
                                        ? "not-allowed"
                                        : "pointer",

                                opacity:
                                    loading
                                        ? 0.7
                                        : 1,

                                boxShadow:
                                    "0 12px 30px rgba(37,99,235,0.35)",
                            }}
                        >
                            {loading
                                ? "Signing In..."
                                : "Login"}
                        </button>
                    </form>

                    {/* REGISTER */}
                    <div
                        style={{
                            marginTop:
                                "24px",

                            textAlign:
                                "center",

                            fontSize:
                                "14px",

                            color:
                                "#94a3b8",
                        }}
                    >
                        Don't have an
                        account?{" "}
                        <Link
                            to="/register"
                            style={{
                                color:
                                    "#60a5fa",

                                textDecoration:
                                    "none",

                                fontWeight:
                                    "700",
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