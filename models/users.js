import mongoose from 'mongoose'

const Schema =mongoose.Schema

const userSchema = new Schema({
    name :{type:String },
    email :{type:String , unique:true},
    password :{type:String  },
    role :{type:String , default:'Customer'},
},{timestamps:true})

export default mongoose.model('User',userSchema,'users')


//I removed the required:true from schema because it was giving validation error