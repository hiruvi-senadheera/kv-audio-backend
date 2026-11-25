import express from 'express'
import { approveOrRejectOrder, createOrder, getOrders, getQuotation } from '../controllers/orderController.js'

const orderRouter = express.Router()

orderRouter.post("/",createOrder)
orderRouter.post("/quotation",getQuotation)
orderRouter.get("/",getOrders)
orderRouter.put("/status/:orderId",approveOrRejectOrder)

export default orderRouter