// resources/js/pages/Register.jsx

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] =
        useState("");

    const [role, setRole] = useState("klien");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");

        try {
            const res = await axios.post("/api/register", {
                name,
                email,
                password,
                password_confirmation:
                    passwordConfirmation,
                role,
            });

            localStorage.setItem(
                "token",
                res.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            setMessage("Register berhasil!");

            switch (role) {
                case "owner":
                    navigate("/owner");
                    break;

                case "kurir":
                    navigate("/kurir");
                    break;

                case "operator_sppg":
                    navigate("/sppg");
                    break;

                case "klien":
                    navigate("/klien");
                    break;

                default:
                    navigate("/");
                    break;
            }
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                    "Register gagal"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background:
                    "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                padding: "24px",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "560px",
                    background:
                        "rgba(255,255,255,0.98)",
                    padding: "52px",
                    borderRadius: "28px",
                    boxShadow:
                        "0 30px 80px rgba(0,0,0,0.25)",
                    boxSizing: "border-box",
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "24px",
                    }}
                >
                    <div
                        style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "20px",
                            background:
                                "linear-gradient(135deg,#6366f1,#8b5cf6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "24px",
                            fontWeight: "800",
                            boxShadow:
                                "0 20px 40px rgba(99,102,241,0.35)",
                        }}
                    >
                        T
                    </div>
                </div>

                {/* Title */}
                <h1
                    style={{
                        margin: 0,
                        textAlign: "center",
                        fontSize: "32px",
                        fontWeight: "800",
                        color: "#0f172a",
                    }}
                >
                    TriCa Catering
                </h1>

                <p
                    style={{
                        margin: "10px 0 32px",
                        textAlign: "center",
                        color: "#64748b",
                        fontSize: "14px",
                    }}
                >
                    Create your account
                </p>

                {/* Message */}
                {message && (
                    <div
                        style={{
                            marginBottom: "18px",
                            padding: "14px",
                            borderRadius: "12px",
                            background:
                                message ===
                                "Register berhasil!"
                                    ? "rgba(34,197,94,0.12)"
                                    : "rgba(239,68,68,0.12)",
                            color:
                                message ===
                                "Register berhasil!"
                                    ? "#16a34a"
                                    : "#dc2626",
                            fontSize: "14px",
                            textAlign: "center",
                            fontWeight: "600",
                        }}
                    >
                        {message}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Nama */}
                    <div
                        style={{
                            marginBottom: "18px",
                        }}
                    >
                        <label
                            style={{
                                display: "block",
                                marginBottom:
                                    "8px",
                                fontSize: "13px",
                                fontWeight:
                                    "600",
                                color: "#334155",
                            }}
                        >
                            Nama
                        </label>

                        <input
                            type="text"
                            placeholder="Masukkan nama"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* Email */}
                    <div
                        style={{
                            marginBottom: "18px",
                        }}
                    >
                        <label
                            style={{
                                display: "block",
                                marginBottom:
                                    "8px",
                                fontSize: "13px",
                                fontWeight:
                                    "600",
                                color: "#334155",
                            }}
                        >
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* Password */}
                    <div
                        style={{
                            marginBottom: "18px",
                        }}
                    >
                        <label
                            style={{
                                display: "block",
                                marginBottom:
                                    "8px",
                                fontSize: "13px",
                                fontWeight:
                                    "600",
                                color: "#334155",
                            }}
                        >
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* Konfirmasi Password */}
                    <div
                        style={{
                            marginBottom: "18px",
                        }}
                    >
                        <label
                            style={{
                                display: "block",
                                marginBottom:
                                    "8px",
                                fontSize: "13px",
                                fontWeight:
                                    "600",
                                color: "#334155",
                            }}
                        >
                            Konfirmasi Password
                        </label>

                        <input
                            type="password"
                            placeholder="Confirm password"
                            value={
                                passwordConfirmation
                            }
                            onChange={(e) =>
                                setPasswordConfirmation(
                                    e.target.value
                                )
                            }
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* Role */}
                    <div
                        style={{
                            marginBottom: "24px",
                        }}
                    >
                        <label
                            style={{
                                display: "block",
                                marginBottom:
                                    "8px",
                                fontSize: "13px",
                                fontWeight:
                                    "600",
                                color: "#334155",
                            }}
                        >
                            Role
                        </label>

                        <select
                            value={role}
                            onChange={(e) =>
                                setRole(
                                    e.target.value
                                )
                            }
                            style={inputStyle}
                        >
                            <option value="owner">
                                Owner
                            </option>

                            <option value="klien">
                                Klien
                            </option>

                            <option value="kurir">
                                Kurir
                            </option>

                            <option value="operator_sppg">
                                Operator SPPG
                            </option>
                        </select>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            height: "58px",
                            border: "none",
                            borderRadius:
                                "14px",
                            background:
                                "linear-gradient(135deg,#6366f1,#8b5cf6)",
                            color: "white",
                            fontWeight: "700",
                            fontSize: "20px",
                            cursor: loading
                                ? "not-allowed"
                                : "pointer",
                            opacity: loading
                                ? 0.7
                                : 1,
                            boxShadow:
                                "0 14px 30px rgba(99,102,241,0.35)",
                        }}
                    >
                        {loading
                            ? "Registering..."
                            : "Register"}
                    </button>
                </form>

                {/* Footer */}
                <p
                    style={{
                        textAlign: "center",
                        marginTop: "24px",
                        color: "#64748b",
                        fontSize: "14px",
                    }}
                >
                    Sudah punya akun?{" "}
                    <Link
                        to="/login"
                        style={{
                            color: "#6366f1",
                            fontWeight: "700",
                            textDecoration: "none",
                        }}
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    height: "52px",
    border: "1px solid #cbd5e1",
    borderRadius: "14px",
    padding: "0 16px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    background: "#fff",
};