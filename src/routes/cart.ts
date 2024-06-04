import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import adminMiddleWare from "../middlewares/admin";
import { addItemToCart, changeQuantity, deleteItemFromCart, getCart } from "../controllers/cart";
import { errorHandle } from "../error-handler";

const cartRoutes: Router = Router()

cartRoutes.post("/",[authMiddleware, adminMiddleWare],errorHandle(addItemToCart))
cartRoutes.get("/",[authMiddleware, adminMiddleWare],errorHandle(getCart))
cartRoutes.delete("/:id",[authMiddleware, adminMiddleWare],errorHandle(deleteItemFromCart))
cartRoutes.put("/:id",[authMiddleware, adminMiddleWare],errorHandle(changeQuantity))

export default cartRoutes