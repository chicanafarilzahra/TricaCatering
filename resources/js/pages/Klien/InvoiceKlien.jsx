// resources/js/pages/Klien/InvoiceKlien.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

import NavbarKlien from "../../components/NavbarKlien";

import {
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

export default function InvoiceKlien() {
  const [invoices, setInvoices] = useState([]);
  const [totalTagihan, setTotalTagihan] = useState(0);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.background = "#071028";

    loadInvoice();
  }, []);

  const loadInvoice = async () => {
    try {
      const res = await axios.get("/api/klien/invoice");

      setInvoices(res.data.data || []);
      setTotalTagihan(res.data.total_tagihan || 0);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#071028",
        color: "#fff",
      }}
    >
      <NavbarKlien />

      <div
        style={{
          padding: "30px",
          maxWidth: "1600px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            background:
              "linear-gradient(135deg,#17306a,#21429b)",
            borderRadius: "24px",
            padding: "30px",
            marginBottom: "25px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "38px",
              fontWeight: "800",
            }}
          >
            Invoice Pembayaran
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.75)",
              marginTop: "10px",
            }}
          >
            Semua riwayat tagihan dan pembayaran Anda
          </p>
        </div>

        {/* TOTAL */}
        <div
          style={{
            background: "#182338",
            borderRadius: "24px",
            padding: "24px",
            marginBottom: "24px",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              color: "#94a3b8",
              marginBottom: "10px",
            }}
          >
            Total Tagihan
          </div>

          <h2
            style={{
              margin: 0,
              color: "#22c55e",
              fontSize: "40px",
              fontWeight: "800",
            }}
          >
            Rp {Number(totalTagihan).toLocaleString("id-ID")}
          </h2>
        </div>

        {/* TABLE */}
        <div
          style={{
            background: "#182338",
            borderRadius: "24px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              padding: "22px",
              fontSize: "22px",
              fontWeight: "700",
              borderBottom:
                "1px solid rgba(255,255,255,0.05)",
            }}
          >
            Daftar Invoice
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#0f172a",
                  }}
                >
                  <th style={th}>No</th>
                  <th style={th}>Menu</th>
                  <th style={th}>Jumlah</th>
                  <th style={th}>Total</th>
                  <th style={th}>Status</th>
                </tr>
              </thead>

              <tbody>
                {invoices.length > 0 ? (
                  invoices.map((item, index) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom:
                          "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <td style={td}>{index + 1}</td>

                      <td style={td}>
                        {item.menu?.name || "-"}
                      </td>

                      <td style={td}>
                        {item.quantity}
                      </td>

                      <td style={td}>
                        Rp{" "}
                        {Number(
                          item.total_price
                        ).toLocaleString("id-ID")}
                      </td>

                      <td style={td}>
                        <StatusBadge
                          status={item.status}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#94a3b8",
                      }}
                    >
                      <FaFileInvoiceDollar
                        size={40}
                        style={{
                          marginBottom: "10px",
                        }}
                      />
                      <br />
                      Belum ada invoice
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const selesai =
    status === "paid" ||
    status === "selesai";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 14px",
        borderRadius: "999px",
        background: selesai
          ? "rgba(34,197,94,.15)"
          : "rgba(245,158,11,.15)",
        color: selesai
          ? "#22c55e"
          : "#f59e0b",
        fontWeight: "700",
      }}
    >
      {selesai ? (
        <FaCheckCircle />
      ) : (
        <FaClock />
      )}

      {status}
    </div>
  );
}

const th = {
  padding: "18px",
  textAlign: "left",
  color: "#94a3b8",
  fontSize: "14px",
};

const td = {
  padding: "18px",
  color: "#ffffff",
};