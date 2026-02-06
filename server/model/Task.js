import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        minlength:3
    },
    description:{
        type:String,
        required:true,
        minlength:5
    },
    status:{
        type:String,
        enum:["pending", "in progress", "completed"],
        default:"pending"
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required:true
    }
},{timestamps:true});   

const Task = mongoose.model('Task', taskSchema);
export default Task;