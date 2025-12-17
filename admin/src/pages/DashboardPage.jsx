import { useEffect, useState, useMemo } from "react";
import { CreditCard, DollarSign, Package, Users, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import StatCard from "../components/ui/StatCard";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { useApi } from "../components/hooks/useApi";

const DashboardPage = () => {
    // Use custom hook for API calls
    const { data: statsData, loading, error, refetch } = useApi('/admin/dashboardStats');
    
    const stats = statsData?.stats?.[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        highestOrderValue: 0,
        lowestOrderValue: 0,
    };

    // Calculate additional metrics
    const additionalStats = useMemo(() => {
        return {
            growthRate: 12.5, // Mock data - would come from API
            conversionRate: 3.2,
            totalCustomers: 1250,
            activeProducts: 48
        };
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-US').format(num || 0);
    };

    const statCards = [
        {
            title: "Total Revenue",
            value: formatCurrency(stats.totalRevenue),
            icon: DollarSign,
            color: "bg-emerald-500",
            bgColor: "bg-emerald-50",
            textColor: "text-emerald-700",
            trend: "up",
            description: "Total revenue from all orders"
        },
        {
            title: "Total Orders",
            value: formatNumber(stats.totalOrders),
            icon: Package,
            color: "bg-blue-500",
            bgColor: "bg-blue-50",
            textColor: "text-blue-700",
            trend: "up",
            description: "Total number of orders placed"
        },
        {
            title: "Avg. Order Value",
            value: formatCurrency(stats.averageOrderValue),
            icon: CreditCard,
            color: "bg-purple-500",
            bgColor: "bg-purple-50",
            textColor: "text-purple-700",
            trend: "stable",
            description: "Average order value"
        },
        {
            title: "Highest Order",
            value: formatCurrency(stats.highestOrderValue),
            icon: TrendingUp,
            color: "bg-green-500",
            bgColor: "bg-green-50",
            textColor: "text-green-700",
            trend: "up",
            description: "Highest order value"
        },
        {
            title: "Lowest Order",
            value: formatCurrency(stats.lowestOrderValue),
            icon: TrendingDown,
            color: "bg-orange-500",
            bgColor: "bg-orange-50",
            textColor: "text-orange-700",
            trend: "down",
            description: "Lowest order value"
        }
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>
                    <LoadingSpinner size="md" text="Loading stats..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-pulse">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-slate-200 rounded-full mr-4"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to load dashboard</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>
                    <p className="text-slate-600 mt-1">Monitor your e-commerce performance</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span>Live data</span>
                </div>
            </div>

            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Total Revenue" 
                    value={formatCurrency(stats.totalRevenue)} 
                    icon={DollarSign} 
                    color="emerald"
                    trend="up"
                    trendValue="12.5%"
                />
                <StatCard 
                    title="Total Orders" 
                    value={formatNumber(stats.totalOrders)} 
                    icon={ShoppingCart} 
                    color="blue"
                    trend="up"
                    trendValue="8.2%"
                />
                <StatCard 
                    title="Avg Order Value" 
                    value={formatCurrency(stats.averageOrderValue)} 
                    icon={CreditCard} 
                    color="purple"
                    trend="stable"
                />
                <StatCard 
                    title="Active Products" 
                    value={additionalStats.activeProducts} 
                    icon={Package} 
                    color="green"
                    trend="up"
                    trendValue="4.1%"
                />
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold text-slate-800">Quick Actions</h2>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <button className="w-full text-left px-4 py-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <Package className="w-5 h-5 text-slate-600" />
                                    <span className="text-slate-700">Add New Product</span>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                            <button className="w-full text-left px-4 py-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-slate-600" />
                                    <span className="text-slate-700">View All Customers</span>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                            <button className="w-full text-left px-4 py-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="w-5 h-5 text-slate-600" />
                                    <span className="text-slate-700">Manage Orders</span>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold text-slate-800">Performance Summary</h2>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                <span className="text-sm text-slate-600">Conversion Rate</span>
                                <span className="text-sm font-semibold text-emerald-600">{additionalStats.conversionRate}%</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                <span className="text-sm text-slate-600">Active Customers</span>
                                <span className="text-sm font-semibold text-blue-600">{formatNumber(additionalStats.totalCustomers)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                <span className="text-sm text-slate-600">Highest Order</span>
                                <span className="text-sm font-semibold text-purple-600">{formatCurrency(stats.highestOrderValue)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-slate-600">Growth Rate</span>
                                <span className="text-sm font-semibold text-orange-600">{additionalStats.growthRate}%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
