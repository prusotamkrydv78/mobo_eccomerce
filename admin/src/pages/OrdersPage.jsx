import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import { CheckCircle, Clock, Truck, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axiosInstance.get("/admin/orders");
            setOrders(res.data.orders);
        } catch (error) {
            toast.error("Failed to fetch orders");
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axiosInstance.patch(`/admin/order/${orderId}/status`, { status: newStatus });
            toast.success("Order status updated");
            fetchOrders();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "completed": return "bg-green-100 text-green-700";
            case "shipped": return "bg-blue-100 text-blue-700";
            case "pending": return "bg-yellow-100 text-yellow-700";
            default: return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Orders</h1>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Order ID</th>
                            <th className="p-4 font-semibold text-slate-600">Customer</th>
                            <th className="p-4 font-semibold text-slate-600">Total</th>
                            <th className="p-4 font-semibold text-slate-600">Date</th>
                            <th className="p-4 font-semibold text-slate-600">Status</th>
                            <th className="p-4 font-semibold text-slate-600">Items</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-slate-50">
                                <td className="p-4 font-mono text-sm text-slate-500">
                                    {order._id.slice(-6)}...
                                </td>
                                <td className="p-4">
                                    <div>
                                        <p className="font-medium text-slate-800">{order.userId?.name || "Guest"}</p>
                                        <p className="text-xs text-slate-500">{order.userId?.email}</p>
                                    </div>
                                </td>
                                <td className="p-4 font-medium">${order.totalPrice}</td>
                                <td className="p-4 text-slate-500 text-sm">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium border-none focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer ${getStatusColor(order.status)}`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="completed">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="p-4 text-slate-500 text-sm">
                                    {order.orderItems?.length || 0} items
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && (
                     <div className="p-8 text-center text-slate-500">No orders found.</div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
