// resources/js/pages/SPPG.jsx

import AdminLayout from "../layouts/AdminLayout";

import PageHeader from "../components/PageHeader";

import Card from "../components/Card";

import Table from "../components/Table";

import EmptyState from "../components/EmptyState";

export default function SPPG() {

    return (

        <AdminLayout>

            <PageHeader
                title="SPPG"
                subtitle="Monitor school food service operations"
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
                            SPPG Activity
                        </h3>

                        <p
                            style={{
                                margin: "6px 0 0",
                                fontSize: "14px",
                                color: "#94a3b8",
                            }}
                        >
                            School meal production and distribution
                        </p>

                    </div>

                </div>

                <Table
                    headers={[
                        "School",
                        "Package",
                        "Total Meals",
                        "Delivery Date",
                        "Status",
                    ]}
                >

                    {/* DATA BACKEND */}

                </Table>

                <EmptyState
                    title="No SPPG Data"
                    subtitle="SPPG operational data will appear here"
                />

            </Card>

        </AdminLayout>

    );

}