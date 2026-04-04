"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useReducer,
} from "react";
import {
    SupportTicketItem,
    UserSupportFilter,
    UserSupportState,
} from "@/lib/types";
import { userSupportReducer } from "@/reducer/UserSupportReducer";

type UserSupportContextValue = UserSupportState & {
    fetchTickets: () => Promise<void>;
    resolveTicket: (ticketId: string) => Promise<void>;
    setSearchQuery: (value: string) => void;
    setStatusFilter: (value: UserSupportFilter) => void;
};

const UserSupportContext = createContext<UserSupportContextValue | undefined>(
    undefined
);

export function UserSupportProvider({
    children,
    initialTickets,
}: {
    children: React.ReactNode;
    initialTickets: SupportTicketItem[];
}) {
    const initialState: UserSupportState = {
        tickets: initialTickets,
        isLoading: false,
        error: null,
        searchQuery: "",
        statusFilter: "all",
        resolvingTicketId: null,
    };

    const [state, dispatch] = useReducer(userSupportReducer, initialState);

    const fetchTickets = useCallback(async () => {
        dispatch({ type: "SET_LOADING", payload: true });

        try {
            const response = await fetch("/api/user/support", {
                method: "GET",
                cache: "no-store",
            });

            const data = await response.json();

            if (!response.ok) {
                dispatch({
                    type: "SET_ERROR",
                    payload: data.message || "Failed to load your tickets",
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
                payload: "Failed to load your tickets",
            });
        }
    }, []);

    const resolveTicket = useCallback(async (ticketId: string) => {
        dispatch({ type: "SET_RESOLVING_TICKET", payload: ticketId });

        try {
            const response = await fetch(`/api/user/support/${ticketId}/resolve`, {
                method: "PATCH",
            });

            const data = await response.json();

            if (!response.ok) {
                dispatch({
                    type: "SET_ERROR",
                    payload: data.message || "Failed to resolve ticket",
                });
                dispatch({ type: "SET_RESOLVING_TICKET", payload: null });
                return;
            }

            dispatch({
                type: "MARK_TICKET_RESOLVED",
                payload: { ticketId },
            });
        } catch {
            dispatch({
                type: "SET_ERROR",
                payload: "Failed to resolve ticket",
            });
            dispatch({ type: "SET_RESOLVING_TICKET", payload: null });
        }
    }, []);

    const value = useMemo<UserSupportContextValue>(
        () => ({
            ...state,
            fetchTickets,
            resolveTicket,
            setSearchQuery: (value: string) =>
                dispatch({ type: "SET_SEARCH_QUERY", payload: value }),
            setStatusFilter: (value: UserSupportFilter) =>
                dispatch({ type: "SET_STATUS_FILTER", payload: value }),
        }),
        [state, fetchTickets, resolveTicket]
    );

    return (
        <UserSupportContext.Provider value={value}>
            {children}
        </UserSupportContext.Provider>
    );
}

export function useUserSupport() {
    const context = useContext(UserSupportContext);

    if (!context) {
        throw new Error("useUserSupport must be used within a UserSupportProvider");
    }

    return context;
}