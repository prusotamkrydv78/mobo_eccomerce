import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import { CreditCard, DollarSign, Package, Users } from "lucide-react";
import toast from "react-hot-toast";

const DashboardPage = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axiosInstance.get("/admin/dashboardStats");
                if (response.data.stats && response.data.stats.length > 0) {
                    setStats(response.data.stats[0]);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
                // toast.error("Failed to load dashboard stats");
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            title: "Total Revenue",
            value: `$${(stats.totalRevenue || 0).toLocaleString()}`,
            icon: DollarSign,
            color: "bg-emerald-500",
        },
        {
            title: "Total Orders",
            value: stats.totalOrders || 0,
            icon: Package,
            color: "bg-blue-500",
        },
        {
            title: "Avg. Order Value",
            value: `$${Math.round(stats.averageOrderValue || 0).toLocaleString()}`,
            icon: CreditCard,
            color: "bg-purple-500",
        },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
                        <div className={`p-4 rounded-full ${stat.color} text-white mr-4`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;
