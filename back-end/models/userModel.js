import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
  name:{type:String,required:true},
  email:{type:String,unique:true,required:true},
  gender:{type:String,required:true},
  mobile:{type:Number,required:true},
  password:{type:String,required:true},
  imageUrl: {type:String,required:true},
  isAdmin:{type:Boolean,default:false}
})


export default mongoose.model("User",userSchema);