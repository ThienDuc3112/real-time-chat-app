import { Router } from "express";
import { db } from "../db/client";
import { users } from "../db/schema";

export const testRouter = Router();

testRouter.get("/", async (req, res) => {
  const result = await db.select().from(users);
  // const data = await db.query.rooms.findFirst({
  //   columns:{
  //   }
  // })
  const data = await db.query.users.findFirst({
    with: {
      rooms: {
        columns: {
          roomId: false,
          userId: false,
        },
        with: {
          room: true,
        },
      },
    },
  });
  console.log(data);
  const actualData = JSON.parse(
    JSON.stringify(data, (_, v) => (typeof v === "bigint" ? v.toString() : v))
  );
  res.json(actualData);
});
