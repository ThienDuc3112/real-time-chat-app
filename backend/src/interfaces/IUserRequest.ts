import { Request } from "express";
import { users } from "../db/schema";

export interface IUserRequest extends Request {
  user?: typeof users.$inferSelect;
}
