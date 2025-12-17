import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";
import axiosInstance from "../lib/axios";

const AdminLayout = () => {
    const { user, isLoaded, isSignedIn } = useUser();

    useEffect(() => {
        const interceptor = axiosInstance.interceptors.request.use(async (config) => {
            if (isSignedIn) {
                const token = await window.Clerk?.session?.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }   
            }
            return config;
        });

        return () => axiosInstance.interceptors.request.eject(interceptor);
    }, [isSignedIn]);

    if (!isLoaded) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-100 flex">
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>

            <SignedIn>
                <Sidebar />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </SignedIn>
        </div>
    );
};

export default AdminLayout;
