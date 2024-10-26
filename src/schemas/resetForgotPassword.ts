import { z } from "zod";

export const resetForgotPasswordSchema = z.object({
    password : z
        .string()
        .min(1, { message: "Password is required" })
        .max(30, { message: "Password is too long" })
})