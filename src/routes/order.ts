import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { errorHandle } from "../error-handler";
import { cancelOrder, changeStatus, createOrder, getOrderById, listAllOrders, listOrders, listUsersOrders } from "../controllers/orders";
import adminMiddleWare from "../middlewares/admin";

const orderRoutes: Router = Router()

orderRoutes.post("/", [authMiddleware], errorHandle(createOrder))
orderRoutes.get("/", [authMiddleware], errorHandle(listOrders))
orderRoutes.put("/:id/cancel", [authMiddleware], errorHandle(cancelOrder))
orderRoutes.get("/index", [authMiddleware, adminMiddleWare], errorHandle(listAllOrders));
orderRoutes.put("/:id/status", [authMiddleware, adminMiddleWare], errorHandle(changeStatus));
orderRoutes.get("/users/:id", [authMiddleware, adminMiddleWare], errorHandle(listUsersOrders));
orderRoutes.get("/:id", [authMiddleware], errorHandle(getOrderById))

export default orderRoutes