import { AdminUsersAction, AdminUsersState } from "@/lib/types";

export function adminUsersReducer(
    state: AdminUsersState,
    action: AdminUsersAction
): AdminUsersState {
    switch (action.type) {
        case "SET_LOADING":
            return {
                ...state,
                isLoading: action.payload,
            };

        case "SET_USERS":
            return {
                ...state,
                users: action.payload,
                isLoading: false,
                error: null,
            };

        case "SET_ERROR":
            return {
                ...state,
                error: action.payload,
                isLoading: false,
                promotingUserId: null,
            };

        case "SET_SEARCH_QUERY":
            return {
                ...state,
                searchQuery: action.payload,
            };

        case "SET_ROLE_FILTER":
            return {
                ...state,
                roleFilter: action.payload,
            };

        case "SET_VERIFICATION_FILTER":
            return {
                ...state,
                verificationFilter: action.payload,
            };

        case "SET_PROMOTING_USER":
            return {
                ...state,
                promotingUserId: action.payload,
            };

        case "PROMOTE_USER":
            return {
                ...state,
                promotingUserId: null,
                users: state.users.map((user) =>
                    user.id === action.payload.userId
                        ? { ...user, role: "admin", updatedAt: new Date().toISOString() }
                        : user
                ),
            };

        default:
            return state;
    }
}