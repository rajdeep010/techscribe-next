"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useReducer,
} from "react";
import {
    AdminSupportFilter,
    AdminSupportState,
    SupportTicketItem,
} from "@/lib/types";
import { adminSupportReducer } from "@/reducer/AdminSupportReducer";

type AdminSupportContextValue = AdminSupportState & {
    fetchTickets: () => Promise<void>;
    setSearchQuery: (value: string) => void;
    setStatusFilter: (value: AdminSupportFilter) => void;
};

const AdminSupportContext = createContext<AdminSupportContextValue | undefined>(
    undefined
);

export function AdminSupportProvider({
    children,
    initialTickets,
}: {
    children: React.ReactNode;
    initialTickets: SupportTicketItem[];
}) {
    const initialState: AdminSupportState = {
        tickets: initialTickets,
        isLoading: false,
        error: null,
        searchQuery: "",
        statusFilter: "all",
    };

    const [state, dispatch] = useReducer(adminSupportReducer, initialState);

    const fetchTickets = useCallback(async () => {
        dispatch({ type: "SET_LOADING", payload: true });

        try {
            const response = await fetch("/api/admin/support", {
                method: "GET",
                cache: "no-store",
            });

            const data = await response.json();

            if (!response.ok) {
                dispatch({
                    type: "SET_ERROR",
                    payload: data.message || "Failed to load support tickets",
                });
                return;
            }

            dispatch({
                type: "SET_TICKETS",
                payload: (data.tickets || []) as SupportTicketItem[],
            });
        } catch {
            dispatch({
                type: "SET_ERROR",
                payload: "Failed to load support tickets",
            });
        }
    }, []);

    const value = useMemo<AdminSupportContextValue>(
        () => ({
            ...state,
            fetchTickets,
            setSearchQuery: (value: string) =>
                dispatch({ type: "SET_SEARCH_QUERY", payload: value }),
            setStatusFilter: (value: AdminSupportFilter) =>
                dispatch({ type: "SET_STATUS_FILTER", payload: value }),
        }),
        [state, fetchTickets]
    );

    return (
        <AdminSupportContext.Provider value={value}>
            {children}
        </AdminSupportContext.Provider>
    );
}

export function useAdminSupport() {
    const context = useContext(AdminSupportContext);

    if (!context) {
        throw new Error("useAdminSupport must be used within an AdminSupportProvider");
    }

    return context;
}