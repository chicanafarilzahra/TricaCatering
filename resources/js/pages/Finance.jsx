// resources/js/pages/Finance.jsx

import AdminLayout from "../layouts/AdminLayout";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";

export default function Finance() {
    return (
        <AdminLayout>
            <PageHeader
                title="Finance"
                subtitle="Monitor income, expenses, and overall financial performance"
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
                            Financial Overview
                        </h3>

                        <p
                            style={{
                                margin: "6px 0 0",
                                fontSize: "14px",
                                color: "#94a3b8",
                            }}
                        >
                            Track revenue, expenses, profit,
                            and payment activity.
                        </p>
                    </div>
                </div>

                <Table
                    headers={[
                        "Date",
                        "Description",
                        "Income",
                        "Expense",
                        "Balance",
                    ]}
                >
                    {/* BACKEND DATA */}
                </Table>

                <EmptyState
                    title="No Financial Data"
                    subtitle="Financial transactions will appear here"
                />
            </Card>
        </AdminLayout>
    );
}