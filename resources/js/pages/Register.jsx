// resources/js/pages/Register.jsx

import React, { useState } from "react";
import axios from "axios";
import {
    useNavigate,
    Link,
} from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [
        passwordConfirmation,
        setPasswordConfirmation,
    ] = useState("");

    const [role, setRole] =
        useState("klien");

    // TAMBAHAN
    const [
        alamatCatering,
        setAlamatCatering,
    ] = useState("");

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");

        try {
            const res =
                await axios.post(
                    "/api/register",
                    {
                        name,
                        email,
                        password,
                        password_confirmation:
                            passwordConfirmation,
                        role,

                        // TAMBAHAN
                        alamat_catering:
                            role === "owner"
                                ? alamatCatering
                                : null,
                    }
                );

            localStorage.setItem(
                "token",
                res.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(
                    res.data.user
                )
            );

            setMessage(
                "Register berhasil!"
            );

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
                    navigate(
                        "/dashboard"
                    );
                    break;
            }
        } catch (err) {
            setMessage(
                err.response?.data
                    ?.message ||
                    "Register gagal"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                width: "100%",
                height: "100%",
                overflowY: "auto",
                overflowX: "hidden",

                display: "flex",
                justifyContent:
                    "center",

                alignItems:
                    "flex-start",

                background:
                    "linear-gradient(135deg,#071028,#0f172a,#111827)",

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

                    marginBottom:
                        "40px",
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
                            height: "72px",

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
                                "white",

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
                    Create your account
                </p>

                {/* MESSAGE */}
                {message && (
                    <div
                        style={{
                            marginBottom:
                                "18px",

                            padding:
                                "14px",

                            borderRadius:
                                "12px",

                            background:
                                message ===
                                "Register berhasil!"
                                    ? "rgba(34,197,94,0.12)"
                                    : "rgba(239,68,68,0.12)",

                            color:
                                message ===
                                "Register berhasil!"
                                    ? "#22c55e"
                                    : "#ef4444",

                            fontSize:
                                "14px",

                            textAlign:
                                "center",

                            fontWeight:
                                "600",

                            border:
                                "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        {message}
                    </div>
                )}

                {/* FORM */}
                <form
                    onSubmit={
                        handleSubmit
                    }
                >
                    {/* NAMA */}
                    <div
                        style={{
                            marginBottom:
                                "18px",
                        }}
                    >
                        <label
                            style={
                                labelStyle
                            }
                        >
                            Nama
                        </label>

                        <input
                            type="text"
                            placeholder="Masukkan nama"
                            value={name}
                            onChange={(
                                e
                            ) =>
                                setName(
                                    e.target
                                        .value
                                )
                            }
                            required
                            style={
                                inputStyle
                            }
                        />
                    </div>

                    {/* EMAIL */}
                    <div
                        style={{
                            marginBottom:
                                "18px",
                        }}
                    >
                        <label
                            style={
                                labelStyle
                            }
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
                                    e.target
                                        .value
                                )
                            }
                            required
                            style={
                                inputStyle
                            }
                        />
                    </div>

                    {/* PASSWORD */}
                    <div
                        style={{
                            marginBottom:
                                "18px",
                        }}
                    >
                        <label
                            style={
                                labelStyle
                            }
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
                                    e.target
                                        .value
                                )
                            }
                            required
                            style={
                                inputStyle
                            }
                        />
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div
                        style={{
                            marginBottom:
                                "18px",
                        }}
                    >
                        <label
                            style={
                                labelStyle
                            }
                        >
                            Konfirmasi Password
                        </label>

                        <input
                            type="password"
                            placeholder="Confirm password"
                            value={
                                passwordConfirmation
                            }
                            onChange={(
                                e
                            ) =>
                                setPasswordConfirmation(
                                    e.target
                                        .value
                                )
                            }
                            required
                            style={
                                inputStyle
                            }
                        />
                    </div>

                    {/* ROLE */}
                    <div
                        style={{
                            marginBottom:
                                "18px",
                        }}
                    >
                        <label
                            style={
                                labelStyle
                            }
                        >
                            Role
                        </label>

                        <select
                            value={role}
                            onChange={(
                                e
                            ) =>
                                setRole(
                                    e.target
                                        .value
                                )
                            }
                            style={
                                inputStyle
                            }
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
                                Operator
                                SPPG
                            </option>
                        </select>
                    </div>

                    {/* TAMBAHAN ALAMAT CATERING */}
                    {role ===
                        "owner" && (
                        <div
                            style={{
                                marginBottom:
                                    "24px",
                            }}
                        >
                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Alamat
                                Catering
                            </label>

                            <textarea
                                placeholder="Masukkan alamat catering"
                                value={
                                    alamatCatering
                                }
                                onChange={(
                                    e
                                ) =>
                                    setAlamatCatering(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                required
                                style={{
                                    width:
                                        "100%",

                                    minHeight:
                                        "120px",

                                    border:
                                        "1px solid rgba(255,255,255,0.08)",

                                    borderRadius:
                                        "14px",

                                    padding:
                                        "16px",

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

                                    resize:
                                        "vertical",
                                }}
                            />
                        </div>
                    )}

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={
                            loading
                        }
                        style={{
                            width: "100%",

                            height: "58px",

                            border:
                                "none",

                            borderRadius:
                                "14px",

                            background:
                                "linear-gradient(135deg,#2563eb,#3b82f6)",

                            color:
                                "white",

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
                            ? "Registering..."
                            : "Register"}
                    </button>
                </form>

                {/* FOOTER */}
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
                    Sudah punya akun?{" "}
                    <Link
                        to="/login"
                        style={{
                            color:
                                "#60a5fa",

                            textDecoration:
                                "none",

                            fontWeight:
                                "700",
                        }}
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#cbd5e1",
};

const inputStyle = {
    width: "100%",
    height: "56px",

    border:
        "1px solid rgba(255,255,255,0.08)",

    borderRadius: "14px",

    padding: "0 16px",

    fontSize: "14px",

    outline: "none",

    background: "#0f172a",

    color: "#ffffff",

    boxSizing: "border-box",
};