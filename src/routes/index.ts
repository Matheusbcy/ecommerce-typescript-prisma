import { Router } from "express";
import authRoutes from "./auth";
import productsRoutes from "./products";
import usersRoutes from "./users";
import cartRoutes from "./cart";
import orderRoutes from "./order";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/products", productsRoutes);
rootRouter.use("/users", usersRoutes);
rootRouter.use("/carts", cartRoutes);
rootRouter.use("/orders", orderRoutes);

export default rootRouter;

/*
    1. user management
        a. list users
        b. get use by id
        c. change user role
    2. order management
        a. list all orders (filter on status)
        b. chanage order status
    3. products
        a. search api for products (for both users and admins) => full text search
*/