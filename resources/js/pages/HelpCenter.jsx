// resources/js/pages/HelpCenter.jsx

import AdminLayout from "../layouts/AdminLayout";

import PageHeader from "../components/PageHeader";

import Card from "../components/Card";

export default function HelpCenter() {
    return (
        <AdminLayout>
            <PageHeader
                title="Help Center"
                subtitle="Documentation and support for TriCa Catering"
            />

            <Card>
                <div
                    style={{
                        display: "flex",
                        flexDirection:
                            "column",
                        gap: "28px",
                    }}
                >
                    {/* Getting Started */}
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
                            Getting Started
                        </h3>

                        <p
                            style={{
                                margin:
                                    "8px 0 0",
                                fontSize:
                                    "14px",
                                lineHeight:
                                    "1.8",
                                color:
                                    "#94a3b8",
                            }}
                        >
                            Learn how to manage menus, orders,
                            stock, couriers, and reports in
                            TriCa Catering.
                        </p>
                    </div>

                    {/* Owner Features */}
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
                            Owner Features
                        </h3>

                        <p
                            style={{
                                margin:
                                    "8px 0 0",
                                fontSize:
                                    "14px",
                                lineHeight:
                                    "1.8",
                                color:
                                    "#94a3b8",
                            }}
                        >
                            Owners can manage branches,
                            employees, finance, KPI,
                            pricing, and business reports.
                        </p>
                    </div>

                    {/* Admin Features */}
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
                            Admin Features
                        </h3>

                        <p
                            style={{
                                margin:
                                    "8px 0 0",
                                fontSize:
                                    "14px",
                                lineHeight:
                                    "1.8",
                                color:
                                    "#94a3b8",
                            }}
                        >
                            Admins can monitor orders,
                            production, stock, deliveries,
                            customers, and operational
                            reports.
                        </p>
                    </div>

                    {/* Support */}
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
                            Support
                        </h3>

                        <p
                            style={{
                                margin:
                                    "8px 0 0",
                                fontSize:
                                    "14px",
                                lineHeight:
                                    "1.8",
                                color:
                                    "#94a3b8",
                            }}
                        >
                            Contact your system administrator
                            if you experience issues accessing
                            the dashboard.
                        </p>
                    </div>
                </div>
            </Card>
        </AdminLayout>
    );
}