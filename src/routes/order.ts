import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { errorHandle } from "../error-handler";
import { cancelOrder, createOrder, getOrderById, listOrders } from "../controllers/orders";

const orderRoutes: Router = Router()

orderRoutes.post("/", [authMiddleware], errorHandle(createOrder))
orderRoutes.get("/", [authMiddleware], errorHandle(listOrders))
orderRoutes.put("/:id/cancel", [authMiddleware], errorHandle(cancelOrder))
orderRoutes.get("/:id", [authMiddleware], errorHandle(getOrderById))

export default orderRoutes