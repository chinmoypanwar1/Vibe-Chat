import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/apiResponse";
import ForgotPassword from "../../emails/resetPasswordTemplate";

export async function sendForgotPasswordEmail({
    email,
    token
}: { email: string, token: string}) : Promise<ApiResponse> {
    try {
        const response = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: "Reset Your Password | Vibe Chat",
            react: ForgotPassword({ token, email }),
        });

        if (response.error) {
            return {success : false, message : "Email could not be sent"}
        }
        return { success: true, message : "Email has been sent" }
    } catch (error) {
        return { success : false, message : "Email could not be sent" };
    }
}
