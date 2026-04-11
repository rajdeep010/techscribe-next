"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useReducer,
} from "react";
import { AdminAssignmentListItem } from "@/lib/types";
import { adminAssignmentsReducer } from "@/reducer/AdminAssignmentsReducer";

type AdminAssignmentsContextValue = {
    assignments: AdminAssignmentListItem[];
    isLoading: boolean;
    error: string | null;
    searchQuery: string;
    assigningAssignmentId: string | null;
    fetchAssignments: () => Promise<void>;
    assignReviewer: (
        assignmentId: string,
        reviewerId: string
    ) => Promise<{ success: boolean; message?: string }>;
    setSearchQuery: (value: string) => void;
};

const AdminAssignmentsContext = createContext<AdminAssignmentsContextValue | undefined>(
    undefined
);

export function AdminAssignmentsProvider({
    children,
    initialAssignments = [],
}: {
    children: React.ReactNode;
    initialAssignments?: AdminAssignmentListItem[];
}) {
    const [state, dispatch] = useReducer(adminAssignmentsReducer, {
        assignments: initialAssignments,
        isLoading: false,
        error: null,
        searchQuery: "",
        assigningAssignmentId: null,
    });

    const fetchAssignments = useCallback(async () => {
        dispatch({ type: "SET_LOADING", payload: true });

        try {
            const response = await fetch("/api/admin/assignments", {
                method: "GET",
                cache: "no-store",
            });

            const data = await response.json();

            if (!response.ok) {
                dispatch({
                    type: "SET_ERROR",
                    payload: data.message || "Failed to load assignments",
                });
                return;
            }

            dispatch({
                type: "SET_ASSIGNMENTS",
                payload: (data.assignments || []) as AdminAssignmentListItem[],
            });
        } catch {
            dispatch({
                type: "SET_ERROR",
                payload: "Failed to load assignments",
            });
        }
    }, []);

    const assignReviewer = useCallback(async (assignmentId: string, reviewerId: string) => {
        dispatch({ type: "SET_ASSIGNING_ASSIGNMENT", payload: assignmentId });

        try {
            const response = await fetch(`/api/admin/assignments/${assignmentId}/assign`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ reviewerId }),
            });

            const data = await response.json();

            if (!response.ok) {
                dispatch({
                    type: "SET_ERROR",
                    payload: data.message || "Failed to assign reviewer",
                });
                return { success: false, message: data.message };
            }

            dispatch({
                type: "ASSIGN_REVIEWER",
                payload: {
                    assignmentId,
                    reviewer: data.reviewer,
                    status: data.status,
                },
            });

            return { success: true, message: data.message };
        } catch {
            dispatch({
                type: "SET_ERROR",
                payload: "Failed to assign reviewer",
            });
            return { success: false, message: "Failed to assign reviewer" };
        }
    }, []);

    const value = useMemo<AdminAssignmentsContextValue>(
        () => ({
            ...state,
            fetchAssignments,
            assignReviewer,
            setSearchQuery: (value: string) =>
                dispatch({ type: "SET_SEARCH_QUERY", payload: value }),
        }),
        [state, fetchAssignments, assignReviewer]
    );

    return (
        <AdminAssignmentsContext.Provider value={value}>
            {children}
        </AdminAssignmentsContext.Provider>
    );
}

export function useAdminAssignments() {
    const context = useContext(AdminAssignmentsContext);

    if (!context) {
        throw new Error("useAdminAssignments must be used within an AdminAssignmentsProvider");
    }

    return context;
}