import mongoose from "mongoose";

interface ConnectionObject {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect() {
    if (connection.isConnected) {
        return
    }

    const db = await mongoose.connect(process.env.MONGO_URI || '', {})
    connection.isConnected = db.connections[0].readyState
}

export default dbConnect