import VerifyEmail from "../../emails/verifyEmailTemplate";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail({
    email,
    verifyCode,
    username
}: { email: string, verifyCode: string, username : string }) : Promise<ApiResponse> {
    try {
        const response = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: "Verify your Email | Vibe Chat",
            react: VerifyEmail({ verifyCode, username })
        });


        if (response.error) {
            return {success : false, message : "Email could not be sent"}
        }
        return { success: true, message : "Email has been sent" }
    } catch (error) {
        return { success : false, message : "Email could not be sent" };
    }
}
