import mongoose, {Schema, Document, Models} from "mongoose";

export interface User extends Document {
    username : string;
    email : string;
    password : string;
    avatarImage?: string;
    isVerified : boolean;
    verifyCode?: string;
    verifyCodeExpiry?: Date;
    forgotPasswordToken?: string;
    forgotPasswordTokenExpiry?: Date;
    refreshToken?: string;
    createdAt : Date;
    updatedAt : Date;
}

const userSchema = new Schema<User>(
    {
        username : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            match : [/^[a-zA-Z0-9_]+$/, "Please provide a valid username"]
        },
        email : {
            type : String,
            required : true,
            unique : true
        },
        password : {
            type : String,
            required : true
        },
        avatarImage : {
            type : String
        },
        isVerified : {
            type : Boolean,
            default : false
        },
        verifyCode : String,
        verifyCodeExpiry : {
            type : Date,
            default : Date.now()
        },
        forgotPasswordToken : String,
        refreshToken : String
    },
    { timestamps : true}
)

export const userModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema)
