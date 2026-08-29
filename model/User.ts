import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
    name?: string;
    about?: string;
    linkedin?: string;
    profile?: string;
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    verifyCode?: string;
    verifyCodeExpiry?: Date | null;
    passwordChangeCode?: string;
    passwordChangeCodeExpiry?: Date | null;
    pendingPassword?: string;
    location?: string;
    avatar?: string;
    whatsappNumber?: string;
    role?: "user" | "admin";
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<User> = new Schema(
    {
        name: {
            type: String,
            trim: true,
            default: "",
        },
        about: {
            type: String,
            trim: true,
            default: "",
        },
        linkedin: {
            type: String,
            trim: true,
            default: "",
        },
        profile: {
            type: String,
            trim: true,
            default: "",
        },
        location: {
            type: String,
            trim: true,
            default: "",
        },
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            lowercase: true,
            unique: true,
            minlength: [3, "Username must be at least 3 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            unique: true,
            match: [/.+\@.+\..+/, "Please use a valid email address"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verifyCode: {
            type: String,
            default: "",
        },
        verifyCodeExpiry: {
            type: Date,
            default: null,
        },
        passwordChangeCode: {
            type: String,
            default: "",
        },
        passwordChangeCodeExpiry: {
            type: Date,
            default: null,
        },
        pendingPassword: {
            type: String,
            default: "",
        },
        avatar: {
            type: String,
            default: "https://github.com/shadcn.png",
        },
        whatsappNumber: {
            type: String,
            trim: true,
            default: "",
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);

const UserModel =
    (mongoose.models.User as mongoose.Model<User>) ||
    mongoose.model<User>("User", UserSchema);

export default UserModel;