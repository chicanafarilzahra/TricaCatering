// resources/js/pages/Klien/UlasanKlien.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

import NavbarKlien from "../../components/NavbarKlien";

import {
  FaPaperPlane,
  FaStar,
  FaRegStar,
  FaCommentDots,
} from "react-icons/fa";

export default function UlasanKlien() {
  const [pesanan, setPesanan] = useState([]);

  const [formUlasan, setFormUlasan] = useState({
    pesanan_id: "",
    rating_rasa: 0,
    rating_pengiriman: 0,
    komentar: "",
  });

  const [formKomplain, setFormKomplain] = useState({
    kategori: "",
    deskripsi: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPesanan();
  }, []);

  const getPesanan = async () => {
    try {
      const res = await axios.get("/api/klien/pesanan");

      setPesanan(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const kirimUlasan = async () => {
    try {
      setLoading(true);

      await axios.post("/api/klien/ulasan", formUlasan);

      alert("Ulasan berhasil dikirim");

      setFormUlasan({
        pesanan_id: "",
        rating_rasa: 0,
        rating_pengiriman: 0,
        komentar: "",
      });
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim ulasan");
    } finally {
      setLoading(false);
    }
  };

  const kirimKomplain = async () => {
    try {
      setLoading(true);

      await axios.post(
        "/api/klien/komplain",
        formKomplain
      );

      alert("Komplain berhasil dikirim");

      setFormKomplain({
        kategori: "",
        deskripsi: "",
      });
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim komplain");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div
    style={{
      width: "100%",
      minHeight: "100vh",
      background: "#071028",
    }}
  >
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >

        {/* NAVBAR */}
        <NavbarKlien title="Ulasan & Komplain" />

        {/* CONTENT */}
        <div
          className="hide-scrollbar"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "30px",
            boxSizing: "border-box",
            height: "calc(100vh - 80px)",
          }}
        >
          
          {/* HEADER */}
          <div style={{ marginBottom: "28px" }}>
            <h1
              style={{
                margin: 0,
                color: "#ffffff",
                fontSize: "46px",
                fontWeight: "800",
              }}
            >
              Ulasan & Komplain
            </h1>

            <p
              style={{
                marginTop: "12px",
                color: "#94a3b8",
                fontSize: "16px",
              }}
            >
              Berikan masukan agar layanan catering kami
              semakin baik
            </p>
          </div>

          {/* GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(420px,1fr))",
              gap: "24px",
              alignItems: "start",
            }}
          >
            {/* ULASAN */}
            <div
              style={{
                background: "#182338",
                borderRadius: "28px",
                border:
                  "1px solid rgba(255,255,255,0.05)",
                overflow: "hidden",
              }}
            >
              {/* HEADER */}
              <div
                style={{
                  padding: "24px 28px",
                  borderBottom:
                    "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "#ffffff",
                  fontSize: "26px",
                  fontWeight: "700",
                }}
              >
                <FaStar />
                Beri Ulasan
              </div>

              {/* BODY */}
              <div
                style={{
                  padding: "28px",
                }}
              >
                {/* SELECT PESANAN */}
                <Label text="Pesanan" />

                <select
                  value={formUlasan.pesanan_id}
                  onChange={(e) =>
                    setFormUlasan({
                      ...formUlasan,
                      pesanan_id: e.target.value,
                    })
                  }
                  style={selectStyle}
                >
                  <option value="">
                    Pilih Pesanan
                  </option>

                  {pesanan.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      #{item.id} —{" "}
                      {item.menu?.name || "Menu"}
                    </option>
                  ))}
                </select>

                {/* RATING RASA */}
                <Label text="Rating Rasa" />

                <StarRating
                  value={formUlasan.rating_rasa}
                  onChange={(val) =>
                    setFormUlasan({
                      ...formUlasan,
                      rating_rasa: val,
                    })
                  }
                />

                {/* RATING PENGIRIMAN */}
                <Label text="Rating Pengiriman" />

                <StarRating
                  value={formUlasan.rating_pengiriman}
                  onChange={(val) =>
                    setFormUlasan({
                      ...formUlasan,
                      rating_pengiriman: val,
                    })
                  }
                />

                {/* KOMENTAR */}
                <Label text="Komentar" />

                <textarea
                  rows={5}
                  placeholder="Bagikan pengalaman Anda..."
                  value={formUlasan.komentar}
                  onChange={(e) =>
                    setFormUlasan({
                      ...formUlasan,
                      komentar: e.target.value,
                    })
                  }
                  style={textareaStyle}
                />

                {/* BUTTON */}
                <button
                  onClick={kirimUlasan}
                  disabled={loading}
                  style={buttonStyle}
                >
                  <FaPaperPlane />
                  {loading
                    ? "Mengirim..."
                    : "Kirim Ulasan"}
                </button>
              </div>
            </div>

            {/* KOMPLAIN */}
            <div
              style={{
                background: "#182338",
                borderRadius: "28px",
                border:
                  "1px solid rgba(255,255,255,0.05)",
                overflow: "hidden",
              }}
            >
              {/* HEADER */}
              <div
                style={{
                  padding: "24px 28px",
                  borderBottom:
                    "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "#ffffff",
                  fontSize: "26px",
                  fontWeight: "700",
                }}
              >
                <FaCommentDots />
                Buat Komplain
              </div>

              {/* BODY */}
              <div
                style={{
                  padding: "28px",
                }}
              >
                <Label text="Kategori Komplain" />

                <select
                  value={formKomplain.kategori}
                  onChange={(e) =>
                    setFormKomplain({
                      ...formKomplain,
                      kategori: e.target.value,
                    })
                  }
                  style={selectStyle}
                >
                  <option value="">
                    Pilih Kategori
                  </option>

                  <option value="Porsi kurang">
                    Porsi kurang
                  </option>

                  <option value="Makanan dingin">
                    Makanan dingin
                  </option>

                  <option value="Kurir terlambat">
                    Kurir terlambat
                  </option>

                  <option value="Rasa tidak sesuai">
                    Rasa tidak sesuai
                  </option>
                </select>

                <Label text="Deskripsi" />

                <textarea
                  rows={6}
                  placeholder="Jelaskan masalah Anda..."
                  value={formKomplain.deskripsi}
                  onChange={(e) =>
                    setFormKomplain({
                      ...formKomplain,
                      deskripsi: e.target.value,
                    })
                  }
                  style={textareaStyle}
                />

                <button
                  onClick={kirimKomplain}
                  disabled={loading}
                  style={{
                    ...buttonStyle,
                    background:
                      "linear-gradient(90deg,#dc2626,#ef4444)",
                  }}
                >
                  <FaPaperPlane />
                  {loading
                    ? "Mengirim..."
                    : "Kirim Komplain"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
            <style>
        {`
          *{
            margin:0;
            padding:0;
            box-sizing:border-box;
          }

          body{
            background:#071028;
          }

          .hide-scrollbar{
            scrollbar-width:none;
            -ms-overflow-style:none;
          }

          .hide-scrollbar::-webkit-scrollbar{
            display:none;
            width:0;
            height:0;
          }
        `}
      </style>
    </div>
    
  );
}

/* ======================== */

function Label({ text }) {
  return (
    <div
      style={{
        color: "#94a3b8",
        fontSize: "14px",
        marginBottom: "12px",
        marginTop: "22px",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "1px",
      }}
    >
      {text}
    </div>
  );
}

function StarRating({
  value,
  onChange,
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
      }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          onClick={() => onChange(star)}
          style={{
            cursor: "pointer",
            fontSize: "32px",
            color:
              star <= value
                ? "#f59e0b"
                : "rgba(255,255,255,0.2)",
          }}
        >
          {star <= value ? (
            <FaStar />
          ) : (
            <FaRegStar />
          )}
        </div>
      ))}
    </div>
  );
}

/* ======================== */

const selectStyle = {
  width: "100%",
  height: "56px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#0f172a",
  color: "#ffffff",
  padding: "0 18px",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const textareaStyle = {
  width: "100%",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#0f172a",
  color: "#ffffff",
  padding: "18px",
  fontSize: "15px",
  outline: "none",
  resize: "none",
  boxSizing: "border-box",
};

const buttonStyle = {
  marginTop: "28px",
  border: "none",
  height: "54px",
  padding: "0 28px",
  borderRadius: "16px",
  background:
    "linear-gradient(90deg,#2563eb,#3b82f6)",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "700",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "12px",
};