import { FaBell } from "react-icons/fa";

export default function NavbarKurir({ title }) {
  return (
    <div
      style={{
        width: "100%",        // sesuaikan parent
        height: "78px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(90deg,#17306a 0%,#1f3f8b 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "0 4px 18px rgba(0,0,0,0.25)",
        padding: "0 24px",
        boxSizing: "border-box"
      }}
    >
      <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 700, margin: 0 }}>
        {title}
      </h1>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: "rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer"
        }}
      >
        <FaBell style={{ color: "#fff", fontSize: 18 }} />
      </div>
    </div>
  );
}