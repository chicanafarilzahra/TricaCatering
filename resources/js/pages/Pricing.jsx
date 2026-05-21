// resources/js/pages/Pricing.jsx

import AdminLayout from "../layouts/AdminLayout";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";

export default function Pricing() {
    return (
        <AdminLayout>
            <PageHeader
                title="Menu Pricing"
                subtitle="Manage and monitor menu pricing information"
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
                                color: "white",
                            }}
                        >
                            Pricing List
                        </h3>

                        <p
                            style={{
                                margin: "6px 0 0",
                                fontSize: "14px",
                                color: "#94a3b8",
                            }}
                        >
                            Current prices for all catering menus and packages.
                        </p>
                    </div>
                </div>

                <Table
                    headers={[
                        "Menu Name",
                        "Category",
                        "Current Price",
                        "Last Updated",
                        "Status",
                    ]}
                >
                    {/* BACKEND DATA */}
                </Table>

                <EmptyState
                    title="No Pricing Data"
                    subtitle="Menu pricing information will appear here"
                />
            </Card>
        </AdminLayout>
    );
}   