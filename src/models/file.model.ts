import mongoose, {Schema, Document, Types} from "mongoose";

export interface File extends Document {
    uploader : Types.ObjectId;
    filename : string;
    fileURL : string;
    createdAt : Date;
}

const fileSchema : Schema<File> = new Schema<File> (
    {
        uploader : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        filename : {
            type : String,
            required : true
        },
        fileURL : {
            type : String,
            required : true
        },
        createdAt : {
            type : Date,
            default : Date.now
        }
    }
)

export const fileModel = (mongoose.models.File as mongoose.Model<File>) || mongoose.model<File>("File", fileSchema)