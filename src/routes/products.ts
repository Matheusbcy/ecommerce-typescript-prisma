import { Router } from "express";
import { errorHandle } from "../error-handler";
import { createProduct, deleteProduct, getProductById, listProduct, searchProducts, updateProduct } from "../controllers/products";
import authMiddleware from "../middlewares/auth";
import adminMiddleWare from "../middlewares/admin";

const productsRoutes: Router = Router();

productsRoutes.post("/",[authMiddleware, adminMiddleWare],errorHandle(createProduct))
productsRoutes.put("/:id",[authMiddleware, adminMiddleWare],errorHandle(updateProduct))
productsRoutes.delete("/:id",[authMiddleware, adminMiddleWare],errorHandle(deleteProduct))
productsRoutes.get("/",[authMiddleware, adminMiddleWare],errorHandle(listProduct))
productsRoutes.get("/search",[authMiddleware ],errorHandle(searchProducts))
productsRoutes.get("/:id",[authMiddleware, adminMiddleWare],errorHandle(getProductById)

);

export default productsRoutes;
