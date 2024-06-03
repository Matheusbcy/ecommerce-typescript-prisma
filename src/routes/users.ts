import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import adminMiddleWare from "../middlewares/admin";
import { errorHandle } from "../error-handler";
import {
  addAddress,
  deleteAddress,
  listAddress,
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

export default usersRoutes;