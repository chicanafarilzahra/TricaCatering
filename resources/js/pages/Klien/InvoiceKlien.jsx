import React, { useEffect, useState } from "react";
import axios from "axios";

import SidebarKlien from "../../components/SidebarKlien";
import NavbarKlien from "../../components/NavbarKlien";

export default function InvoiceKlien() {
  const [invoices, setInvoices] = useState([]);
  const [totalTagihan, setTotalTagihan] = useState(0);

  useEffect(() => {
    axios
      .get("/api/klien/invoice") // endpoint API invoice
      .then((res) => {
        setInvoices(res.data.data);
        setTotalTagihan(res.data.total_tagihan);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0f172a" }}>
      <SidebarKlien />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <NavbarKlien title="Invoice" />
        <div style={{ padding: "24px", overflowY: "auto" }}>
          <h2 style={{ color: "#ffffff" }}>Invoice</h2>
          <p style={{ color: "#94a3b8" }}>Total Tagihan: Rp {totalTagihan.toLocaleString()}</p>
          <table style={{ width: "100%", color: "#ffffff", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>No</th>
                <th>Pesanan</th>
                <th>Jumlah</th>
                <th>Harga</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, idx) => (
                <tr key={inv.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <td>{idx + 1}</td>
                  <td>{inv.menu?.name}</td>
                  <td>{inv.quantity}</td>
                  <td>Rp {inv.total_price.toLocaleString()}</td>
                  <td>{inv.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}