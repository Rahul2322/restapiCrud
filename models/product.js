import mongoose from 'mongoose'
import { APP_URL } from '../config'

const Schema =mongoose.Schema

const productSchema = new Schema({
    name :{type:String ,required:true },
    price :{type:Number , required:true},
    qty :{type:Number , required:true  },
    stock:{
        type:Number,

    },
    image :{type:String , required:true ,get:(image)=>{
        //http://localhost:5000/uploads\1623157618589-245567251.JPG
        return `${APP_URL}/${image}`;
            
}},
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
}
},{timestamps:true ,toJSON:{getters:true},id:false})

export default mongoose.model('Product',productSchema,'products')

