// resources/js/pages/Employees.jsx

import AdminLayout from "../layouts/AdminLayout";

import PageHeader from "../components/PageHeader";

import Card from "../components/Card";

import Table from "../components/Table";

import EmptyState from "../components/EmptyState";

export default function Employees() {
    return (
        <AdminLayout>
            <PageHeader
                title="Employees"
                subtitle="Manage and monitor employee data"
            />

            <Card>
                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "center",
                        marginBottom:
                            "24px",
                    }}
                >
                    <div>
                        <h3
                            style={{
                                margin: 0,
                                fontSize:
                                    "20px",
                                fontWeight:
                                    "700",
                                color:
                                    "white",
                            }}
                        >
                            Employee List
                        </h3>

                        <p
                            style={{
                                margin:
                                    "6px 0 0",
                                fontSize:
                                    "14px",
                                color:
                                    "#94a3b8",
                            }}
                        >
                            Registered employees in TriCa Catering
                        </p>
                    </div>
                </div>

                <Table
                    headers={[
                        "Employee Name",
                        "Position",
                        "Branch",
                        "Phone",
                        "Status",
                    ]}
                >
                    {/* BACKEND DATA */}
                </Table>

                <EmptyState
                    title="No Employee Data"
                    subtitle="Employee information will appear here"
                />
            </Card>
        </AdminLayout>
    );
}