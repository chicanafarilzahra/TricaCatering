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

            // TOKEN
            localStorage.setItem(
                "token",
                response.data.token
            );

            // USER
            localStorage.setItem(
                "user",
                JSON.stringify(
                    response.data.user
                )
            );

            // ROLE
            const role =
                response.data.user?.role?.toLowerCase();

            switch (role) {
                case "owner":
                    navigate("/owner");
                    break;

                case "admin":
                    navigate("/");
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
                    navigate("/");
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

    // LOGIN GOOGLE
    const handleGoogleLogin = () => {
        window.location.href =
            "/api/auth/google/redirect";
    };

    return (
        <div
            style={{
                width: "100%",
                minHeight: "100vh",
                margin: 0,
                display: "flex",
                justifyContent:
                    "center",
                alignItems: "center",
                background:
                    "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                padding: "24px",
                overflow: "hidden",
                boxSizing:
                    "border-box",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "560px",
                    background:
                        "rgba(255,255,255,0.98)",
                    padding: "52px",
                    borderRadius:
                        "28px",
                    boxShadow:
                        "0 30px 80px rgba(0,0,0,0.25)",
                    boxSizing:
                        "border-box",
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
                            width: "64px",
                            height: "64px",
                            borderRadius:
                                "20px",
                            background:
                                "linear-gradient(135deg,#6366f1,#8b5cf6)",
                            display:
                                "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            color: "white",
                            fontSize:
                                "36px",
                            fontWeight:
                                "800",
                            boxShadow:
                                "0 20px 40px rgba(99,102,241,0.35)",
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
                            "32px",
                        fontWeight:
                            "800",
                        color:
                            "#0f172a",
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
                            "#64748b",
                        fontSize:
                            "14px",
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
                        height: "52px",
                        border:
                            "1px solid #dbe2ea",
                        borderRadius:
                            "14px",
                        background:
                            "#ffffff",
                        color:
                            "#0f172a",
                        fontWeight:
                            "600",
                        fontSize:
                            "14px",
                        cursor:
                            "pointer",
                        display: "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        gap: "10px",
                        marginBottom:
                            "24px",
                        transition:
                            "0.2s",
                    }}
                >
                    <FcGoogle
                        size={22}
                    />
                    Login with Google
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
                            height: "1px",
                            background:
                                "#e2e8f0",
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
                            height: "1px",
                            background:
                                "#e2e8f0",
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
                                    "#334155",
                            }}
                        >
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
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
                                    "52px",
                                border:
                                    "1px solid #cbd5e1",
                                borderRadius:
                                    "14px",
                                padding:
                                    "0 16px",
                                fontSize:
                                    "14px",
                                outline:
                                    "none",
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
                                    "#334155",
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
                                    "52px",
                                border:
                                    "1px solid #cbd5e1",
                                borderRadius:
                                    "14px",
                                padding:
                                    "0 16px",
                                fontSize:
                                    "14px",
                                outline:
                                    "none",
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
                            width: "100%",
                            height: "58px",
                            border: "none",
                            borderRadius:
                                "14px",
                            background:
                                "linear-gradient(135deg,#6366f1,#8b5cf6)",
                            color: "white",
                            fontWeight:
                                "700",
                            fontSize:
                                "14px",
                            cursor:
                                loading
                                    ? "not-allowed"
                                    : "pointer",
                            opacity:
                                loading
                                    ? 0.7
                                    : 1,
                            boxShadow:
                                "0 14px 30px rgba(99,102,241,0.35)",
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
                        marginTop: "24px",
                        textAlign:
                            "center",
                        fontSize:
                            "14px",
                        color:
                            "#64748b",
                    }}
                >
                    Don't have an
                    account?{" "}
                    <Link
                        to="/register"
                        style={{
                            color:
                                "#6366f1",
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
    );
}