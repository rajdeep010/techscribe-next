"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import type { JSONContent } from "@tiptap/core"
import { ExternalLink, Globe, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { SimpleEditor, type EditorPayload } from "@/components/tiptap-templates/simple/simple-editor"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"

const EMPTY_DOC: JSONContent = {
    type: "doc",
    content: [{ type: "paragraph" }],
}

type BlogStatus = "draft" | "published"

type BlogWriterResponse = {
    success: boolean
    message?: string
    blog?: {
        id: string
        title: string
        excerpt: string
        contentJson: JSONContent
        contentHtml: string
        autosaveEnabled: boolean
        status: BlogStatus
        createdAt: string
        updatedAt: string
    }
}

async function readApiResponse<T>(
    response: Response,
    fallbackMessage: string
): Promise<T> {
    const contentType = response.headers.get("content-type") ?? ""
    const raw = await response.text()

    if (!contentType.includes("application/json")) {
        throw new Error(fallbackMessage)
    }

    try {
        return JSON.parse(raw) as T
    } catch {
        throw new Error(fallbackMessage)
    }
}

export function BlogWriter() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialBlogId = searchParams.get("id")?.trim() ?? ""

    const [blogId, setBlogId] = useState(initialBlogId)
    const [status, setStatus] = useState<BlogStatus>("draft")
    const [autosaveEnabled, setAutosaveEnabled] = useState(true)
    const [editorState, setEditorState] = useState<EditorPayload>({
        json: EMPTY_DOC,
        html: "",
        text: "",
    })
    const [isDirty, setIsDirty] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isLoadingBlog, setIsLoadingBlog] = useState(Boolean(initialBlogId))
    const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)

    const hasLoadedInitialBlog = useRef(false)
    const isHydratingRef = useRef(false)

    useEffect(() => {
        if (!initialBlogId) {
            setBlogId("")
            setStatus("draft")
            setAutosaveEnabled(true)
            setEditorState({
                json: EMPTY_DOC,
                html: "",
                text: "",
            })
            setLastSavedAt(null)
            setIsDirty(false)
            setIsLoadingBlog(false)
            hasLoadedInitialBlog.current = true
            return
        }

        let isMounted = true

        async function loadBlog() {
            setIsLoadingBlog(true)

            try {
                const response = await fetch(`/api/admin/blogs/${initialBlogId}`, {
                    method: "GET",
                })

                const data = await readApiResponse<BlogWriterResponse>(
                    response,
                    "Blog API is not ready yet. Create the admin blog routes first."
                )

                if (!response.ok || !data.success || !data.blog) {
                    throw new Error(data.message || "Failed to fetch blog")
                }

                if (!isMounted) {
                    return
                }

                isHydratingRef.current = true

                setBlogId(data.blog.id)
                setStatus(data.blog.status)
                setAutosaveEnabled(data.blog.autosaveEnabled)
                setEditorState({
                    json: data.blog.contentJson ?? EMPTY_DOC,
                    html: data.blog.contentHtml ?? "",
                    text: "",
                })
                setLastSavedAt(data.blog.updatedAt)
                setIsDirty(false)
                hasLoadedInitialBlog.current = true
            } catch (error) {
                if (!isMounted) {
                    return
                }

                toast.error(error instanceof Error ? error.message : "Failed to fetch blog")
            } finally {
                if (isMounted) {
                    setIsLoadingBlog(false)

                    window.setTimeout(() => {
                        isHydratingRef.current = false
                    }, 0)
                }
            }
        }

        void loadBlog()

        return () => {
            isMounted = false
        }
    }, [initialBlogId])

    async function saveBlog(nextStatus: BlogStatus = status) {
        if (isSaving) {
            return null
        }

        setIsSaving(true)

        try {
            const isEditingExistingBlog = Boolean(blogId)
            const response = await fetch(
                isEditingExistingBlog ? `/api/admin/blogs/${blogId}` : "/api/admin/blogs",
                {
                    method: isEditingExistingBlog ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contentJson: editorState.json,
                        contentHtml: editorState.html,
                        autosaveEnabled,
                        status: nextStatus,
                    }),
                }
            )

            const data = await readApiResponse<BlogWriterResponse>(
                response,
                "Blog save is unavailable because the admin blog API routes are not created yet."
            )

            if (!response.ok || !data.success || !data.blog) {
                throw new Error(data.message || "Failed to save blog")
            }

            setBlogId(data.blog.id)
            setStatus(data.blog.status)
            setAutosaveEnabled(data.blog.autosaveEnabled)
            setLastSavedAt(data.blog.updatedAt)
            setIsDirty(false)

            if (!initialBlogId) {
                router.replace(`?id=${data.blog.id}`, { scroll: false })
            }

            return data.blog
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to save blog")
            return null
        } finally {
            setIsSaving(false)
        }
    }

    async function handlePublishToggle() {
        const nextStatus: BlogStatus = status === "published" ? "draft" : "published"
        const result = await saveBlog(nextStatus)

        if (!result) {
            return
        }

        toast.success(
            nextStatus === "published" ? "Blog published successfully" : "Blog moved back to draft"
        )
    }

    useEffect(() => {
        if (!hasLoadedInitialBlog.current || isHydratingRef.current) {
            return
        }

        if (!autosaveEnabled || !isDirty) {
            return
        }

        const timeoutId = window.setTimeout(() => {
            void saveBlog(status)
        }, 1000)

        return () => window.clearTimeout(timeoutId)
    }, [autosaveEnabled, isDirty, editorState, blogId, status])

    function handleEditorChange(payload: EditorPayload) {
        if (isHydratingRef.current) {
            return
        }

        setEditorState(payload)
        setIsDirty(true)
    }

    if (isLoadingBlog) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading blog...
                </div>
            </div>
        )
    }

    return (
        <SimpleEditor
            key={blogId || "new-blog"}
            content={editorState.json}
            editable
            onChange={handleEditorChange}
            toolbarExtras={
                <div className="hidden items-center gap-2 md:flex">
                    <Badge
                        variant={status === "published" ? "default" : "secondary"}
                        className="rounded-full px-2.5"
                    >
                        {status === "published" ? "Published" : "Draft"}
                    </Badge>

                    <label className="flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-[11px] text-muted-foreground backdrop-blur">
                        <span className="font-medium text-foreground/80">Autosave</span>
                        <Switch
                            checked={autosaveEnabled}
                            onCheckedChange={setAutosaveEnabled}
                            aria-label="Toggle autosave"
                        />
                    </label>

                    {!autosaveEnabled && <Button
                        type="button"
                        onClick={() => void saveBlog(status)}
                        disabled={isSaving || autosaveEnabled}
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-md px-4"
                    >
                        {isSaving ? "..." : "Save"}
                    </Button>}

                    <Button
                        type="button"
                        onClick={() => void handlePublishToggle()}
                        disabled={isSaving}
                        size="sm"
                        className="h-8 rounded-full px-4"
                    >
                        <Globe className="mr-2 h-3.5 w-3.5" />
                        {status === "published" ? "Unpublish" : "Publish"}
                    </Button>

                    {blogId && status === "published" ? (
                        <Button asChild type="button" size="sm" variant="ghost" className="h-8 rounded-full px-3">
                            <Link href={`/blogs/${blogId}`} target="_blank">
                                <ExternalLink className="mr-2 h-3.5 w-3.5" />
                                View live
                            </Link>
                        </Button>
                    ) : null}

                    <Spacer />
                </div>
            }
        />
    )
}