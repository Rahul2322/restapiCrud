import { User } from "../../models"
import CustomErrorHandler from "../../services/CustomErrorHandler"
import Joi from 'joi'

const userController = {

    //Get User Details
    async getUserDetails(req,res,next){

        try{
            const user =await User.findOne({_id:req.user._id}).select('-password -updatedAt -__v')

            if(!user){
                return next(CustomErrorHandler.notFound())
            }

            res.json(user)

        }catch(err){
            return next(err)
        }
        
    },
     //Update User password
     async updatePassword (req,res,next){

        try{
          const user = await User.findById(req.user._id)
  
          const oldPasswordValidation = Joi.object({
              oldPassword = Joi.string().required()
          })
  
          const {error} = oldPasswordValidation.validate(req.body)
  
          if(error){
              return next(error)
          }
  
          const isPasswordMatched = await bcrypt.compare(req.body.oldPassword,user.password)
  
          if(!isPasswordMatched){
              return next(CustomErrorHandler("old password is incorrect "))
          }
  
          if( req.body.newPassword !== req.body.confirmPassword ){
              return next( CustomErrorHandler("Password does not match"))
          }
  
          user.password = req.body.newPassword
  
          await user.save()
  
          const access_token = JwtService.sign({ _id: user._id, role: user.role });
  
          res.status(200).json({access_token,user})
        }catch(err){
            return next(err)
        }
      },

    
      //Update User Profile

      async updateUserProfile(req,res,next){
          const {name,email}  = req.body

          const userValidate = Joi.object({
              name:Joi.string(),
              email:Joi.email()
          })

          const {error} = userValidate.validate(req.body)
          if(error){
              return next(error)
          }
          if(!name && !email) return;

         try{
              const user = await User.findByIdAndUpdate(req.user._id,{name,email},{new:true})

              res.status(200).json({
                  user,
                  success:true
              })
         }catch(err){
             return next(err)
         }
      },

      //Get All User(Admin)

      async getAllUser(req,res,next){
          try
          {
            const users = await User.find()
            res.status(200).json({
                users,
                success:true
            })

          }catch(err){
                return next (err)
          }
      },

      //Get single user details(Admin)

      async getSingleUser(req,res,next){
          try{
            const user = await User.findById(req.params.id)

            if(!user){
                return next(CustomErrorHandler.notFound())
            }
            res.status(200).json({
                success:true,
                user
            })
          }catch(err){
                return next(err)
          }
      },

      //Delete user(Admin)

      async deleteUserByAdmin(req,res,next){
          try{
              const user = await User.findByIdAndDelete(req.params.id)

              if(!user){
                  return next(new Error('Nothing to delete'))
              }

              res.status(200).json({
                  success:true
              })

          }catch(err){
                return next(err)
          }
      },

      //Delete User

      async deleteUser(req,res,next){
          try{
            const user = await User.findByIdAndRemove(req.user._id)
            res.status(200).json({
                success:true
            })
          }catch(err){
              return next(err)
          }
      },

      //Update role

      async updateRole(req,res,next){
          const {name,email,role}  = req.body

          const userValidate = Joi.object({
              name:Joi.string(),
              email:Joi.string().email(),
              role:Joi.string()
          })

          const {error} = userValidate.validate(req.body)
          if(error){
              return next(error)
          }
          try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                name,
                email,
                role
            },{new:true})
            if(!user){
                return next(CustomErrorHandler.notFound())
            }

           res.status(200).json({
               success:true,
               user
           })
          }catch(err){
              return next(err)
          }
      }
}

export default userController