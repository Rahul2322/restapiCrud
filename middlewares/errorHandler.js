import { ValidationError } from 'joi';
import {DEBUG_MODE} from '../config';
import CustomErrorHandler from '../services/CustomErrorHandler'
const errorHandler =(err,req,res,next)=>{
    let statusCode = 500;
    let data = {
        message:'Internal server error',
        //this spread conditional means if true add property originalerror in data Obj but if Debug-false dont add property originalerror
        ...(DEBUG_MODE === 'true' && {originalError:err.message})
    }
    //in .envfile  value is in string so true must be written in string

    if(err instanceof ValidationError){
        statusCode =422;
        data = {message:err.message}
    }

    if(err instanceof CustomErrorHandler){
        statusCode = err.status;
        data ={
            message : err.message
        }
    }

    return res.status(statusCode).json(data)



}

export default errorHandler