import Order from "../models/order.js";
import Product from "../models/product.js";
import stripe from "stripe";

import Razorpay from "razorpay";


const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });



//place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address} = req.body;
        if (!address || items.length === 0) {
            return res.json({success: false, message: "invalid data"})
        }
        // res.json({success: true, message: "product added"})

        // calculate Amount using Items
        let amount = await items.reduce(async (acc, item ) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)

        //add tax (2%)

        amount += Math.floor(amount* 0.02)
        
        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });
        
        return res.json({success: true, message: "order placed successfully"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }   
}

//place Order STRIPE : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address} = req.body;

        const {origin} = req.headers;

        if (!address || items.length === 0) {
            return res.json({success: false, message: "invalid data"})
        }
        
  

        // calculate Amount using Items
                let amount = 0;
        const productData = [];

        for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) throw new Error("Invalid product in cart.");

        productData.push({
            name: product.name,
            price: product.offerPrice,
            quantity: item.quantity,
        });

        amount += product.offerPrice * item.quantity;
        }

        amount += Math.floor(amount * 0.02); // Add 2% tax

                
        const newOrder = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
        }); 
       
        //razerpay
        const options = {
            amount: amount * 100,
            currency: "INR"
        }

        const order = await instance.orders.create(options);

        console.log("Razorpay order:", order);

        if (!order || !order.id) {
        return res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
        }

        return res.status(200).json({ success: true, order: {
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            status: order.status || "created", // <-- set default fallback
          } });

        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }   
}

export const getKey = async (req, res)=>{
    res.status(200).json({key: process.env.RAZORPAY_API_KEY})
}


//get order by user id : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        // const { userId } = req.body;
        const userId = req.userId;
        const orders = await Order.find({
            userId,
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1})
        res.json({success: true, orders})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }   
}

//get All orders (for seller / admin ) : /api/order/seller

export const getAllOrders = async (req, res) => {
    try {
    
        const orders = await Order.find({
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1})
        res.json({success: true, orders})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }   
}