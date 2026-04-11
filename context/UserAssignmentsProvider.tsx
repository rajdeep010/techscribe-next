"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useReducer,
} from "react";
import { AssignmentListItem, UserAssignmentsState } from "@/lib/types";
import { userAssignmentsReducer } from "@/reducer/UserAssignmentsReducer";

type CreateAssignmentInput = {
    title: string;
    description: string;
    subject?: string;
    deliveryDeadline: string;
};

type UserAssignmentsContextValue = UserAssignmentsState & {
    fetchAssignments: () => Promise<void>;
    createAssignment: (
        input: CreateAssignmentInput
    ) => Promise<{ success: boolean; assignmentId?: string; message?: string }>;
    uploadFiles: (
        assignmentId: string,
        files: File[]
    ) => Promise<{ success: boolean; message?: string }>;
    setSearchQuery: (value: string) => void;
};

const UserAssignmentsContext = createContext<UserAssignmentsContextValue | undefined>(
    undefined
);

export function UserAssignmentsProvider({
    children,
    initialAssignments = [],
}: {
    children: React.ReactNode;
    initialAssignments?: AssignmentListItem[];
}) {
    const initialState: UserAssignmentsState = {
        assignments: initialAssignments,
        isLoading: false,
        error: null,
        searchQuery: "",
        creatingAssignment: false,
        uploadingForAssignmentId: null,
    };

    const [state, dispatch] = useReducer(userAssignmentsReducer, initialState);

    const fetchAssignments = useCallback(async () => {
        dispatch({ type: "SET_LOADING", payload: true });

        try {
            const response = await fetch("/api/user/assignments", {
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
                payload: (data.assignments || []) as AssignmentListItem[],
            });
        } catch {
            dispatch({
                type: "SET_ERROR",
                payload: "Failed to load assignments",
            });
        }
    }, []);

    const createAssignment = useCallback(async (input: CreateAssignmentInput) => {
        dispatch({ type: "SET_CREATING_ASSIGNMENT", payload: true });

        try {
            const response = await fetch("/api/user/assignments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            });

            const data = await response.json();

            if (!response.ok) {
                dispatch({
                    type: "SET_ERROR",
                    payload: data.message || "Failed to create assignment",
                });
                return { success: false, message: data.message };
            }

            dispatch({
                type: "ADD_ASSIGNMENT",
                payload: data.assignment as AssignmentListItem,
            });

            return {
                success: true,
                assignmentId: data.assignment?.id,
                message: data.message,
            };
        } catch {
            dispatch({
                type: "SET_ERROR",
                payload: "Failed to create assignment",
            });
            return { success: false, message: "Failed to create assignment" };
        }
    }, []);

    const uploadFiles = useCallback(async (assignmentId: string, files: File[]) => {
        dispatch({ type: "SET_UPLOADING_ASSIGNMENT", payload: assignmentId });

        try {
            const formData = new FormData();

            for (const file of files) {
                formData.append("files", file);
            }

            const response = await fetch(`/api/user/assignments/${assignmentId}/files`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                dispatch({
                    type: "SET_ERROR",
                    payload: data.message || "Failed to upload files",
                });
                dispatch({ type: "SET_UPLOADING_ASSIGNMENT", payload: null });
                return { success: false, message: data.message };
            }

            dispatch({ type: "SET_UPLOADING_ASSIGNMENT", payload: null });
            await fetchAssignments();

            return { success: true, message: data.message };
        } catch {
            dispatch({
                type: "SET_ERROR",
                payload: "Failed to upload files",
            });
            dispatch({ type: "SET_UPLOADING_ASSIGNMENT", payload: null });
            return { success: false, message: "Failed to upload files" };
        }
    }, [fetchAssignments]);

    const value = useMemo<UserAssignmentsContextValue>(
        () => ({
            ...state,
            fetchAssignments,
            createAssignment,
            uploadFiles,
            setSearchQuery: (value: string) =>
                dispatch({ type: "SET_SEARCH_QUERY", payload: value }),
        }),
        [state, fetchAssignments, createAssignment, uploadFiles]
    );

    return (
        <UserAssignmentsContext.Provider value={value}>
            {children}
        </UserAssignmentsContext.Provider>
    );
}

export function useUserAssignments() {
    const context = useContext(UserAssignmentsContext);

    if (!context) {
        throw new Error("useUserAssignments must be used within a UserAssignmentsProvider");
    }

    return context;
}