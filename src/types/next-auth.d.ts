import { type DefaultSession } from "next-auth"

declare module "next-auth" {
    interface User {
        _id?: string,
        username?: string,
        isVerified?: boolean
    }
    interface Session {
        user : {
            _id?: string,
            username?: string,
            isVerified?: boolean,
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        _id?: string,
        username?: string,
        isVerified?: boolean
    }
}