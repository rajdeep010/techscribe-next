'use client';

import AdminDashboard from '@/components/admin/admin-dashboard';
import UserDashboard from '@/components/dashboard/user-dashboard';
import { useUser } from '@/context/UserProvider';

const page = () => {
    const { user } = useUser();
    console.log("User in page component:", user);   
    if (!user) return null;

    if (user.role === "admin") {
        return <AdminDashboard />;
    }

    return <UserDashboard />;
}

export default page