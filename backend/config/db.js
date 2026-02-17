// import mongoose from "mongoose";
// export const connectDB=async()=>{
//     try {
//         const conn=await mongoose.connect(process.env.MONGO_URL);
//         console.log("mongoDB conncet:",MONGO_URL);
//     } catch (error) {
//         console.log(error);
//         process.exit(1)
//     }
// }

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
