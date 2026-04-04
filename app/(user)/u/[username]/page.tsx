"use client";

import UserDashboard from "@/components/dashboard/user-dashboard";
import { useUser } from "@/context/UserProvider";

export default function Page() {
    const { user } = useUser();

    if (!user) return null;

    return <UserDashboard />;
}