import {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import SidebarSPPG from "../../components/SidebarSPPG";

export default function MenuHarianSPPG() {
    const [menus, setMenus] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        fetchMenus();
    }, []);

    async function fetchMenus() {
        try {
            const token = localStorage.getItem("token");

                await axios.post(
                    "/api/sppg/sekolah",
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
            );

            const res =
                await axios.get(
                    "/api/sppg/menus",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

            setMenus(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#0f172a",
            }}
        >
            <SidebarSPPG />

            <div
                style={{
                    marginLeft: "270px",
                    padding: "30px",
                }}
            >
                <h1
                    style={{
                        color: "#fff",
                        fontSize: "32px",
                        fontWeight: "800",
                        marginBottom: "25px",
                    }}
                >
                    Menu Harian
                </h1>

                <div
                    style={{
                        background: "#182338",
                        borderRadius: "24px",
                        padding: "24px",
                        border:
                            "1px solid rgba(255,255,255,0.05)",
                    }}
                >
                    {loading ? (
                        <p
                            style={{
                                color: "#fff",
                            }}
                        >
                            Loading...
                        </p>
                    ) : (
                        <table
                            style={{
                                width: "100%",
                                borderCollapse:
                                    "collapse",
                                color: "#fff",
                            }}
                        >
                            <thead>
                                <tr>
                                    <th align="left">
                                        Nama Menu
                                    </th>

                                    <th align="left">
                                        Deskripsi
                                    </th>

                                    <th align="left">
                                        Harga
                                    </th>

                                    <th align="left">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {menus.map(
                                    (menu) => (
                                        <tr
                                            key={
                                                menu.id
                                            }
                                        >
                                            <td
                                                style={{
                                                    padding:
                                                        "15px 0",
                                                }}
                                            >
                                                {
                                                    menu.nama_menu
                                                }
                                            </td>

                                            <td>
                                                {
                                                    menu.deskripsi
                                                }
                                            </td>

                                            <td>
                                                Rp{" "}
                                                {Number(
                                                    menu.harga ??
                                                        0
                                                ).toLocaleString()}
                                            </td>

                                            <td>
                                                {menu.is_active
                                                    ? "Aktif"
                                                    : "Nonaktif"}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}