import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "..";

describe("Exist", () => {
  it("Server is up", async () => {
    const res = await request(app).get("/up");
    expect(res.status).toBe(200);
  });
});
