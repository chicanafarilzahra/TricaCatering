// resources/js/pages/Branches.jsx

import AdminLayout from "../layouts/AdminLayout";

import PageHeader from "../components/PageHeader";

import Card from "../components/Card";

import Table from "../components/Table";

import EmptyState from "../components/EmptyState";

export default function Branches() {
    return (
        <AdminLayout>
            <PageHeader
                title="Branches"
                subtitle="Manage and monitor catering branch offices"
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
                            Branch List
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
                            Registered catering branches
                        </p>
                    </div>
                </div>

                <Table
                    headers={[
                        "Branch Name",
                        "City",
                        "Phone",
                        "Manager",
                        "Status",
                    ]}
                >
                    {/* BACKEND DATA */}
                </Table>

                <EmptyState
                    title="No Branch Data"
                    subtitle="Branch information will appear here"
                />
            </Card>
        </AdminLayout>
    );
}