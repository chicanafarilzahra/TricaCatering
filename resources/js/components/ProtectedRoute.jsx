import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
    children,
    role,
}) {

    const token =
        localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    // Belum login
    if (!token) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }

    // Cek role
    if (
        role &&
        user?.role !== role
    ) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }

    return children;
}