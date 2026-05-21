// resources/js/pages/Packages.jsx

import AdminLayout from "../layouts/AdminLayout";

import PageHeader from "../components/PageHeader";

import Card from "../components/Card";

import Table from "../components/Table";

import EmptyState from "../components/EmptyState";

export default function Packages() {

    return (

        <AdminLayout>

            <PageHeader
                title="Packages"
                subtitle="Manage catering package offerings"
            />

            <Card>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "24px",
                    }}
                >

                    <div>

                        <h3
                            style={{
                                margin: 0,
                                fontSize: "20px",
                                fontWeight: "700",
                                color: "#ffffff",
                            }}
                        >
                            Package List
                        </h3>

                        <p
                            style={{
                                margin: "6px 0 0",
                                fontSize: "14px",
                                color: "#94a3b8",
                            }}
                        >
                            Catering package information
                        </p>

                    </div>

                </div>

                <Table
                    headers={[
                        "Package Name",
                        "Menus",
                        "Price",
                        "Category",
                        "Status",
                    ]}
                >

                    {/* DATA BACKEND */}

                </Table>

                <EmptyState
                    title="No Packages Found"
                    subtitle="Package data will appear here"
                />

            </Card>

        </AdminLayout>

    );

}