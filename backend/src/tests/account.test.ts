import mongoose from "mongoose";
import { afterAll, beforeAll, describe, it } from "vitest";
import { config } from "dotenv";
config();

describe("Account api", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL as string);
  });
  it("Connection exist", () => {});
  afterAll(async () => {
    await mongoose.disconnect();
  });
});
