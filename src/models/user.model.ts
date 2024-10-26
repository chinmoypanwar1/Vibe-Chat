'use server'
import mongoose, { Schema, Document, Model } from "mongoose";

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    avatarImage?: string;
    isVerified: boolean;
    verifyCode?: string;
    verifyCodeExpiry?: Date;
    forgotPasswordToken?: string;
    forgotPasswordTokenExpiry?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<User, Model<User>>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            match: [/^[a-zA-Z0-9_]+$/, "Please provide a valid username"]
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        avatarImage: {
            type: String
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        verifyCode: String,
        verifyCodeExpiry: Date,
        forgotPasswordToken: String,
        forgotPasswordTokenExpiry: Date
    },
    { timestamps: true }
);

// Check if the model already exists before defining it
const UserModel = (mongoose.models?.User as mongoose.Model<User>) || mongoose.model<User>('User', userSchema);

export default UserModel;