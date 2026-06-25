import { useEffect, useState } from "react";
import axios from "axios";
import SidebarSPPG from "../../components/SidebarSPPG";
import {
  Truck,
  Search,
  Plus,
  Package,
  UtensilsCrossed,
  Pencil,
  Trash2,
} from "lucide-react";

export default function DistribusiSPPG() {
  const [distribusi, setDistribusi] = useState([]);
  const [sekolahs, setSekolahs] = useState([]);
  const [menus, setMenus] = useState([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
  sekolah_id: "",
  menu_id: "",
  tanggal: "",
  jam_distribusi: "",
  jumlah_porsi: "",
  status: "Diproses",
});

  useEffect(() => {
    fetchDistribusi();
    fetchSekolah();
    fetchMenu();
  }, []);

  const token = localStorage.getItem("token");
  console.log(token);

const fetchDistribusi = async () => {
  try {
    const res = await axios.get(
      "/sppg/distribusi",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(JSON.stringify(res.data, null, 2));
    console.log("Array?", Array.isArray(res.data));

    setDistribusi(
      Array.isArray(res.data)
        ? res.data
        : []
    );

  } catch (err) {
    console.log(err);
  }
};

const fetchSekolah = async () => {
  try {
    const res = await axios.get(
      "/sppg/sekolah",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(
  "DATA SEKOLAH:",
  JSON.stringify(res.data, null, 2)
);

    setSekolahs(res.data);
  } catch (err) {
    console.log(err);
  }
};

const editData = (item) => {
  const sekolah = sekolahs.find(
    (s) => s.id === item.sekolah_id
  );

  setEditId(item.id);

  setForm({
    sekolah_id: item.sekolah_id,
    menu_id: item.menu_id,
    tanggal: item.tanggal,
    jumlah_porsi:
      sekolah?.jumlah_siswa || item.jumlah_porsi,
    status: item.status,
  });

  setShowModal(true);
};

const hapus = async (id) => {
  if (!confirm("Hapus distribusi ini?")) return;

  try {
    await axios.delete(
      `/api/sppg/distribusi/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchDistribusi();
  } catch (err) {
    console.log(err);
  }
};

const inputStyle = {
  width: "100%",
  height: 48,
  padding: "0 14px",
  borderRadius: 12,
  border: "1px solid #334155",
  background: "#1e293b",
  color: "#fff",
  fontSize: 14,
  boxSizing: "border-box",
};

const labelStyle = {
  color: "#cbd5e1",
  fontSize: 14,
  fontWeight: 500,
  display: "block",
  marginBottom: 8,
  marginTop: 16,
};

const fetchMenu = async () => {
  try {
    const res = await axios.get(
      "/sppg/menus",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMenus(res.data);
  } catch (err) {
    console.log(err);
  }
};

const saveData = async (e) => {
  e.preventDefault();

  try {
    if (editId) {
      await axios.put(
        `/api/sppg/distribusi/${editId}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      await axios.post(
        "/sppg/distribusi",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    fetchDistribusi();
    setShowModal(false);

    setForm({
      sekolah_id: "",
      menu_id: "",
      tanggal: "",
      jumlah_porsi: "",
      status: "Diproses",
    });

    setEditId(null);
  } catch (err) {
    console.log(err);
  }
};

  const filteredDistribusi = distribusi.filter((item) => {
    const sekolah =
      item.sekolah?.nama_sekolah?.toLowerCase() || "";

    const menu =
      item.menu?.nama_menu?.toLowerCase() || "";

    return (
      sekolah.includes(search.toLowerCase()) ||
      menu.includes(search.toLowerCase())
    );
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1120",
      }}
    >
      <SidebarSPPG />

      <div
        style={{
          marginLeft: 290,
          padding: 30,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 15,
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                background:
                  "linear-gradient(135deg,#2563eb,#06b6d4)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
              }}
            >
              <Truck size={30} />
            </div>

            <div>
              <h2
                style={{
                  color: "#fff",
                  margin: 0,
                }}
              >
                Distribusi MBG
              </h2>

              <div
                style={{
                  color: "#94a3b8",
                  marginTop: 5,
                }}
              >
                Kelola distribusi makanan ke sekolah
              </div>
            </div>
          </div>
        </div>

        {/* CARD */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 20,
            marginBottom: 25,
          }}
        >
          <div
            style={{
              background: "#111827",
              padding: 25,
              borderRadius: 20,
            }}
          >
            <Truck color="#3b82f6" size={34} />

            <div
              style={{
                color: "#94a3b8",
                marginTop: 12,
              }}
            >
              Total Distribusi
            </div>

            <h2
              style={{
                color: "#fff",
                margin: 0,
                marginTop: 8,
              }}
            >
              {distribusi.length}
            </h2>
          </div>

          <div
            style={{
              background: "#111827",
              padding: 25,
              borderRadius: 20,
            }}
          >
            <Package color="#22c55e" size={34} />

            <div
              style={{
                color: "#94a3b8",
                marginTop: 12,
              }}
            >
              Total Porsi
            </div>

            <h2
              style={{
                color: "#fff",
                margin: 0,
                marginTop: 8,
              }}
            >
              {distribusi.reduce(
                (a, b) =>
                  a + Number(b.jumlah_porsi || 0),
                0
              )}
            </h2>
          </div>

          <div
            style={{
              background: "#111827",
              padding: 25,
              borderRadius: 20,
            }}
          >
            <UtensilsCrossed
              color="#f59e0b"
              size={34}
            />

            <div
              style={{
                color: "#94a3b8",
                marginTop: 12,
              }}
            >
              Distribusi Selesai
            </div>

            <h2
              style={{
                color: "#fff",
                margin: 0,
                marginTop: 8,
              }}
            >
              {
                distribusi.filter(
                  (x) => x.status === "Selesai"
                ).length
              }
            </h2>
          </div>
        </div>

        {/* SEARCH & BUTTON */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              background: "#111827",
              width: 350,
              borderRadius: 15,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Search
              color="#94a3b8"
              size={18}
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Cari distribusi..."
              style={{
                background: "transparent",
                border: 0,
                outline: "none",
                color: "#fff",
                marginLeft: 10,
                width: "100%",
              }}
            />
          </div>

          <button
            onClick={() => {
              setEditId(null);

              setForm({
                sekolah_id: "",
                menu_id: "",
                tanggal: "",
                jumlah_porsi: "",
                status: "Diproses",
              });

              setShowModal(true);
            }}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              background: "#2563eb",
              color: "#fff",
              border: 0,
              borderRadius: 14,
              padding: "12px 20px",
              cursor: "pointer",
            }}
          >
            <Plus size={18} />

            Tambah Distribusi
          </button>
        </div>
                {/* TABLE */}

        <div
          style={{
            background: "#111827",
            borderRadius: 24,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "22px 28px",
              background: "#0f172a",
            }}
          >
            <div>
              <div
                style={{
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                Data Distribusi
              </div>

              <div
                style={{
                  color: "#94a3b8",
                  fontSize: 13,
                  marginTop: 4,
                }}
              >
                Daftar distribusi makanan MBG
              </div>
            </div>

            <div
              style={{
                background: "#2563eb22",
                color: "#60a5fa",
                padding: "8px 14px",
                borderRadius: 20,
                fontWeight: 600,
              }}
            >
              {filteredDistribusi.length} Data
            </div>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              color: "#fff",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#172033",
                  color: "#94a3b8",
                }}
              >
                <th style={{ padding: 18 }}>No</th>
                <th style={{ padding: 18 }}>Sekolah</th>
                <th style={{ padding: 18 }}>Menu</th>
                <th style={{ padding: 18 }}>Tanggal</th>
                <th style={{ padding: 18 }}>Porsi</th>
                <th style={{ padding: 18 }}>Status</th>
                <th style={{ padding: 18 }}>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredDistribusi.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      padding: 30,
                      textAlign: "center",
                      color: "#94a3b8",
                    }}
                  >
                    Data tidak ditemukan
                  </td>
                </tr>
              ) : (
                filteredDistribusi.map((item, index) => (
                  <tr
                    key={item.id}
                    style={{
                      borderTop:
                        "1px solid rgba(255,255,255,.05)",
                    }}
                  >
                    <td
                      style={{
                        padding: 18,
                        textAlign: "center",
                      }}
                    >
                      {index + 1}
                    </td>

                    <td style={{ padding: 18 }}>
                      {item.sekolah?.nama_sekolah}
                    </td>

                    <td style={{ padding: 18 }}>
                      {item.menu?.nama_menu}
                    </td>

                    <td style={{ padding: 18 }}>
                      {item.tanggal}
                    </td>

                    <td
                      style={{
                        padding: 18,
                        textAlign: "center",
                      }}
                    >
                      {item.jumlah_porsi}
                    </td>

                    <td
                      style={{
                        padding: 18,
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          background:
                            item.status === "Selesai"
                              ? "#22c55e22"
                              : item.status === "Dikirim"
                              ? "#3b82f622"
                              : "#f59e0b22",

                          color:
                            item.status === "Selesai"
                              ? "#4ade80"
                              : item.status === "Dikirim"
                              ? "#60a5fa"
                              : "#fbbf24",

                          padding: "7px 15px",
                          borderRadius: 30,
                        }}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: 18,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 10,
                        }}
                      >
                        <button
                          onClick={() => editData(item)}
                          style={{
                            width: 40,
                            height: 40,
                            border: 0,
                            borderRadius: 10,
                            background: "#2563eb22",
                            color: "#3b82f6",
                            cursor: "pointer",
                          }}
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => hapus(item.id)}
                          style={{
                            width: 40,
                            height: 40,
                            border: 0,
                            borderRadius: 10,
                            background: "#ef444422",
                            color: "#ef4444",
                            cursor: "pointer",
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
                {showModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.65)",
              backdropFilter: "blur(6px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
            }}
          >
            <form
              onSubmit={saveData}
              style={{
                width: 600,
                background: "#0f172a",
                borderRadius: 24,
                padding: 32,
                border: "1px solid rgba(255,255,255,.08)",
              }}
            >
              <h2
                style={{
                  color: "#fff",
                  marginTop: 0,
                  marginBottom: 20,
                }}
              >
                {editId
                  ? "Edit Distribusi"
                  : "Tambah Distribusi"}
              </h2>

              <label
                style={{
                  display: "block",
                  color: "#cbd5e1",
                  marginBottom: 8,
                  marginTop: 16,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Sekolah
              </label>

              <select
                value={form.sekolah_id}
                onChange={(e) => {
                const sekolah = sekolahs.find(
                  (s) => s.id == e.target.value
                );

                setForm({
                  ...form,
                  sekolah_id: e.target.value,
                  jumlah_porsi:
                    sekolah?.jumlah_siswa || 0,
                });
              }}
                style={inputStyle}
              >
                <option value="">
                  Pilih Sekolah
                </option>

                {sekolahs.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.nama_sekolah}
                  </option>
                ))}
              </select>

              <label
                style={{
                  display: "block",
                  color: "#cbd5e1",
                  marginBottom: 8,
                  marginTop: 16,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Menu
              </label>

              <select
                value={form.menu_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    menu_id: e.target.value,
                  })
                }
                style={inputStyle}
              >
                <option value="">
                  Pilih Menu
                </option>

                {menus.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.nama_menu}
                  </option>
                ))}
              </select>

             <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 20,
    marginTop: 16,
  }}
