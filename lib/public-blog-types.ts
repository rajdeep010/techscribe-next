export type PublicBlogListItem = {
    id: string
    title: string
    excerpt: string
    contentHtml: string
    publishedAt: string | null
    updatedAt: string
}

export type PublicBlogsState = {
    blogs: PublicBlogListItem[]
    isLoading: boolean
    error: string | null
    searchQuery: string
}

export type PublicBlogsAction =
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_BLOGS"; payload: PublicBlogListItem[] }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "SET_SEARCH_QUERY"; payload: string }
    | { type: "UPSERT_BLOG"; payload: PublicBlogListItem }
    | { type: "REMOVE_BLOG"; payload: string }