import { NextRequest, NextResponse } from "next/server";
import { sendApiResponse } from "@/lib/utils/response/apiResponse";
import userModel from "@/models/user.model";
import connectDB from "@/lib/db/connectDB";
import bcrypt from "bcryptjs";
import { sendForgotPasswordEmail } from "@/helpers/sendForgotPasswordEmail";
import crypto from "crypto";

export async function POST(request: NextRequest) {

    try {
        
        await connectDB();

        const {email} = await request.json();

        if(!email) {
            return sendApiResponse(false, "Email is required", 400);
        }

        const user = await userModel.findOne({email});

        if(!user) {
            return sendApiResponse(false, "User not found. Please register yourself", 400);
        }

        const UUID = crypto.randomUUID();
        const hashedToken = await bcrypt.hash(UUID, 12);
        user.forgotPasswordToken = hashedToken
        user.forgotPasswordTokenExpiry = new Date(Date.now() + 1*60*60*1000)

        await user.save({validateBeforeSave : false})
        
        const response = await sendForgotPasswordEmail({email, token : UUID});

        if(response.success) {
            return sendApiResponse(true, "Email has been sent", 200);
        } else {
            return sendApiResponse(false, "Email could not be sent", 500);
        }

    } catch (error : any) {
        console.error(error);
        return sendApiResponse(false, "Internal Server Error", 500);
    }

}
