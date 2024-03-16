import { Router } from "express";
import { createRoom, getAllRooms, getRoomMessages, join } from "../controllers/room";
import { getUser } from "../middlewares/user";

export const roomRouter = Router();

roomRouter.post("/create", getUser, createRoom);
roomRouter.get("/getallroom", getUser, getAllRooms);
roomRouter.get("/getroommessageswithusername/:roomId", getUser, getRoomMessages);
roomRouter.get("/getroommessages/:roomId", getUser, getRoomMessages);
roomRouter.get("/join/:id", getUser, join)
