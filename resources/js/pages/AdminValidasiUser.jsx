import React, {
    useEffect,
    useState,
} from "react";

import axios from "axios";

export default function AdminValidasiUser() {

    const [users, setUsers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {

            const res =
                await axios.get(
                    "/api/users"
                );

            setUsers(res.data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }
    };

    const approveUser =
        async (id) => {

            try {

                await axios.put(
                    `/api/users/${id}/approve`
                );

                fetchUsers();

            } catch (err) {

                console.log(err);

            }
        };

    const rejectUser =
        async (id) => {

            try {

                await axios.put(
                    `/api/users/${id}/reject`
                );

                fetchUsers();

            } catch (err) {

                console.log(err);

            }
        };

    return (
        <div
            style={{
                padding: "30px",
            }}
        >
            <h1>
                Validasi User
            </h1>

            {loading ? (
                <p>
                    Loading...
                </p>
            ) : (
                <table
                    style={{
                        width: "100%",
                        borderCollapse:
                            "collapse",
                    }}
                >
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map(
                            (user) => (
                                <tr
                                    key={
                                        user.id
                                    }
                                >
                                    <td>
                                        {
                                            user.name
                                        }
                                    </td>

                                    <td>
                                        {
                                            user.email
                                        }
                                    </td>

                                    <td>
                                        {
                                            user.role
                                        }
                                    </td>

                                    <td>
                                        {
                                            user.status
                                        }
                                    </td>

                                    <td>
                                        {user.status ===
                                            "pending" && (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        approveUser(
                                                            user.id
                                                        )
                                                    }
                                                >
                                                    Approve
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        rejectUser(
                                                            user.id
                                                        )
                                                    }
                                                    style={{
                                                        marginLeft:
                                                            "10px",
                                                    }}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}