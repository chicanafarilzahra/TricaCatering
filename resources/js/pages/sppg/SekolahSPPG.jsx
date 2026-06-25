import {
    MapContainer,
    TileLayer,
    Marker,
    useMap
} from "react-leaflet";


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

import { useEffect, useState } from "react";
import axios from "axios";
import SidebarSPPG from "../../components/SidebarSPPG";
import {
School2,
Building2,
Users,
Plus,
Search,
Pencil,
Trash2,
MapPin
} from "lucide-react";

function ChangeMapView({ center }) {

    const map = useMap();

    useEffect(() => {
        map.setView(center, 16);
    }, [center]);

    return null;
}

export default function SekolahSPPG() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [sekolahs, setSekolahs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [activeEdit, setActiveEdit] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [search, setSearch] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [searchLocation, setSearchLocation] =
    useState("");

    const [latitude, setLatitude] =
            useState("");

    const [longitude, setLongitude] =
            useState("");

    const [position, setPosition] =
            useState([-7.6498, 112.6878]);


const [form, setForm] = useState({
    nama_sekolah: "",
    jenjang: "",
    alamat: "",
    jumlah_siswa: "",
});

useEffect(() => {
    fetchData();
}, []);
    const fetchData = async () => {
    try {
        console.log("fetchData jalan");

        const token = localStorage.getItem("token");
        console.log("token:", token);

        const res = await axios.get(
            "/sppg/sekolah",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("HASIL API:", res);
        console.log("DATA:", res.data);

        setSekolahs(res.data);

    } catch (e) {
        console.log("ERROR:", e);
    }
};

const searchMapLocation = async () => {

    if (!searchLocation) return;

    try {

        const res = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
        params:{
    q:`${searchLocation}, Indonesia`,
    format:"json",
    limit:5
        }
            }
        );

        if(res.data.length){

            const lat =
                Number(res.data[0].lat);

            const lng =
                Number(res.data[0].lon);

            setPosition([lat,lng]);

            setLatitude(
                lat.toFixed(8)
            );

            setLongitude(
                lng.toFixed(8)
            );

        }

    } catch(err){

        console.log(err);

    }
};

