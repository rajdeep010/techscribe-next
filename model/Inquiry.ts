import mongoose, { Document, Schema } from "mongoose";

export type InquirySource = "contact-form" | "order-form";
export type InquiryStatus = "new" | "contacted" | "closed";

export interface Inquiry extends Document {
    name?: string;
    email?: string;
    whatsappNumber: string;
    assignmentType?: string;
    deadline?: Date | null;
    message: string;
    source: InquirySource;
    hadAttachment: boolean;
    status: InquiryStatus;
    createdAt: Date;
    updatedAt: Date;
}

const InquirySchema = new Schema<Inquiry>(
    {
        name: {
            type: String,
            trim: true,
            default: "",
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: "",
        },
        whatsappNumber: {
            type: String,
            required: true,
            trim: true,
        },
        assignmentType: {
            type: String,
            trim: true,
            default: "",
        },
        deadline: {
            type: Date,
            default: null,
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },
        source: {
            type: String,
            enum: ["contact-form", "order-form"],
            required: true,
        },
        hadAttachment: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ["new", "contacted", "closed"],
            default: "new",
        },
    },
    {
        timestamps: true,
    }
);

const InquiryModel =
    (mongoose.models.Inquiry as mongoose.Model<Inquiry>) ||
    mongoose.model<Inquiry>("Inquiry", InquirySchema);

export default InquiryModel;
