// resources/js/pages/ApiSettings.jsx

import AdminLayout from "../layouts/AdminLayout";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";

export default function ApiSettings() {
    return (
        <AdminLayout>
            <PageHeader
                title="API Settings"
                subtitle="Manage API keys, integrations, and external services"
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
                            API Configuration
                        </h3>

                        <p
                            style={{
                                margin: "6px 0 0",
                                fontSize: "14px",
                                color: "#94a3b8",
                            }}
                        >
                            Configure third-party integrations,
                            API credentials, and webhook endpoints.
                        </p>
                    </div>
                </div>

                <Table
                    headers={[
                        "Service",
                        "API Key",
                        "Environment",
                        "Last Updated",
                        "Status",
                    ]}
                >
                    {/* BACKEND DATA */}
                </Table>

                <EmptyState
                    title="No API Configuration"
                    subtitle="API settings and integrations will appear here"
                />
            </Card>
        </AdminLayout>
    );
}