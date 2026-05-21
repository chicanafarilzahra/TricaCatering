import { useNavigate } from "react-router-dom";

export default function LogoutButton() {

    const navigate = useNavigate();

    function handleLogout() {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        navigate("/login");
    }

    return (
        <button
            onClick={handleLogout}
            style={{
                width: "100%",
                padding: "12px",
                border: "none",
                borderRadius: "10px",
                background: "#ef4444",
                color: "white",
                fontWeight: "700",
                cursor: "pointer",
            }}
        >
            Logout
        </button>
    );
}