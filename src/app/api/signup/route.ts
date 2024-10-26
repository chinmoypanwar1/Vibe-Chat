'use server'

import userModel from "@/models/user.model"
import bcrypt from "bcryptjs"
import { NextRequest } from 'next/server'
import connectDB from "@/lib/db/connectDB"
import { sendApiResponse } from "@/lib/utils/response/apiResponse"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"
import crypto from "crypto"

export async function POST(request : NextRequest)  {

    try {
        await connectDB();
    
        const body = await request.json()
        const {username, email, password} = body
    
        if([username, email, password].some((field) => field.trim()==="")) {
            return sendApiResponse(false, "All fields are required", 400)
        }

        const existingUser = await userModel.findOne(
            {
                $or : [
                    {username : username},
                    {email : email}
                ]
            }
        )

        if(existingUser) {
            if(existingUser.isVerified) {
                return sendApiResponse(false, "User already exists", 400)
            } 
            else {
                return sendApiResponse(false, "User already exists. Please verify your email", 400)
            }
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await userModel.create({
            username,
            email,
            password : hashedPassword
        })

        if(!user) {
            return sendApiResponse(false, "Something went wrong", 500)
        }
        
        console.log(user)

        const UUID = crypto.randomUUID();
        const verifyCode = await bcrypt.hash(UUID, 10);
        user.verifyCode = verifyCode;
        user.verifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000)

        await user.save();

        try {
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
        } catch (error:any) {
            user.verifyCode = undefined
            user.verifyCodeExpiry = undefined
            await user.save({validateBeforeSave : false})
            return sendApiResponse(false, "Verification email cannot be sent successfully", 500);
        }

    } catch (error) {
        return sendApiResponse(false, "Internal Server Error", 500);
    }

}
