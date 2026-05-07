"use client";

import { createContext, useContext } from "react";
import { useSession } from "next-auth/react";
import { UserState } from "@/lib/types";

const UserContext = createContext<UserState | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();

    const value: UserState = {
        user: session?.user
            ? {
                id: session.user._id ?? "",
                username: session.user.username ?? "",
                name: session.user.name ?? session.user.username ?? "",
                email: session.user.email ?? "",
                role: session.user.role ?? "user",
                avatar: session.user.avatar || undefined,
                language: "english",
            }
            : null,
        isLoading: status === "loading",
        error: null,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }

    return context;
}