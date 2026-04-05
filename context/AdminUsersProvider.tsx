"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useReducer,
} from "react";
import {
    AdminUserListItem,
    AdminUserRoleFilter,
    AdminUserVerificationFilter,
    AdminUsersState,
} from "@/lib/types";
import { adminUsersReducer } from "@/reducer/AdminUsersReducer";

type AdminUsersContextValue = AdminUsersState & {
    fetchUsers: () => Promise<void>;
    promoteUser: (userId: string) => Promise<{ success: boolean; message?: string }>;
    setSearchQuery: (value: string) => void;
    setRoleFilter: (value: AdminUserRoleFilter) => void;
    setVerificationFilter: (value: AdminUserVerificationFilter) => void;
};

const AdminUsersContext = createContext<AdminUsersContextValue | undefined>(
    undefined
);

export function AdminUsersProvider({
    children,
    initialUsers,
}: {
    children: React.ReactNode;
    initialUsers: AdminUserListItem[];
}) {
    const initialState: AdminUsersState = {
        users: initialUsers,
        isLoading: false,
        error: null,
        searchQuery: "",
        roleFilter: "all",
        verificationFilter: "all",
        promotingUserId: null,
    };

    const [state, dispatch] = useReducer(adminUsersReducer, initialState);

    const fetchUsers = useCallback(async () => {
        dispatch({ type: "SET_LOADING", payload: true });

        try {
            const response = await fetch("/api/admin/users", {
                method: "GET",
                cache: "no-store",
            });

            const data = await response.json();

            if (!response.ok) {
                dispatch({
                    type: "SET_ERROR",
                    payload: data.message || "Failed to load users",
                });
                return;
            }

            dispatch({
                type: "SET_USERS",
                payload: (data.users || []) as AdminUserListItem[],
            });
        } catch {
            dispatch({
                type: "SET_ERROR",
                payload: "Failed to load users",
            });
        }
    }, []);

    const promoteUser = useCallback(async (userId: string) => {
        dispatch({ type: "SET_PROMOTING_USER", payload: userId });

        try {
            const response = await fetch(`/api/admin/users/${userId}/role`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ role: "admin" }),
            });

            const data = await response.json();

            if (!response.ok) {
                dispatch({
                    type: "SET_ERROR",
                    payload: data.message || "Failed to update user role",
                });
                return {
                    success: false,
                    message: data.message,
                };
            }

            dispatch({
                type: "PROMOTE_USER",
                payload: { userId },
            });

            return {
                success: true,
                message: data.message,
            };
        } catch {
            dispatch({
                type: "SET_ERROR",
                payload: "Failed to update user role",
            });

            return {
                success: false,
                message: "Failed to update user role",
            };
        }
    }, []);

    const value = useMemo<AdminUsersContextValue>(
        () => ({
            ...state,
            fetchUsers,
            promoteUser,
            setSearchQuery: (value: string) =>
                dispatch({ type: "SET_SEARCH_QUERY", payload: value }),
            setRoleFilter: (value: AdminUserRoleFilter) =>
                dispatch({ type: "SET_ROLE_FILTER", payload: value }),
            setVerificationFilter: (value: AdminUserVerificationFilter) =>
                dispatch({ type: "SET_VERIFICATION_FILTER", payload: value }),
        }),
        [state, fetchUsers, promoteUser]
    );

    return (
        <AdminUsersContext.Provider value={value}>
            {children}
        </AdminUsersContext.Provider>
    );
}

export function useAdminUsers() {
    const context = useContext(AdminUsersContext);

    if (!context) {
        throw new Error("useAdminUsers must be used within an AdminUsersProvider");
    }

    return context;
}