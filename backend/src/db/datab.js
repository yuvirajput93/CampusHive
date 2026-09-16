import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGODB_URI,{
            dbName:"campusconnect",
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    }catch(err){
        console.error("❌ MongoDB connection failed:", err);
        process.exit(1);
    }
}

export default connectDB;