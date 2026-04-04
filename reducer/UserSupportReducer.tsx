import { UserSupportAction, UserSupportState } from "@/lib/types";

export function userSupportReducer(
    state: UserSupportState,
    action: UserSupportAction
): UserSupportState {
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

        case "SET_RESOLVING_TICKET":
            return {
                ...state,
                resolvingTicketId: action.payload,
            };

        case "MARK_TICKET_RESOLVED":
            return {
                ...state,
                resolvingTicketId: null,
                tickets: state.tickets.map((ticket) =>
                    ticket.id === action.payload.ticketId
                        ? {
                            ...ticket,
                            status: "resolved",
                            updatedAt: new Date().toISOString(),
                        }
                        : ticket
                ),
            };

        default:
            return state;
    }
}