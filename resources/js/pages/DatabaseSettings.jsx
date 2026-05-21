// resources/js/pages/DatabaseSettings.jsx

import AdminLayout from "../layouts/AdminLayout";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";

export default function DatabaseSettings() {
    return (
        <AdminLayout>
            <PageHeader
                title="Database Settings"
                subtitle="Manage database connections and configuration"
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
                            Database Configuration
                        </h3>

                        <p
                            style={{
                                margin: "6px 0 0",
                                fontSize: "14px",
                                color: "#94a3b8",
                            }}
                        >
                            Monitor connection settings,
                            environment configuration,
                            and database status.
                        </p>
                    </div>
                </div>

                <Table
                    headers={[
                        "Setting",
                        "Value",
                        "Environment",
                        "Last Updated",
                        "Status",
                    ]}
                >
                    {/* BACKEND DATA */}
                </Table>

                <EmptyState
                    title="No Database Configuration"
                    subtitle="Database settings will appear here"
                />
            </Card>
        </AdminLayout>
    );
}