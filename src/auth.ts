import NextAuth, { CredentialsSignin, NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import userModel from "@/models/user.model";
import bcrypt from "bcryptjs"
import {User, Session} from "next-auth"
import {JWT} from "next-auth/jwt"
import Credentials from "next-auth/providers/credentials";
import connectDB from "./lib/db/connectDB";
import { authConfig } from "./authConfig";

const authOptions : NextAuthConfig = {
    session : {
        strategy : "jwt",
        maxAge : 24*60*60
    },
    providers : [
        Credentials({
            type : "credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Enter your username : " },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if(credentials.password == null || credentials.username == null) {
                    throw new CredentialsSignin({
                        message : "Please provide all the credentials"
                    })
                };
                await connectDB();
                const user = await userModel.findOne({
                        username : credentials.username
                    })
                    if(!(user)) {
                        throw new CredentialsSignin({
                            message : "User does not exist. Please register yourself."
                        })
                    }
                    console.log(user)
                    if(!(user.isVerified)) {
                        throw new CredentialsSignin({
                            message : "Please verify your email"
                        })
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password as string, user.password)
                    const newUser = {
                        _id : user._id as string,
                        username : user.username as string,
                        isVerified : user.isVerified
                    }
                    if(!isPasswordCorrect) {
                        throw new CredentialsSignin({
                            message : "Invalid credentials"
                        })
                    }
                    return newUser;
            }
        }),
        GoogleProvider({
            clientId : process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks : {
        async jwt({ token, user }: { token: JWT, user?: User }) {
            if(user) {
                token._id = user._id?.toString();
                token.username = user.username;
                token.iat = Math.floor(Date.now() / 1000);
                token.exp = Math.floor(Date.now() / 1000) + 24*60*60;
                token.isVerified = user.isVerified ?? false
            }
            return token;
        },
        async session({ session, token }: { session: Session, token: JWT, user : User }) {
            if(token) {
                session.user._id = token._id?.toString();
                session.user.username = token.username;
                session.user.isVerified = token.isVerified;
            }
            return session;
        }
    },
    secret : process.env.NEXTAUTH_SECRET,
    pages : {
        signIn : "/login",
        signOut : "/logout"
    }

}

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions)