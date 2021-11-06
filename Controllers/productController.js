import {Product, User} from '../models'
import multer from 'multer'
import path from 'path'
import CustomErrorHandler from '../services/CustomErrorHandler';
import fs from 'fs';
import productSchema from '../Validators/productValidator'

const storage = multer.diskStorage({
    destination:(req,file,cb)=> cb(null,'uploads/'),
    filename:(req,file,cb)=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName)
    }
});


const handleMultipartData  = multer({storage,limits:{fileSize:1000000*5}}).single('image') //5mb
const productController = {
    async store(req,res,next){

        //multipart-form data

     handleMultipartData(req,res,async(err)=>{
            if(err){
                return next(CustomErrorHandler.serverError(err.message))
            }
            console.log(req.file)
            const filePath = req.file.path

            // Validation
          
      
        const { error } = productSchema.validate(req.body);
        if (error) {
            //delete the uploaded file
            fs.unlink(`${appRoot}/${filePath}`,(err)=>{
                //second argument is callback so if error then that err will be for err in deleting
                if(err){
                    return next(CustomErrorHandler.serverError(err.message))

                }
                
            })

            return next(error)
            //rootfolder/uploads/filename.png

        }

        const {name , price , qty} = req.body;

        let document;
        try{

            document = await Product.create({
                name,
                price,
                qty,
                image : filePath
            })

        }catch(err){
            return next(err)

        }

        res.status(201).json(document)

        })

    },
    async update(req,res,next){
          //multipart-form data

     handleMultipartData(req,res,async(err)=>{
        if(err){
            return next(CustomErrorHandler.serverError(err.message))
        }
        // console.log(req.file)
        let filePath;
        if(req.file){
            filePath = req.file.path

        }
        

        // Validation

    const { error } = productSchema.validate(req.body);
    if (error) {
        //delete the uploaded file
        if(req.file){
            fs.unlink(`${appRoot}/${filePath}`,(err)=>{
                if(err){
                    return next(CustomErrorHandler.serverError(err.message))
    
                }
                
            })

        }
       

        return next(error)
        //rootfolder/uploads/filename.png
        console.log(appRoot)
    }

    const {name , price , qty} = req.body;

    let document;
    try{

        document = await Product.findOneAndUpdate({_id:req.params.id},{
            name,
            price,
            qty,
           ...(req.file && { image : filePath})
        },{new:true});
 
        console.log(document)

    }catch(err){
        return next(err)

    }

    res.status(201).json(document)

    })


    },

    async destroy(req,res,next){
        const document = await Product.findOneAndRemove({_id:req.params.id})
        if(!document){
            return next(new Error('Nothing to delete'))
        }

        //image delete

        const imagePath = document._doc.image;
        //if _doc is not used we will get this path bcoz of getters on image
        //http://localhost:5000/uploads\1623157618589-245567251.JPG

        //appRoot/http://localhost:5000/uploads\1623157618589-245567251.JPG this path then it will be wrong
        fs.unlink(`${appRoot}/${imagePath}`,(err)=>{
            if(err){
                return next(CustomErrorHandler.serverError())
            }
            res.json(document)
        })

       
    },

    async index(req,res,next){
          const resultPerPage = 10;
          const currentpage = req.query.page || 1;
          const skip = resultPerPage*(currentpage-1)
        let document;
        try{
            document = await Product.find().select('-updatedAt -__v').limit(resultPerPage).skip(skip).sort({_id:-1})
        }catch(err){
            return next(CustomErrorHandler.serverError())
        }
        res.json(document)

    },

    async show(req,res,next){
        let document;
        try{
            document =  await Product.findOne({_id:req.params.id}).select('-updatedAt -__v')

        }catch(err){
            return next(CustomErrorHandler.serverError())
        }
        res.json(document)
    }
}

export default productController