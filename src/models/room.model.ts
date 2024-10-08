import mongoose, { Document, Schema, Types } from "mongoose";

export interface Room extends Document {
    participants : Types.ObjectId[];
    isGroupChat : boolean;
    name?: string;
    admins?: Types.ObjectId[];
    createdAt : Date;
    updatedAt : Date;
}

const roomSchema : Schema<Room> = new Schema(
    {
        participants : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "User"
            }
        ],
        isGroupChat : {
            type : Boolean,
            required : true
        },
        name : {
            type : String,
            required : function() {
                return this.isGroupChat
            }
        },
        admins : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "User",
                required : function() {
                    return this.isGroupChat
                }
            }
        ]
    },
    { timestamps : true }
)

export const roomModel = (mongoose.models.Room as mongoose.Model<Room>) || mongoose.model("Room", roomSchema);