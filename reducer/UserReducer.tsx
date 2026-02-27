import { UserState, UserAction, User } from "@/lib/types";


export function userReducer(state: any, action: any): UserState {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                user: action.payload,
                isLoading: false,
                error: null,
            };

        case "UPDATE_USER":
            if (!state.user) return state;
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload,
                },
            };


        case "SET_LOADING":
            return {
                ...state,
                isLoading: action.payload,
            };

        case "SET_ERROR":
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };

        default:
            return state;
    }
}