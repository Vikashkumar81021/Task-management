import mongoose from "mongoose";

const connectToDatabase=async()=>{
  try {
   const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
   console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
      console.error("DB connection failed:", error);
  }
}

export {
    connectToDatabase
}