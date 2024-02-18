import { Router } from "express";
import { register } from "../controller/user";

export const userRouter = Router();

userRouter.post("/register", register);
