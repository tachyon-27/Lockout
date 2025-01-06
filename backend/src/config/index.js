import mongoose from 'mongoose';

const DB_NAME = 'Tachyon';

const connectDB = async ()=> {
    try {
        console.log(process.env.MONGODB_URI)
        const connectionInstance = await  mongoose.connect( process.env.MONGODB_URI );
        console.log(`\n MongoDB connected! DB HOST ${connectionInstance.connection.host}`)
    }
    catch (error){
        console.log("MONGODB connection error: ", error);
        process.exit(1);
    }
}

export default connectDB;