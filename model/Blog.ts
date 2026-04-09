import mongoose, { Document, Schema, Types } from "mongoose"

export type BlogStatus = "draft" | "published"

export interface Blog extends Document {
    title: string
    excerpt: string
    contentJson: Record<string, unknown>
    contentHtml: string
    autosaveEnabled: boolean
    author: Types.ObjectId
    status: BlogStatus
    publishedAt?: Date | null
    createdAt: Date
    updatedAt: Date
}

const BlogSchema = new Schema<Blog>(
    {
        title: {
            type: String,
            trim: true,
            required: true,
            default: "Untitled blog",
            maxlength: 140,
        },
        excerpt: {
            type: String,
            trim: true,
            default: "",
            maxlength: 280,
        },
        contentJson: {
            type: Schema.Types.Mixed,
            required: true,
            default: {
                type: "doc",
                content: [{ type: "paragraph" }],
            },
        },
        contentHtml: {
            type: String,
            default: "",
        },
        autosaveEnabled: {
            type: Boolean,
            default: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
        },
        publishedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
)

if (process.env.NODE_ENV === "development" && mongoose.models.Blog) {
    mongoose.deleteModel("Blog")
}

const BlogModel =
    (mongoose.models.Blog as mongoose.Model<Blog>) ||
    mongoose.model<Blog>("Blog", BlogSchema)

export default BlogModel