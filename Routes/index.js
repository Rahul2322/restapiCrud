import express from 'express'
import {registerController , loginController , userController ,refreshController ,productController} from '../Controllers'
import auth from '../middlewares/auth'
import admin from '../middlewares/admin'


const router = express.Router()


//User routes
router.post('/register',registerController.register)
router.post('/login',loginController.login)
router.get('/me',auth,userController.getUserDetails)
router.post('/refresh',refreshController.refresh)
router.post('/logout',auth,loginController.logout),
router.put('/password/update',auth,userController.updatePassword)
router.get('/admin/users',[auth,admin],userController.getAllUser)
router.put('/me/update',auth,userController.updateUserProfile)
router.get('/admin/user/:id',[auth,admin],userController.getSingleUser)
router.put('/admin/user/:id',[auth,admin],userController.updateRole)
router.delete('/admin/user/:id',[auth,admin],userController.deleteUserByAdmin)
router.delete('/me/delete',auth,userController.deleteUser)


//Products routes
router.post('/products',[auth,admin],productController.store)
router.put('/products/:id',[auth,admin],productController.update)
router.delete('/products/:id',[auth,admin],productController.destroy)
router.get('/products/',productController.index)
router.get('/products/:id',productController.show)


export default router;