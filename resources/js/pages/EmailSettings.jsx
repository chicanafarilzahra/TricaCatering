// resources/js/pages/EmailSettings.jsx

import AdminLayout from "../layouts/AdminLayout";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";

export default function EmailSettings() {
    return (
        <AdminLayout>
            <PageHeader
                title="Email Settings"
                subtitle="Configure SMTP server and email notifications"
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
                            SMTP Configuration
                        </h3>

                        <p
                            style={{
                                margin: "6px 0 0",
                                fontSize: "14px",
                                color: "#94a3b8",
                            }}
                        >
                            Manage outgoing email server settings,
                            notification templates, and delivery status.
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
                    title="No Email Configuration"
                    subtitle="SMTP and email settings will appear here"
                />
            </Card>
        </AdminLayout>
    );
}