
import mongoose from "mongoose";

export async function connect(){
    try{
      await mongoose.connect(process.env.Mongo_URI)
       const connection=mongoose.connection;
       connection.on('connected',()=>{
        console.log("Mongodb succesfully connected");
       })
       connection.on('error',(err)=>{
        console.log('problem while connecting to Mongodb :'+err);
        process.exit;
       })
    }
    catch(error){
        console.log("Something Went wrong");
        console.log(error);
    }
}