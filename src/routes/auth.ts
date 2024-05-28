import { Router } from "express";
import { login, me, signup } from "../controllers/auth";
import { errorHandle } from "../error-handler";
import authMiddleware from "../middlewares/auth";

const authRoutes: Router = Router();

authRoutes.post("/signup", errorHandle(signup));
authRoutes.post("/login", errorHandle(login));
authRoutes.get("/me", authMiddleware, errorHandle(me));

export default authRoutes;
