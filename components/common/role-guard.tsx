"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserRole } from "@/lib/types";

interface RoleGuardProps {
    children: React.ReactNode;
    user: { role: UserRole } | null;
    requiredRole: UserRole;
    redirectTo?: string;
}

export function RoleGuard({
    children,
    user,
    requiredRole,
    redirectTo = "/"
}: RoleGuardProps) {
    const router = useRouter();

    useEffect(() => {
        if (!user || user.role !== requiredRole) {
            router.push(redirectTo);
        }
    }, [user, requiredRole, redirectTo, router]);

    if (!user || user.role !== requiredRole) {
        return null;
    }

    return <>{children}</>;
}