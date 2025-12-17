import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../lib/axios";
import { CheckCircle, Clock, Truck, XCircle, Package, Search, Calendar, User, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusLoading, setStatusLoading] = useState(null);
    const [expandedOrders, setExpandedOrders] = useState(new Set());

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/admin/orders");
            setOrders(res.data.orders || []);
        } catch (error) {
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setStatusLoading(orderId);
            await axiosInstance.patch(`/admin/order/${orderId}/status`, { status: newStatus });
            toast.success("Order status updated successfully");
            setOrders(prev => prev.map(order => 
                order._id === orderId 
                    ? { ...order, status: newStatus }
                    : order
            ));
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setStatusLoading(null);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "completed": return <CheckCircle size={16} />;
            case "shipped": return <Truck size={16} />;
            case "pending": return <Clock size={16} />;
            case "cancelled": return <XCircle size={16} />;
            default: return <Package size={16} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "completed": return "bg-green-100 text-green-700 border-green-200";
            case "shipped": return "bg-blue-100 text-blue-700 border-blue-200";
            case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "cancelled": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "completed": return "Delivered";
            case "shipped": return "Shipped";
            case "pending": return "Pending";
            case "cancelled": return "Cancelled";
            default: return status;
        }
    };

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    const filteredOrders = useMemo(() => {
        let filtered = orders;
        
        if (filterStatus !== "all") {
            filtered = filtered.filter(order => order.status === filterStatus);
        }
        
        if (searchTerm) {
            filtered = filtered.filter(order => 
                order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (order.userId?.name && order.userId.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (order.userId?.email && order.userId.email.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        
        return filtered;
    }, [orders, filterStatus, searchTerm]);

    const orderStats = useMemo(() => {
        return {
            total: orders.length,
            pending: orders.filter(o => o.status === "pending").length,
            shipped: orders.filter(o => o.status === "shipped").length,
            completed: orders.filter(o => o.status === "completed").length,
            cancelled: orders.filter(o => o.status === "cancelled").length,
            totalRevenue: orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
        };
    }, [orders]);

    const tabs = [
        { id: "all", label: "All Orders" },
        { id: "pending", label: "Pending" },
        { id: "shipped", label: "Shipped" },
        { id: "completed", label: "Delivered" },
        { id: "cancelled", label: "Cancelled" },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-slate-800">Orders</h1>
                    <LoadingSpinner size="md" text="Loading orders..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-pulse">
                            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                            <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Orders</h1>
                    <p className="text-slate-600 mt-1">Manage and track customer orders</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span>{orderStats.total} total orders</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600">Total Orders</p>
                            <p className="text-2xl font-bold text-slate-800">{orderStats.total}</p>
                        </div>
                        <Package className="w-8 h-8 text-slate-400" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
                        </div>
                        <Clock className="w-8 h-8 text-yellow-400" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600">Shipped</p>
                            <p className="text-2xl font-bold text-blue-600">{orderStats.shipped}</p>
                        </div>
                        <Truck className="w-8 h-8 text-blue-400" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600">Completed</p>
                            <p className="text-2xl font-bold text-green-600">{orderStats.completed}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600">Revenue</p>
                            <p className="text-2xl font-bold text-emerald-600">${orderStats.totalRevenue.toFixed(2)}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-emerald-400" />
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search orders by ID, customer name, or email..."
                        className="pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
                {tabs.map(tab => {
                    const count = tab.id === "all" ? orderStats.total : orderStats[tab.id] || 0;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setFilterStatus(tab.id)}
                            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                                filterStatus === tab.id 
                                    ? "bg-white text-emerald-600 border-b-2 border-emerald-600" 
                                    : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            {tab.label}
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                                filterStatus === tab.id ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                            }`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No orders found</h3>
                    <p className="text-slate-600">
                        {searchTerm || filterStatus !== "all" 
                            ? "Try adjusting your search or filters" 
                            : "No orders have been placed yet"}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div key={order._id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-2">
                                            <span className="font-mono text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                                #{order._id.slice(-8)}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-6 text-sm text-slate-600 mb-2">
                                            <div className="flex items-center gap-2">
                                                <User size={16} />
                                                <span>{order.userId?.name || "Guest"}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} />
                                                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Package size={16} />
                                                <span>{order.orderItems?.length || 0} items</span>
                                            </div>
                                        </div>
                                        {order.userId?.email && (
                                            <p className="text-sm text-slate-500">{order.userId.email}</p>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm text-slate-600">Total</p>
                                            <p className="text-xl font-bold text-slate-800">${order.totalPrice?.toFixed(2) || "0.00"}</p>
                                        </div>
                                        
                                        <div className="relative">
                                            {statusLoading === order._id ? (
                                                <div className="px-3 py-2 bg-slate-100 rounded-lg">
                                                    <LoadingSpinner size="sm" />
                                                </div>
                                            ) : (
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer hover:border-emerald-400 transition-colors"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="completed">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            )}
                                        </div>
                                        
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleOrderExpansion(order._id)}
                                            className="lg:hidden"
                                        >
                                            {expandedOrders.has(order._id) ? "Hide" : "Show"} Details
                                        </Button>
                                    </div>
                                </div>
                                
                                {/* Expanded Order Details */}
                                {(expandedOrders.has(order._id) || window.innerWidth >= 1024) && order.orderItems?.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-slate-100">
                                        <h4 className="font-medium text-slate-800 mb-4">Order Items</h4>
                                        <div className="space-y-3">
                                            {order.orderItems.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        {item.productId?.imageUrls?.[0] && (
                                                            <img
                                                                src={item.productId.imageUrls[0]}
                                                                alt={item.productId.name}
                                                                className="w-12 h-12 object-cover rounded-lg"
                                                            />
                                                        )}
                                                        <div>
                                                            <p className="font-medium text-slate-800">{item.productId?.name || "Product"}</p>
                                                            <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <p className="font-medium text-slate-800">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
