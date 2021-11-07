const stripe = require("stripe")(STRIPE_SECRET_KEY);
const {STRIPE_API_KEY} = require("../config")

const paymentController = {
    async processPayment(req,res,next){
        const myPayment = await stripe.paymentIntents.create({
            amount : req.body.amount,
            currency:"inr",
            metadata:{
                company:"Stark Enterprise"
            }
        });

        res.status(200).json({
            success: true, 
            client_secret: myPayment.client_secret
        })
    },

    async sendStripeApiKey(req,res,next){
        res.status(200).json({
            stripeApiKey:STRIPE_API_KEY
        })
    }
}

export default paymentController