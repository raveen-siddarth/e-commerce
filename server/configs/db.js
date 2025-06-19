import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        mongoose.connection.on("connected", ()=> {console.log("database conected")});
        await mongoose.connect(`${process.env.MONGODB_URI}/raveensiddarth`)
    } catch (error) {
        console.error(error.message);
        
    }
}  

export default connectDB;