import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

export default function PesanMakan() {
    const [menus, setMenus] = useState([]);
    const [menuId, setMenuId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [address, setAddress] = useState("");

    useEffect(() => {
        axios.get("/api/menus", { withCredentials: true })
            .then(res => setMenus(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleSubmit = e => {
        e.preventDefault();
        axios.post("/api/klien/orders", {
            menu_id: menuId,
            quantity,
            delivery_address: address
        }, { withCredentials: true })
        .then(res => {
            alert("Pesanan berhasil dibuat!");
            setMenuId("");
            setQuantity(1);
            setAddress("");
        })
        .catch(err => alert("Gagal membuat pesanan!"));
    };

    return (
        <div className="flex">
            <Sidebar role="klien" />
            <div className="flex-1">
                <Navbar role="klien" />
                <div className="p-4">
                    <h1>Pesan Makan</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                        <select value={menuId} onChange={e => setMenuId(e.target.value)} required>
                            <option value="">Pilih Menu</option>
                            {menus.map(menu => (
                                <option key={menu.id} value={menu.id}>{menu.name}</option>
                            ))}
                        </select>
                        <input type="number" value={quantity} min="1" onChange={e => setQuantity(e.target.value)} required />
                        <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Alamat" required />
                        <button type="submit">Pesan</button>
                    </form>
                </div>
            </div>
        </div>
    );
}