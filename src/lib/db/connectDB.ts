import mongoose from "mongoose";

interface connectionInstance {
    isConnected?: number
}

const connection : connectionInstance = {}

async function connectDB() : Promise<void> {
    if(connection.isConnected) {
        return;
    }
    const db = await mongoose.connect(process.env.MONGODB_URI as string);
    connection.isConnected = db.connections[0].readyState
    db.connection.on("connected", () => {
        console.log("MongoDB connected");
    })
    db.connection.on("disconnected", () => {
        console.log("MongoDB Disconnected");
    })
    db.connection.on("error", () => {
        console.log("MongoDB is down");
        process.exit(1);
    })
}

export default connectDB;