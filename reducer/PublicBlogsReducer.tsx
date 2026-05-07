import { PublicBlogsAction, PublicBlogsState } from "@/lib/public-blog-types";

export function publicBlogsReducer(
    state: PublicBlogsState,
    action: PublicBlogsAction
): PublicBlogsState {
    switch (action.type) {
        case "SET_LOADING":
            return {
                ...state,
                isLoading: action.payload,
            };

        case "SET_BLOGS":
            return {
                ...state,
                blogs: action.payload,
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

        case "UPSERT_BLOG":
            return {
                ...state,
                blogs: state.blogs.some((blog) => blog.id === action.payload.id)
                    ? state.blogs.map((blog) =>
                        blog.id === action.payload.id ? action.payload : blog
                    )
                    : [action.payload, ...state.blogs],
            };

        case "REMOVE_BLOG":
            return {
                ...state,
                blogs: state.blogs.filter((blog) => blog.id !== action.payload),
            };

        default:
            return state;
    }
}