import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import adminMiddleWare from "../middlewares/admin";
import { errorHandle } from "../error-handler";
import {
  addAddress,
  changeUserRole,
  deleteAddress,
  getUserById,
  listAddress,
  listUsers,
  updateUsers,
} from "../controllers/users";

const usersRoutes: Router = Router();

usersRoutes.post("/address", [authMiddleware], errorHandle(addAddress));
usersRoutes.delete(
  "/address/:id",
  [authMiddleware],
  errorHandle(deleteAddress)
);
usersRoutes.get("/address", [authMiddleware], errorHandle(listAddress));
usersRoutes.put("/", [authMiddleware], errorHandle(updateUsers));

usersRoutes.put("/:id/role", [authMiddleware, adminMiddleWare], errorHandle(changeUserRole));
usersRoutes.get("/", [authMiddleware, adminMiddleWare], errorHandle(listUsers));
usersRoutes.get("/:id", [authMiddleware, adminMiddleWare], errorHandle(getUserById));


export default usersRoutes;