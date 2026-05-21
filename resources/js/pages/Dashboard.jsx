import {
    ShoppingCart,
    Users,
    Truck,
    Package,
    TrendingUp,
    Clock3,
} from "lucide-react";

import AdminLayout from "../layouts/AdminLayout";

import Grid from "../components/Grid";

import StatCard from "../components/StatCard";

import Card from "../components/Card";

import PageHeader from "../components/PageHeader";

import Table from "../components/Table";

import EmptyState from "../components/EmptyState";

export default function Dashboard() {

    return (

        <AdminLayout>

            {/* HEADER */}
            <PageHeader
                title="Dashboard"
                subtitle="Monitor all catering activities in real time"
            />

            {/* TOP STATS */}
            <Grid>

                <StatCard
                    title="Total Orders"
                    value="-"
                    icon={
                        <ShoppingCart
                            size={22}
                            color="#7c3aed"
                        />
                    }
                />

                <StatCard
                    title="Customers"
                    value="-"
                    icon={
                        <Users
                            size={22}
                            color="#2563eb"
                        />
                    }
                />

                <StatCard
                    title="Deliveries"
                    value="-"
                    icon={
                        <Truck
                            size={22}
                            color="#059669"
                        />
                    }
                />

                <StatCard
                    title="Packages"
                    value="-"
                    icon={
                        <Package
                            size={22}
                            color="#ea580c"
                        />
                    }
                />

            </Grid>

            {/* QUICK INFO */}
            <div
                style={{
                    display: "grid",

                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(280px,1fr))",

                    gap: "20px",

                    marginTop: "26px",
                }}
            >

                {/* CARD 1 */}
                <Card>

                    <div
                        style={{
                            display: "flex",

                            alignItems: "center",

                            justifyContent:
                                "space-between",
                        }}
                    >

                        <div>

                            <div
                                style={{
                                    fontSize: "14px",

                                    color: "#94a3b8",

                                    marginBottom: "10px",
                                }}
                            >
                                Monthly Revenue
                            </div>

                            <div
                                style={{
                                    fontSize: "28px",

                                    fontWeight: "700",

                                    color: "white",
                                }}
                            >
                                -
                            </div>

                        </div>

                        <div
                            style={{
                                width: "58px",
                                height: "58px",

                                borderRadius: "18px",

                                background:
                                    "rgba(124,58,237,0.15)",

                                display: "flex",

                                alignItems: "center",

                                justifyContent: "center",
                            }}
                        >
                            <TrendingUp
                                size={26}
                                color="#8b5cf6"
                            />
                        </div>

                    </div>

                </Card>

                {/* CARD 2 */}
                <Card>

                    <div
                        style={{
                            display: "flex",

                            alignItems: "center",

                            justifyContent:
                                "space-between",
                        }}
                    >

                        <div>

                            <div
                                style={{
                                    fontSize: "14px",

                                    color: "#94a3b8",

                                    marginBottom: "10px",
                                }}
                            >
                                Pending Orders
                            </div>

                            <div
                                style={{
                                    fontSize: "28px",

                                    fontWeight: "700",

                                    color: "white",
                                }}
                            >
                                -
                            </div>

                        </div>

                        <div
                            style={{
                                width: "58px",
                                height: "58px",

                                borderRadius: "18px",

                                background:
                                    "rgba(59,130,246,0.15)",

                                display: "flex",

                                alignItems: "center",

                                justifyContent: "center",
                            }}
                        >
                            <Clock3
                                size={26}
                                color="#3b82f6"
                            />
                        </div>

                    </div>

                </Card>

            </div>

            {/* RECENT ORDERS */}
            <div
                style={{
                    marginTop: "28px",
                }}
            >

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
                                        "22px",

                                    color:
                                        "white",

                                    fontWeight:
                                        "700",
                                }}
                            >
                                Recent Orders
                            </h3>

                            <p
                                style={{
                                    margin:
                                        "8px 0 0",

                                    color:
                                        "#94a3b8",

                                    fontSize:
                                        "14px",
                                }}
                            >
                                Latest customer orders
                            </p>

                        </div>

                    </div>

                    <Table
                        headers={[
                            "Customer",
                            "Package",
                            "Status",
                            "Total",
                        ]}
                    >

                        {/* BACKEND DATA */}

                    </Table>

                    <div
                        style={{
                            marginTop:
                                "20px",
                        }}
                    >

                        <EmptyState
                            title="No Orders Yet"
                            subtitle="Customer order data will appear here"
                        />

                    </div>

                </Card>

            </div>

        </AdminLayout>
    );
}