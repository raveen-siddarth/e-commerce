import express from "express"
import authUser from "../middleware/authUser.js"
import { getAllOrders, getKey, getUserOrders, placeOrderCOD, placeOrderStripe } from "../controllers/orderController.js";
import authSeller from "../middleware/authSeller.js"

const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD)
orderRouter.get('/user', authUser, getUserOrders)
orderRouter.get('/seller', authSeller, getAllOrders)
orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.get('/getKey', getKey)

export default orderRouter