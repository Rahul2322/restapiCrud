import CustomErrorHandler from "../services/CustomErrorHandler";
import {Order ,Product} from '../models'


async function updateStock(id,qty){
const product = await Product.findById(id)

product.stock = product.stock - qty;

await product.save()

}

const orderController = {
    async newOrder(req,res,next){
        const {
            shippingInfo,
            paymentInfo,
            taxPrice,
            shippingPrice,
            itemsPrice,
            totalPrice
        } = req.body

       try{
        const order = await Order.create({
            shippingInfo,
            paymentInfo,
            taxPrice,
            shippingPrice,
            itemsPrice,
            totalPrice,
            paidAt: Date.now(),
            user  = req.user._id
        });

        res.status(200).json({
            order
        })
       }catch(err){
        return next(err)
       }
    },
    //Get logged in user orders
    async myOrders(req,res,next){
       try{
        const orders = await Order.find({user:req.user._id})
        if(!orders){
            return next(CustomErrorHandler.notFound("No orders found!"))
        }
        res.status(200).json({
            orders
        })
       }catch(err){
        return next(CustomErrorHandler.serverError(err.message))
       }
    },

    //Get single user order
    async getSingleUserOrders(req,res,next){
       try{
        const orders = await Order.findById(req.params.id)
        if(!orders){
            return next(CustomErrorHandler.notFound(`No orders found with this ${req.params.id} id`))
        }

        res.status(200).json({
            orders
        })
       }catch(err){
        return next()
       }
    },

    //Get All orders(Admin)

    async getAllOrders(req,res,next){
        try{
            const orders = await Order.find()

            const totalAmount = 0;

            orders.forEach((item)=>{
                totalAmount+=item.totalPrice
            })
            res.status(200).json({
                totalAmount,
                orders
            })
        }catch(err){
            return next(CustomErrorHandler.serverError())
        }
    },

    // update order status

    async updateOrder(req,res,next){
        try{
            const order = await Order.findById(req.params.id)
        if(!order){
            return next(CustomErrorHandler.notFound(`No orders found with this ${req.params.id} id`))
        }

        if(order.status === "Delivered"){
            return next(new Error("You have already delivered this order"))
        }

      
        order.orderItems.forEach((async (item)=>{
            await updateStock(item.product,item.qty)
        }))

        order.orderStatus = req.body.status

        if(req.body.status === "Delivered"){
            order.deliveredAt = Date.now()
        }


        await order.save();

        res.status(201).json({
            success:true
        })
        }catch(err){
            return next(CustomErrorHandler.serverError())
        }



    },

    //Delete Order (Admin)

    async deleteOrder(req,res,next){
      try{
        const order = await Order.findByIdAndRemove(req.params.id)

        if(!order){
            return next(CustomErrorHandler.notFound())
        }
        res.status(200).json({
            success:true
        })
      }catch(err){
          return next(CustomErrorHandler.serverError())
      }
    },

    //Delete order By User
    async deleteOrderByUser(req,res,next){
        const order = await Order.findByIdAndRemove(req.user._id)
        if(!order){
            return next(CustomErrorHandler.notFound())
        }
        res.status(200).json({
            success:true
        })
    }
}

export default orderController