const saveData = async (e) => {
    e.preventDefault();

    if (
    !form.nama_sekolah ||
    !form.jenjang ||
    !form.alamat ||
    !form.jumlah_siswa
) {
    alert("Semua field wajib diisi");
    return;
}

    const token = localStorage.getItem("token");

    console.log("DATA KIRIM:", form);

    try {
        const payload = {
            nama_sekolah: form.nama_sekolah,
            jenjang: form.jenjang,
            alamat: form.alamat,
            jumlah_siswa: Number(form.jumlah_siswa),
            latitude: latitude,
            longitude: longitude,
};
        if (editId) {
            await axios.put(
                `/api/sppg/sekolah/${editId}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } else {
            await axios.post(
                "/sppg/sekolah",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        }

        await fetchData();

        setShowModal(false);
        setEditId(null);

        setForm({
            nama_sekolah: "",
            jenjang: "",
            alamat: "",
            jumlah_siswa: "",
        });

    } catch (err) {
        console.log("ERROR:", err.response?.data || err.message);

        alert(err.response?.data?.message || "Gagal simpan data");
    }
};

  const editData = (item) => {
    setEditId(item.id);

    setForm({
    nama_sekolah: item.nama_sekolah || "",
    jenjang: item.jenjang || "",
    alamat: item.alamat || "",
    jumlah_siswa: item.jumlah_siswa || "",
});

setLatitude(item.latitude || "");
setLongitude(item.longitude || "");

if(item.latitude && item.longitude){
    setPosition([
        Number(item.latitude),
        Number(item.longitude)
    ]);
}

    setShowModal(true);
};

    const hapus = async (id) => {
    if (!window.confirm("Yakin ingin menghapus?")) return;

    try {
        const token = localStorage.getItem("token");

        await axios.delete(
            `/api/sppg/sekolah/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        alert("Data berhasil dihapus");
        fetchData();
    } catch (err) {
        console.log(err);
        alert("Gagal menghapus");
    }
};

const confirmDelete = async () => {
    console.log("DELETE ID:", deleteId);

    try {
        const token = localStorage.getItem("token");

        const res = await axios.delete(
            `/api/sppg/sekolah/${deleteId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("BERHASIL", res.data);

        setShowDeleteModal(false);
        setDeleteId(null);

        fetchData();

    } catch (err) {
        console.log("ERROR:", err);
        console.log("RESPONSE:", err.response);
    }
};

const filteredSekolah = sekolahs.filter(
    (item) =>
        item.nama_sekolah
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
        item.alamat
            ?.toLowerCase()
            .includes(search.toLowerCase())
);

    const inputStyle = {
        width: "100%",
        padding: "14px 16px",
        marginTop: 8,
        marginBottom: 18,
        background: "#1f2937",
        border: "1px solid #374151",
        borderRadius: 12,
        color: "#fff",
        fontSize: 14,
        outline: "none",
        boxSizing: "border-box",
    };

    return (
        <div
            style={{
                background: "#0b1120",
                minHeight: "100vh",
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
                        marginBottom: 30,
                    }}
                >
                    <div
    style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
    }}
>
    <div
        style={{
            width: 55,
            height: 55,
            borderRadius: 16,
            background:
                "linear-gradient(135deg,#2563eb,#06b6d4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            boxShadow:
                "0 8px 20px rgba(37,99,235,.35)",
        }}
    >
        <School2 size={28} />
    </div>

    <div>
        <div
            style={{
                color: "#fff",
                fontSize: 30,
                fontWeight: 700,
                lineHeight: 1,
            }}
        >
            Sekolah Binaan
        </div>

        <div
            style={{
                color: "#94a3b8",
                fontSize: 14,
                marginTop: 6,
            }}
        >
            Kelola data sekolah penerima program MBG
        </div>
    </div>
</div>

                </div>

        
                <div
style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:20,
marginBottom:30
}}
>

<div
style={{
background:"#111827",
padding:25,
borderRadius:18
}}
>

<Building2
size={35}
color="#3b82f6"
/>

<div
style={{
marginTop:15,
color:"#94a3b8"
}}
>
Total Sekolah
</div>

<div
style={{
fontSize:30,
fontWeight:700,
color:"white"
}}
>
{sekolahs.length}
</div>

</div>

<div
style={{
background:"#111827",
padding:25,
borderRadius:18
}}
>

<Users
size={35}
color="#22c55e"
/>

<div
style={{
marginTop:15,
color:"#94a3b8"
}}
>
Total Siswa
</div>

<div
style={{
fontSize:30,
fontWeight:700,
color:"white"
}}
>
{
sekolahs.reduce(
(a,b)=>a+Number(b.jumlah_siswa),
0
)
}
</div>

</div>

<div
style={{
background:"#111827",
padding:25,
borderRadius:18
}}
>

<MapPin
size={35}
color="#f59e0b"
/>

<div
style={{
marginTop:15,
color:"#94a3b8"
}}
>
Lokasi Terdaftar
</div>

<div
style={{
fontSize:30,
fontWeight:700,
color:"white"
}}
>
{sekolahs.length}
</div>

</div>

</div>

<div
style={{
display:"flex",
justifyContent:"space-between",
marginBottom:25
}}
>

<div
    style={{
        display: "flex",
        alignItems: "center",
        background: "#111827",
        padding: "12px 18px",
        borderRadius: 15,
        width: 350,
    }}
>
    <Search
        size={18}
        color="#94a3b8"
    />

    <input
        value={search}
        onChange={(e) =>
            setSearch(e.target.value)
        }
        placeholder="Cari sekolah..."
        style={{
            background: "transparent",
            border: 0,
            outline: "none",
            marginLeft: 10,
            color: "white",
            width: "100%",
        }}
    />
</div>

<button
onClick={()=>{

setEditId(null);

setLatitude("");
setLongitude("");

setPosition([
    -7.6498,
    112.6878
]);

setForm({
    nama_sekolah:"",
    jenjang:"",
    alamat:"",
    jumlah_siswa:"",
});

setShowModal(true);

}}
style={{
display:"flex",
alignItems:"center",
gap:8,
background:"#2563eb",
border:0,
padding:"13px 20px",
borderRadius:14,
color:"white",
fontWeight:600,
cursor:"pointer"
}}
>

<Plus size={18}/>

Tambah Sekolah

</button>

</div>
               <div
    style={{
        background: "#111827",
        borderRadius: 24,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,.08)",
        boxShadow: "0 15px 40px rgba(0,0,0,.35)",
    }}
>
    {/* Header */}
    <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "22px 28px",
            borderBottom: "1px solid rgba(255,255,255,.06)",
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
                Data Sekolah
            </div>

            <div
                style={{
                    color: "#94a3b8",
                    fontSize: 13,
                    marginTop: 4,
                }}
            >
                Daftar sekolah penerima program MBG
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
            {filteredSekolah.length} Sekolah
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
                    fontSize: 14,
                }}
            >
                <th style={{ padding: 18 }}>No</th>
                <th style={{ padding: 18, textAlign: "left" }}>
                    Sekolah
                </th>
                <th style={{ padding: 18, textAlign: "left" }}>
                    Alamat
                </th>
                <th style={{ padding: 18 }}>
                    Jumlah Siswa
                </th>
                <th style={{ padding: 18 }}>
                    Aksi
                </th>
            </tr>
        </thead>

        <tbody>

            {filteredSekolah.length === 0 ? (
        <tr>
            <td
                colSpan="5"
                style={{
                    textAlign: "center",
                    padding: 30,
                    color: "#94a3b8",
                }}
            >
                Data sekolah tidak ditemukan
            </td>
        </tr>
    ) : 
        filteredSekolah.map((item, index) => (
            <tr
                key={item.id}
                style={{
                    borderTop:
                        "1px solid rgba(255,255,255,.05)",
                    transition: ".3s",
                }}
            >
                    <td
                        style={{
                            padding: 20,
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                width: 38,
                                height: 38,
                                borderRadius: "50%",
                                background: "#2563eb22",
                                color: "#60a5fa",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "auto",
                                fontWeight: 700,
                            }}
                        >
                            {index + 1}
                        </div>
                    </td>

                    <td style={{ padding: 20 }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                            }}
                        >
                            <div
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 14,
                                    background:
                                        "linear-gradient(135deg,#2563eb,#06b6d4)",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "#fff",
                                }}
                            >
                                <School2 size={22} />
                            </div>

                            <div>
                                <div
                                    style={{
                                        fontWeight: 700,
                                        fontSize: 15,
                                    }}
                                >
                                    {item.nama_sekolah}
                                </div>

                                <div
                                    style={{
                                        color: "#64748b",
                                        fontSize: 13,
                                        marginTop: 4,
                                    }}
                                >
                                    ID : {item.id}
                                </div>
                            </div>
                        </div>
                    </td>

                    <td
                        style={{
                            padding: 20,
                            color: "#cbd5e1",
                            maxWidth: 350,
                        }}
                    >
                        {item.alamat}
                    </td>

                    <td
                        style={{
                            textAlign: "center",
                            padding: 20,
                        }}
                    >
                        <span
                            style={{
                                background: "#22c55e22",
                                color: "#4ade80",
                                padding: "8px 16px",
                                borderRadius: 30,
                                fontWeight: 600,
                                fontSize: 13,
                            }}
                        >
                            {item.jumlah_siswa} Siswa
                        </span>
                    </td>

                    <td
                        style={{
                            padding: 20,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 12,
                            }}
                        >
                            <button
                                onClick={() => editData(item)}
                                style={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: 12,
                                    border: 0,
                                    background: "#2563eb22",
                                    color: "#3b82f6",
                                    cursor: "pointer",
                                    transition: "0.25s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "#22c55e22";
                                    e.currentTarget.style.color = "#22c55e";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "#2563eb22";
                                    e.currentTarget.style.color = "#3b82f6";
                                }}
                            >
                                <Pencil size={18} />
                            </button>

                            <button
    onClick={() => hapus(item.id)}
    style={{
        width: 42,
        height: 42,
        borderRadius: 12,
        border: 0,
        background: "#2563eb22",
        color: "#3b82f6",
        cursor: "pointer",
        transition: "0.3s",
    }}
    onMouseEnter={(e) => {
        e.currentTarget.style.background = "#ef444422";
        e.currentTarget.style.color = "#ef4444";
    }}
    onMouseLeave={(e) => {
        e.currentTarget.style.background = "#2563eb22";
        e.currentTarget.style.color = "#3b82f6";
    }}
>
    <Trash2 size={18} />
</button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>

                {showModal && (
    <div
style={{
    position:"fixed",
    inset:0,
    background:"rgba(0,0,0,.65)",
    backdropFilter:"blur(6px)",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    padding:20,
    zIndex:999,
}}
>
<form
    onSubmit={saveData}
    style={{
        width: "90%",
        maxWidth: 700,
        maxHeight: "90vh",
        overflowY: "auto",
        background: "#111827",
        borderRadius: 22,
        padding: 25,
        border: "1px solid rgba(255,255,255,.08)",
        boxShadow: "0 20px 50px rgba(0,0,0,.4)",

        scrollbarWidth:"thin",
    }}
>
            {/* Header */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 25,
                }}
            >
                <div>
                    <div
                        style={{
                            color: "#fff",
                            fontSize: 24,
                            fontWeight: 700,
                        }}
                    >
                        {editId
                            ? "Edit Sekolah"
                            : "Tambah Sekolah"}
                    </div>

                    <div
                        style={{
                            color: "#94a3b8",
                            fontSize: 13,
                            marginTop: 5,
                        }}
                    >
                        Lengkapi informasi sekolah binaan
                    </div>
                </div>
            </div>

            {/* Nama */}

            <label
                style={{
                    color: "#cbd5e1",
                    fontSize: 14,
                }}
            >
                Nama Sekolah
            </label>

            <input
                value={form.nama_sekolah}
                onChange={(e) =>
                    setForm({
                        ...form,
                        nama_sekolah: e.target.value,
                    })
                }
                placeholder="Masukkan nama sekolah"
                style={inputStyle}
            />

            <label
    style={{
        color:"#cbd5e1",
        fontSize:14
    }}
>
    Jenjang Sekolah
</label>

<select
    value={form.jenjang}
    onChange={(e)=>
        setForm({
            ...form,
            jenjang:e.target.value
        })
    }
    style={inputStyle}
>
    <option value="">
        Pilih Jenjang
    </option>

    <option value="TK">TK</option>
    <option value="SD">SD</option>
    <option value="SMP">SMP</option>
    <option value="SMA">SMA</option>
    <option value="SMK">SMK</option>
</select>

            {/* ALAMAT */}
<label
    style={{
        color: "#cbd5e1",
        fontSize: 14,
    }}
>
    Alamat
</label>

<textarea
    rows={4}
    value={form.alamat}
    onChange={(e) =>
        setForm({
            ...form,
            alamat: e.target.value,
        })
    }
    placeholder="Masukkan alamat sekolah"
    style={{
        ...inputStyle,
        resize: "none",
    }}
/>
<label
    style={{
        color:"#cbd5e1",
        fontSize:14,
    }}
>
    Cari Lokasi Sekolah
</label>

<div
    style={{
        display:"flex",
        gap:10,
        marginTop:8,
        marginBottom:15,
    }}
>
    <input
        value={searchLocation}
        onChange={(e)=>
            setSearchLocation(e.target.value)
        }
        placeholder="Cari lokasi pada peta..."
        style={{
            ...inputStyle,
            marginBottom:0,
        }}
    />

    <button
        type="button"
        onClick={searchMapLocation}
        style={{
            border:0,
            borderRadius:12,
            padding:"0 20px",
            background:"#2563eb",
            color:"#fff",
            cursor:"pointer",
            fontWeight:600,
        }}
    >
        Cari
    </button>
</div>

<div
    style={{
        height:250,
        overflow:"hidden",
        borderRadius:16,
        border:"1px solid #374151",
        marginBottom:20,
    }}
>
    <MapContainer
        center={position}
        zoom={15}
        style={{
            height:"100%",
            width:"100%",
        }}
    >

        <ChangeMapView center={position} />
        <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
            draggable
            position={position}
            eventHandlers={{
                dragend:(e)=>{

                    const latlng =
                        e.target.getLatLng();

                    setPosition([
                        latlng.lat,
                        latlng.lng
                    ]);

                    setLatitude(
                        latlng.lat.toFixed(8)
                    );

                    setLongitude(
                        latlng.lng.toFixed(8)
                    );

                }
            }}
        />
    </MapContainer>
</div>
<div
    style={{
        display:"grid",
        gridTemplateColumns:"1fr 1fr",
        gap:15,
        marginBottom:20,
    }}
>

    <div
        style={{
            background:"#0f172a",
            padding:15,
            borderRadius:12,
        }}
    >
        <div
            style={{
                color:"#94a3b8",
                fontSize:12,
            }}
        >
            Latitude
        </div>

        <div
            style={{
                color:"#fff",
                marginTop:5,
                fontWeight:600,
            }}
        >
            {latitude || "-"}
        </div>
    </div>

    <div
        style={{
            background:"#0f172a",
            padding:15,
            borderRadius:12,
        }}
    >
        <div
            style={{
                color:"#94a3b8",
                fontSize:12,
            }}
        >
            Longitude
        </div>

        <div
            style={{
                color:"#fff",
                marginTop:5,
                fontWeight:600,
            }}
        >
            {longitude || "-"}
        </div>
    </div>

</div>


{/* Jumlah Siswa */}

<div>
    <label
        style={{
            color: "#cbd5e1",
            fontSize: 14,
        }}
    >
        Jumlah Siswa
    </label>

    <input
        type="number"
        value={form.jumlah_siswa}
        onChange={(e) =>
            setForm({
                ...form,
                jumlah_siswa: Number(e.target.value),
            })
        }
        placeholder="Masukkan jumlah siswa"
        style={inputStyle}
    />
</div>

            {/* Button */}

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

    setForm({
        nama_sekolah: "",
        jenjang: "",
        alamat: "",
        jumlah_siswa: "",
    });
}}
    style={{
        padding: "12px 22px",
        borderRadius: 12,
        border: 0,
        background: "#374151",
        color: "#fff",
        cursor: "pointer",
        fontWeight: 600,
    }}
>
    Batal
</button>

                <button
    type="submit"
    style={{
        padding: "12px 22px",
        borderRadius: 12,
        border: 0,
        background:
            "linear-gradient(135deg,#2563eb,#06b6d4)",
        color: "#fff",
        cursor: "pointer",
        fontWeight: 600,
    }}
>
    {editId ? "Update Data" : "Simpan Data"}
</button>
            </div>
        </form>
    </div>
)}
            </div>
        </div>
    );
} 