import { AdminSupportAction, AdminSupportState } from "@/lib/types";

export function adminSupportReducer(
    state: AdminSupportState,
    action: AdminSupportAction
): AdminSupportState {
    switch (action.type) {
        case "SET_LOADING":
            return {
                ...state,
                isLoading: action.payload,
            };

        case "SET_TICKETS":
            return {
                ...state,
                tickets: action.payload,
                isLoading: false,
                error: null,
            };

        case "SET_ERROR":
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };

        case "SET_SEARCH_QUERY":
            return {
                ...state,
                searchQuery: action.payload,
            };

        case "SET_STATUS_FILTER":
            return {
                ...state,
                statusFilter: action.payload,
            };

        default:
            return state;
    }
}