import { Router } from "express";
import { deleteUser, login, register } from "../controllers/user";
import { getUser } from "../middlewares/user";

export const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.delete("/delete", getUser, deleteUser);
