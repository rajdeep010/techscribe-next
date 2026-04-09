import type { JSONContent } from "@tiptap/core"

type DerivedBlogMeta = {
    title: string
    excerpt: string
}

function normalizeWhitespace(value: string) {
    return value.replace(/\s+/g, " ").trim()
}

function collectText(node?: JSONContent): string[] {
    if (!node) {
        return []
    }

    const result: string[] = []

    if (typeof node.text === "string" && node.text.trim()) {
        result.push(node.text.trim())
    }

    if (Array.isArray(node.content)) {
        for (const child of node.content) {
            result.push(...collectText(child))
        }
    }

    return result
}

function getNodeText(node?: JSONContent) {
    return normalizeWhitespace(collectText(node).join(" "))
}

export function deriveBlogMetaFromContent(content?: JSONContent): DerivedBlogMeta {
    const nodes = Array.isArray(content?.content) ? content.content : []

    const meaningfulNodes = nodes.filter((node) => getNodeText(node).length > 0)

    const firstHeading = meaningfulNodes.find((node) => node.type === "heading")
    const titleSource = firstHeading ?? meaningfulNodes[0]
    const excerptSource =
        meaningfulNodes.find((node) => node !== titleSource && getNodeText(node).length > 0) ??
        meaningfulNodes[0]

    const rawTitle = getNodeText(titleSource)
    const rawExcerpt = getNodeText(excerptSource)

    return {
        title: rawTitle.slice(0, 140) || "Untitled blog",
        excerpt: rawExcerpt.slice(0, 280),
    }
}

export function isEmptyBlogContent(content?: JSONContent) {
    const text = getNodeText(content)
    return text.length === 0
}