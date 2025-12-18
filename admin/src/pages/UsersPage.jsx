import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../lib/axios";
import { Users, Search, Calendar, Mail, UserPlus, Activity, DollarSign, ShoppingBag, Star, X } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";
import { useApi, useMutation } from "../components/hooks/useApi";
const UsersPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    // Use custom hook for fetching users
    const { data: usersData, loading, refetch: refetchUsers } = useApi('/admin/customers');
    const users = usersData?.customers || [];

    const filteredUsers = useMemo(() => {
        return users.filter(user => 
            (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const userStats = useMemo(() => {
        const totalUsers = users.length;
        const recentUsers = users.filter(user => {
            const createdAt = new Date(user.createdAt);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return createdAt > thirtyDaysAgo;
        }).length;
        
        const totalSpent = users.reduce((sum, user) => sum + (user.totalSpent || 0), 0);
        const totalOrders = users.reduce((sum, user) => sum + (user.totalOrders || 0), 0);
        
        return {
            total: totalUsers,
            recent: recentUsers,
            avgOrdersPerUser: totalUsers > 0 ? Math.round(totalOrders / totalUsers) : 0,
            totalSpent: totalSpent
        };
    }, [users]);

    const handleViewUser = (user) => {
        setSelectedUser(user);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-slate-800">Users</h1>
                    <LoadingSpinner size="md" text="Loading users..." />
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
                    <h1 className="text-3xl font-bold text-slate-800">Users</h1>
                    <p className="text-slate-600 mt-1">Manage customer accounts and view activity</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span>{userStats.total} total users</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600">Total Users</p>
                            <p className="text-2xl font-bold text-slate-800">{userStats.total}</p>
                        </div>
                        <Users className="w-8 h-8 text-slate-400" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600">New (30 days)</p>
                            <p className="text-2xl font-bold text-emerald-600">{userStats.recent}</p>
                        </div>
                        <UserPlus className="w-8 h-8 text-emerald-400" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600">Avg Orders</p>
                            <p className="text-2xl font-bold text-blue-600">{userStats.avgOrdersPerUser}</p>
                        </div>
                        <ShoppingBag className="w-8 h-8 text-blue-400" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600">Total Spent</p>
                            <p className="text-2xl font-bold text-purple-600">${userStats.totalSpent.toFixed(2)}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-purple-400" />
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        className="pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Users Grid */}
            {filteredUsers.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No users found</h3>
                    <p className="text-slate-600">
                        {searchTerm ? "Try adjusting your search terms" : "No users have registered yet"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map((user) => (
                        <div key={user._id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow duration-200">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.imageUrl || `https://ui-avatars.com/api/?name=${user.name}&background=0f172a&color=fff`}
                                            alt={user.name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-slate-800">{user.name || "Unknown User"}</h3>
                                            <p className="text-sm text-slate-600">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-sm text-slate-600">4.5</span>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600 flex items-center gap-2">
                                            <Calendar size={16} />
                                            Joined
                                        </span>
                                        <span className="text-slate-800 font-medium">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600 flex items-center gap-2">
                                            <ShoppingBag size={16} />
                                            Orders
                                        </span>
                                        <span className="text-slate-800 font-medium">
                                            {user.totalOrders || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600 flex items-center gap-2">
                                            <DollarSign size={16} />
                                            Total Spent
                                        </span>
                                        <span className="text-slate-800 font-medium">
                                            ${(user.totalSpent || 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewUser(user)}
                                        className="flex-1"
                                    >
                                        View Details
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                    >
                                        <Mail size={16} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center">
                            <h2 className="text-xl font-bold">User Details</h2>
                            <button 
                                onClick={() => setSelectedUser(null)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <img
                                    src={selectedUser.imageUrl || `https://ui-avatars.com/api/?name=${selectedUser.name}&background=0f172a&color=fff&size=128`}
                                    alt={selectedUser.name}
                                    className="w-20 h-20 rounded-full object-cover border-4 border-slate-200"
                                />
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800">{selectedUser.name || "Unknown User"}</h3>
                                    <p className="text-slate-600">{selectedUser.email}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                                            Active Customer
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="text-sm text-slate-600">4.5 Rating</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 text-slate-600 mb-1">
                                        <Calendar size={16} />
                                        <span className="text-sm">Member Since</span>
                                    </div>
                                    <p className="text-xl font-bold text-slate-800">
                                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 text-slate-600 mb-1">
                                        <ShoppingBag size={16} />
                                        <span className="text-sm">Total Orders</span>
                                    </div>
                                    <p className="text-xl font-bold text-slate-800">
                                        {selectedUser.totalOrders || 0}
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 text-slate-600 mb-1">
                                        <DollarSign size={16} />
                                        <span className="text-sm">Total Spent</span>
                                    </div>
                                    <p className="text-xl font-bold text-slate-800">
                                        ${(selectedUser.totalSpent || 0).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-semibold text-slate-800">Activity Overview</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                                <ShoppingBag size={16} className="text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">Total Purchase History</p>
                                                <p className="text-sm text-slate-600">Based on all orders</p>
                                            </div>
                                        </div>
                                        <span className="font-medium text-slate-800">${(selectedUser.totalSpent || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 italic text-sm text-blue-700">
                                        Detailed activity timeline is currently being aggregated from order history.
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-100">
                                <Button variant="outline" className="flex-1">
                                    <Mail size={16} className="mr-2" />
                                    Send Email
                                </Button>
                                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                                    View Orders
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
