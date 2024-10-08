import mongoose, {Schema, Document, Types} from "mongoose";

export interface Message extends Document {
    chatRoom : Types.ObjectId;
    sender : Types.ObjectId;
    content : string;
    fileURL?: string;
    createdAt : Date;
}

const messageSchema : Schema<Message> = new Schema(
    {
        chatRoom : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Room",
            required : true
        },
        sender : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        content : {
            type : String,
            maxlength : 2000,
            required : true
        },
        fileURL : {
            type : String
        },
        createdAt : {
            type : Date,
            default : Date.now
        }
    }
)

export const messageModel = (mongoose.models.Message as mongoose.Model<Message>) || mongoose.model<Message>("Message", messageSchema)