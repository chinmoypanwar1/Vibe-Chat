'use server'
import { NextRequest } from "next/server";
import { sendApiResponse } from "@/lib/utils/response/apiResponse";
import userModel from "@/models/user.model";
import connectDB from "@/lib/db/connectDB";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: NextRequest) {
    try {

        await connectDB();
        
        const body = await request.json()
        const {username, verifyCode} = body

        if (!username || !verifyCode) {
            return sendApiResponse(false, "Verification Code not found", 401);
        }
        if([username, verifyCode].some((field) => field.trim()==="")) {
            return sendApiResponse(false, "Verification code not found", 401);
        }

        const user = await userModel.findOne({username})
        if(!user) {
            return sendApiResponse(false, "User not found. Please register yourself", 400)
        }
        if(user.isVerified) {
            return sendApiResponse(false, "User already verified", 400)
        }
        if(!user.verifyCode || !user.verifyCodeExpiry) {
            return sendApiResponse(false, "Verification code not found", 400)
        }

        const isCodeValid = await bcrypt.compare(verifyCode, user.verifyCode);

        if(!isCodeValid) {
            return sendApiResponse(false, "Invalid verification code", 400)
        }

        if(user.verifyCodeExpiry < new Date()) {

            const UUID = crypto.randomUUID();
            const verifyCode = await bcrypt.hash(UUID, 10);
            user.verifyCode = verifyCode;
            user.verifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000)
            await user.save();
            const response = await sendVerificationEmail({
                email : user.email,
                username : user.username,
                verifyCode : UUID
            })
            if(!response.success) {
                return sendApiResponse(false, response.message, 500)
            }
            return sendApiResponse(
                response.success,
                response.message,
                200
            )
        }

        user.isVerified = true
        user.verifyCode = undefined
        user.verifyCodeExpiry = undefined
        await user.save()

        return sendApiResponse(true, "User verified successfully", 200)

    } catch (error:any) {
        console.error("Error verifying user: ", error);
        return sendApiResponse(false, "Internal Server Error. Please try again after some time", 500)
    }
}
