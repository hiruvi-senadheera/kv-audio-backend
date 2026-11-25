import express from 'express'
import { createOrder, getQuotation } from '../controllers/orderController.js'

const orderRouter = express.Router()

orderRouter.post("/",createOrder)
orderRouter.get("/quotation",getQuotation)

export default orderRouter