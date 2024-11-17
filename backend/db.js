import mongoose from "mongoose";

// db connection

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB}`)
        console.log('mongo db running at',connection.connection.port)
    } catch (error) {
        console.log('error while connecting' , error);
        
    }
}

export {connectDB}