import express from 'express'
import { createOrder, getOrders, getQuotation } from '../controllers/orderController.js'

const orderRouter = express.Router()

orderRouter.post("/",createOrder)
orderRouter.post("/quotation",getQuotation)
orderRouter.get("/",getOrders)

export default orderRouter