import { UserAssignmentsAction, UserAssignmentsState } from "@/lib/types";

export function userAssignmentsReducer(
    state: UserAssignmentsState,
    action: UserAssignmentsAction
): UserAssignmentsState {
    switch (action.type) {
        case "SET_LOADING":
            return {
                ...state,
                isLoading: action.payload,
            };

        case "SET_ASSIGNMENTS":
            return {
                ...state,
                assignments: action.payload,
                isLoading: false,
                error: null,
            };

        case "SET_ERROR":
            return {
                ...state,
                error: action.payload,
                isLoading: false,
                creatingAssignment: false,
                uploadingForAssignmentId: null,
            };

        case "SET_SEARCH_QUERY":
            return {
                ...state,
                searchQuery: action.payload,
            };

        case "SET_CREATING_ASSIGNMENT":
            return {
                ...state,
                creatingAssignment: action.payload,
            };

        case "SET_UPLOADING_ASSIGNMENT":
            return {
                ...state,
                uploadingForAssignmentId: action.payload,
            };

        case "ADD_ASSIGNMENT":
            return {
                ...state,
                creatingAssignment: false,
                assignments: [action.payload, ...state.assignments],
            };

        default:
            return state;
    }
}