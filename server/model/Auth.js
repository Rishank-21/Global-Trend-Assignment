import mongoose from 'mongoose';

const authSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minlength:3
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6
    }
},{timestamps:true});

const Auth = mongoose.model('Auth', authSchema);
export default Auth;