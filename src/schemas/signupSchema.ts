import { z } from "zod";

const signupSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Email is invalid" }),
    username: z
        .string()
        .min(1, { message: "Username is required" })
        .max(30, { message: "Username is too long" })
        .regex(/^[a-zA-Z0-9_]+$/, {
            message: "Username can only contain letters, numbers, and underscores"
        }),
    password : z
        .string()
        .min(1, { message: "Password is required" })
        .max(30, { message: "Password is too long" })
});

export default signupSchema