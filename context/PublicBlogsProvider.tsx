"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
} from "react";
import { PublicBlogListItem, PublicBlogsState } from "@/lib/public-blog-types";
import { publicBlogsReducer } from "@/reducer/PublicBlogsReducer";

type PublicBlogsContextValue = PublicBlogsState & {
    refreshBlogs: () => Promise<void>;
    setSearchQuery: (value: string) => void;
};

const PublicBlogsContext = createContext<PublicBlogsContextValue | undefined>(
    undefined
);

export function PublicBlogsProvider({
    children,
    initialBlogs = [],
}: {
    children: React.ReactNode;
    initialBlogs?: PublicBlogListItem[];
}) {
    const [state, dispatch] = useReducer(publicBlogsReducer, {
        blogs: initialBlogs,
        isLoading: false,
        error: null,
        searchQuery: "",
    });

    useEffect(() => {
        dispatch({ type: "SET_BLOGS", payload: initialBlogs });
    }, [initialBlogs]);

    const refreshBlogs = useCallback(async () => {
        dispatch({ type: "SET_LOADING", payload: true });

        try {
            const response = await fetch("/api/public/blogs", {
                method: "GET",
                cache: "no-store",
            });

            const data = await response.json();

            if (!response.ok) {
                dispatch({
                    type: "SET_ERROR",
                    payload: data.message || "Failed to load blogs",
                });
                return;
            }

            dispatch({
                type: "SET_BLOGS",
                payload: (data.blogs || []) as PublicBlogListItem[],
            });
        } catch {
            dispatch({
                type: "SET_ERROR",
                payload: "Failed to load blogs",
            });
        }
    }, []);

    const value = useMemo<PublicBlogsContextValue>(
        () => ({
            ...state,
            refreshBlogs,
            setSearchQuery: (value: string) =>
                dispatch({ type: "SET_SEARCH_QUERY", payload: value }),
        }),
        [state, refreshBlogs]
    );

    return (
        <PublicBlogsContext.Provider value={value}>
            {children}
        </PublicBlogsContext.Provider>
    );
}

export function usePublicBlogs() {
    const context = useContext(PublicBlogsContext);

    if (!context) {
        throw new Error("usePublicBlogs must be used within a PublicBlogsProvider");
    }

    return context;
}