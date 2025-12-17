import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const UsersPage = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axiosInstance.get("/admin/customers");
            setUsers(res.data.customers);
        } catch (error) {
            toast.error("Failed to fetch users");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Users</h1>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">User</th>
                            <th className="p-4 font-semibold text-slate-600">Email</th>
                            <th className="p-4 font-semibold text-slate-600">Joined</th>
                            <th className="p-4 font-semibold text-slate-600">Role</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-slate-50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.imageUrl || `https://ui-avatars.com/api/?name=${user.name}`}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <span className="font-medium text-slate-800">{user.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-600">{user.email}</td>
                                <td className="p-4 text-slate-500 text-sm">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-sm">
                                        Customer
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                     <div className="p-8 text-center text-slate-500">No users found.</div>
                )}
            </div>
        </div>
    );
};

export default UsersPage;
