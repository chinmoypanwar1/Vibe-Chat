'use server'

import { NextRequest } from 'next/server'
import { sendApiResponse } from '@/lib/utils/response/apiResponse'
import userModel from '@/models/user.model'
import connectDB from '@/lib/db/connectDB'
import bcrypt from 'bcryptjs'

export async function PATCH(request : NextRequest) {

    try {
        
        await connectDB()
        const {token, password, email} = await request.json()
        
        if([token, password].some((field) => field.trim()==="")) {
            return sendApiResponse(false, "All fields are required", 400)
        }
        
        const user = await userModel.findOne({email})
        if(!user) {
            return sendApiResponse(false, "User not found. Please register yourself", 400)
        }
        
        if(!user.forgotPasswordToken || !user.forgotPasswordTokenExpiry) {
            return sendApiResponse(false, "Invalid token", 400)
        }
        
        const isTokenValid = await bcrypt.compare(token, user.forgotPasswordToken)
        console.log("The console log", isTokenValid, " ", token)
        if(!isTokenValid) {
            return sendApiResponse(false, "Invalid token", 400)
        }

        if(user.forgotPasswordTokenExpiry < new Date()) {
            return sendApiResponse(false, "Token expired", 400)
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        user.password = hashedPassword
        user.forgotPasswordToken = undefined
        user.forgotPasswordTokenExpiry = undefined
        await user.save();

        return sendApiResponse(true, "Password reset successfully", 200)

    } catch (error:any) {
        console.log(error)
        return sendApiResponse(false, "Internal Server Error", 500)
    }
}