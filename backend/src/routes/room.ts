import { Router } from "express";
import { createRoom, getALlRooms } from "../controllers/room";
import { getUser } from "../middlewares/user";

export const roomRouter = Router();

roomRouter.post("/create", getUser, createRoom);
roomRouter.get("/getallroom", getUser, getALlRooms);
