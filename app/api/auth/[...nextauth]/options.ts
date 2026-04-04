import UserModel from "@/model/User";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { loginSchema } from "@/lib/validations/auth";
import { normalizeEmail, normalizeUsername } from "@/lib/auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await dbConnect();

                const parsed = loginSchema.safeParse(credentials);

                if (!parsed.success) {
                    throw new Error(parsed.error.issues[0]?.message || "Invalid login data");
                }

                const { identifier, password } = parsed.data;
                const trimmedIdentifier = identifier.trim();

                const user = await UserModel.findOne({
                    $or: [
                        { email: normalizeEmail(trimmedIdentifier) },
                        { username: normalizeUsername(trimmedIdentifier) },
                    ],
                });

                if (!user) {
                    throw new Error("No user found with this email or username");
                }

                if (!user.isVerified) {
                    throw new Error("Please verify your account before signing in");
                }

                const isPasswordCorrect = await bcrypt.compare(password, user.password);

                if (!isPasswordCorrect) {
                    throw new Error("Incorrect credentials");
                }

                return {
                    id: user._id.toString(),
                    _id: user._id.toString(),
                    name: user.name ?? "",
                    email: user.email,
                    username: user.username,
                    isVerified: user.isVerified,
                    linkedin: user.linkedin ?? "",
                    profile: user.profile ?? "",
                    location: user.location ?? "",
                    about: user.about ?? "",
                    role: user.role ?? "user",
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token._id = user._id;
                token.name = user.name;
                token.email = user.email;
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.linkedin = user.linkedin;
                token.profile = user.profile;
                token.location = user.location;
                token.about = user.about;
                token.role = user.role ?? "user";
            }

            if (trigger === "update" && session?.user) {
                token.name = session.user.name ?? token.name;
                token.linkedin = session.user.linkedin ?? token.linkedin;
                token.profile = session.user.profile ?? token.profile;
                token.location = session.user.location ?? token.location;
                token.about = session.user.about ?? token.about;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user._id = token._id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.username = token.username;
                session.user.isVerified = token.isVerified;
                session.user.linkedin = token.linkedin;
                session.user.profile = token.profile;
                session.user.location = token.location;
                session.user.about = token.about;
                session.user.role = token.role ?? "user";
            }

            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};