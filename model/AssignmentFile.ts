import mongoose, { Document, Model, Schema, Types } from "mongoose"

export type AssignmentFileStatus =
    | "active"
    | "replaced"
    | "locked"
    | "pending-delete"
    | "deleted"

export type AssignmentFileProvider = "supabase" | "r2"

export interface AssignmentFile extends Document {
    assignment: Types.ObjectId
    ownerUser: Types.ObjectId
    uploadedBy: Types.ObjectId
    storageProvider: AssignmentFileProvider
    bucket: string
    storagePath: string
    originalName: string
    mimeType: string
    sizeBytes: number
    status: AssignmentFileStatus
    isVisibleToUser: boolean
    deleteAfter?: Date | null
    markedForDeletionAt?: Date | null
    deletedAt?: Date | null
    createdAt: Date
    updatedAt: Date
}

const assignmentFileSchema = new Schema<AssignmentFile>(
    {
        assignment: {
            type: Schema.Types.ObjectId,
            ref: "Assignment",
            required: true,
            index: true,
        },
        ownerUser: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        storageProvider: {
            type: String,
            enum: ["supabase", "r2"],
            required: true,
            default: "supabase",
        },
        bucket: {
            type: String,
            required: true,
            trim: true,
        },
        storagePath: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        originalName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 255,
        },
        mimeType: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },
        sizeBytes: {
            type: Number,
            required: true,
            min: 1,
        },
        status: {
            type: String,
            enum: ["active", "replaced", "locked", "pending-delete", "deleted"],
            default: "active",
            index: true,
        },
        isVisibleToUser: {
            type: Boolean,
            default: true,
        },
        deleteAfter: {
            type: Date,
            default: null,
        },
        markedForDeletionAt: {
            type: Date,
            default: null,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
)

assignmentFileSchema.index({ assignment: 1, status: 1 })
assignmentFileSchema.index({ ownerUser: 1, createdAt: -1 })
assignmentFileSchema.index({ status: 1, deleteAfter: 1 })

const AssignmentFileModel =
    (mongoose.models.AssignmentFile as Model<AssignmentFile>) ||
    mongoose.model<AssignmentFile>("AssignmentFile", assignmentFileSchema)

export default AssignmentFileModel