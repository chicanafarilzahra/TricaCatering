// resources/js/pages/Notifications.jsx

import AdminLayout from "../layouts/AdminLayout";

import PageHeader from "../components/PageHeader";

import Card from "../components/Card";

import EmptyState from "../components/EmptyState";

export default function Notifications() {
    return (
        <AdminLayout>
            <PageHeader
                title="Notifications"
                subtitle="View system alerts and important updates"
            />

            <Card>
                <div
                    style={{
                        marginBottom:
                            "24px",
                    }}
                >
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
                        Recent Notifications
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
                        Order updates, stock alerts, and system messages
                    </p>
                </div>

                {/* BACKEND DATA */}

                <EmptyState
                    title="No Notifications"
                    subtitle="System notifications will appear here"
                />
            </Card>
        </AdminLayout>
    );
}