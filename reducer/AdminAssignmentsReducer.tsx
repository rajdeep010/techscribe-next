import { AdminAssignmentsAction, AdminAssignmentsState } from "@/lib/types";

export function adminAssignmentsReducer(
    state: AdminAssignmentsState,
    action: AdminAssignmentsAction
): AdminAssignmentsState {
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
                assigningAssignmentId: null,
            };

        case "SET_SEARCH_QUERY":
            return {
                ...state,
                searchQuery: action.payload,
            };

        case "SET_ASSIGNING_ASSIGNMENT":
            return {
                ...state,
                assigningAssignmentId: action.payload,
            };

        case "ASSIGN_REVIEWER":
            return {
                ...state,
                assigningAssignmentId: null,
                assignments: state.assignments.map((assignment) =>
                    assignment.id === action.payload.assignmentId
                        ? {
                            ...assignment,
                            assignedReviewer: action.payload.reviewer,
                            status: action.payload.status,
                            updatedAt: new Date().toISOString(),
                        }
                        : assignment
                ),
            };

        default:
            return state;
    }
}