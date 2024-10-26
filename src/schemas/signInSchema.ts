import { z } from "zod";

export const signInSchema = z.object({
    username: z
        .string()
        .min(1, { message: "Username is required" })
        .regex(/^[a-zA-Z0-9_]+$/, "Username cannot contain any special characters"),
    password: z
        .string()
        .min(1, { message: "Password is required" })
        .max(30, { message: "Password is too long" })
})