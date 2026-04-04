import "next-auth";
import { DefaultSession } from "next-auth";

type AppUserRole = "admin" | "user";

declare module "next-auth" {
    interface User {
        id: string;
        _id: string;
        name?: string;
        email?: string;
        username?: string;
        isVerified?: boolean;
        linkedin?: string;
        profile?: string;
        location?: string;
        about?: string;
        role?: AppUserRole;
    }

    interface Session {
        user: {
            id?: string;
            _id?: string;
            name?: string;
            email?: string;
            username?: string;
            isVerified?: boolean;
            linkedin?: string;
            profile?: string;
            location?: string;
            about?: string;
            role?: AppUserRole;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        _id?: string;
        name?: string;
        email?: string;
        username?: string;
        isVerified?: boolean;
        linkedin?: string;
        profile?: string;
        location?: string;
        about?: string;
        role?: AppUserRole;
    }
}