>
  <div>
    <label
      style={{
        display: "block",
        color: "#cbd5e1",
        marginBottom: 8,
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      Tanggal Distribusi
    </label>

    <input
      type="date"
      value={form.tanggal}
      onChange={(e) =>
        setForm({
          ...form,
          tanggal: e.target.value,
        })
      }
      style={inputStyle}
    />
  </div>

  <div>
  <label
  style={{
    display: "block",
    color: "#cbd5e1",
    marginBottom: 8,
    fontSize: 14,
    fontWeight: 500,
  }}
>
  Jam Distribusi
</label>

<select
  value={form.jam_distribusi}
  onChange={(e) =>
    setForm({
      ...form,
      jam_distribusi: e.target.value,
    })
  }
  style={inputStyle}
>
  <option value="">Pilih Jam</option>

  {Array.from({ length: 24 * 12 }, (_, i) => {
    const hour = String(Math.floor(i / 12)).padStart(2, "0");
    const minute = String((i % 12) * 5).padStart(2, "0");

    return (
      <option
        key={`${hour}:${minute}`}
        value={`${hour}:${minute}`}
      >
        {hour}:{minute}
      </option>
    );
  })}
</select>
</div>

  <div>
  <label
    style={{
      display: "block",
      color: "#cbd5e1",
      marginBottom: 8,
      fontSize: 14,
      fontWeight: 500,
    }}
  >
    Jumlah Porsi
  </label>

  <input
    type="number"
    value={form.jumlah_porsi}
    readOnly
    style={inputStyle}
  />
</div>
</div>

              <label
                style={{
                  display: "block",
                  color: "#cbd5e1",
                  marginBottom: 8,
                  marginTop: 16,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Status
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value,
                  })
                }
                style={inputStyle}
              >
                <option value="Diproses">
                  Diproses
                </option>

                <option value="Disiapkan">
                  Disiapkan
                </option>

                <option value="Dikirim">
                  Dikirim
                </option>

                <option value="Selesai">
                  Selesai
                </option>
              </select>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 12,
                  marginTop: 30,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditId(null);
                  }}
                  style={{
                    minWidth: 100,
                    height: 48,
                    border: "none",
                    borderRadius: 12,
                    background: "#334155",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  style={{
                    minWidth: 140,
                    height: 48,
                    border: "none",
                    borderRadius: 12,
                    background:
                      "linear-gradient(135deg,#2563eb,#06b6d4)",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "0.2s",
                    boxShadow:
                      "0 4px 14px rgba(37,99,235,.35)",
                  }}
                >
                  {editId
                    ? "Update Data"
                    : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}