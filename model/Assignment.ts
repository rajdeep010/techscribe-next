import mongoose, { Document, Model, Schema, Types } from "mongoose"

export type AssignmentStatus =
    | "submitted"
    | "under-review"
    | "assigned"
    | "in-progress"
    | "awaiting-user"
    | "delivered"
    | "completed"
    | "cancelled"
    | "archived"

export interface Assignment extends Document {
    user: Types.ObjectId
    title: string
    description: string
    subject?: string
    deliveryDeadline: Date
    status: AssignmentStatus
    assignedReviewer?: Types.ObjectId | null
    assignmentLockedAt?: Date | null
    startedAt?: Date | null
    deliveredAt?: Date | null
    completedAt?: Date | null
    lastEditableAt?: Date | null
    fileCount: number
    totalFileSizeBytes: number
    notesForAdmin?: string
    createdAt: Date
    updatedAt: Date
}

const assignmentSchema = new Schema<Assignment>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 160,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000,
        },
        subject: {
            type: String,
            trim: true,
            maxlength: 100,
            default: "",
        },
        deliveryDeadline: {
            type: Date,
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: [
                "submitted",
                "under-review",
                "assigned",
                "in-progress",
                "awaiting-user",
                "delivered",
                "completed",
                "cancelled",
                "archived",
            ],
            default: "submitted",
            index: true,
        },
        assignedReviewer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
            index: true,
        },
        assignmentLockedAt: {
            type: Date,
            default: null,
        },
        startedAt: {
            type: Date,
            default: null,
        },
        deliveredAt: {
            type: Date,
            default: null,
        },
        completedAt: {
            type: Date,
            default: null,
        },
        lastEditableAt: {
            type: Date,
            default: null,
        },
        fileCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalFileSizeBytes: {
            type: Number,
            default: 0,
            min: 0,
        },
        notesForAdmin: {
            type: String,
            trim: true,
            maxlength: 3000,
            default: "",
        },
    },
    {
        timestamps: true,
    }
)

assignmentSchema.index({ user: 1, createdAt: -1 })
assignmentSchema.index({ status: 1, assignedReviewer: 1, deliveryDeadline: 1 })

const AssignmentModel =
    (mongoose.models.Assignment as Model<Assignment>) ||
    mongoose.model<Assignment>("Assignment", assignmentSchema)

export default AssignmentModel