import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number    //optional may or may not exist
}

const connection: ConnectionObject= {}

// connect function which returns promise, uses async await
async function dbConnect(): Promise<void>{
    if (connection.isConnected){
        console.log("Already connected to the database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '')

        connection.isConnected = db.connections[0].readyState

        console.log("Database connected successfully");
    } catch (error) {
        console.log("Connection failed with error: ", error);
        process.exit(1) //Exit the process as without db connection nothing can be done
    }
}       

export default dbConnect