import { beforeAll, describe, it, expect } from "vitest";
import { config } from "dotenv";
import supertest from "supertest";
import { app } from "..";
config();
const request = supertest(app);
let cookie = "";
let token = {
  token: "",
  expiredAt: 0,
};
describe("Handle user routes", () => {
  beforeAll(async () => {
    await request.post("/user/register").send({
      username: "conflict",
      email: "conflictuser@test.com",
      password: "password",
      passwordVerification: "password",
    });
  });
  it("Handle bad inputs", async () => {
    await request.post("/user/register").expect(400);
    await request
      .post("/user/register")
      .send({
        username: "sh",
        email: "test@",
        password: "asdfa",
        passwordVerification: "fadsf",
      })
      .expect(400);
    await request
      .post("/user/register")
      .send({
        username: "conflict",
        email: "conflictuser@test.com",
        password: "password",
        passwordVerification: "password",
      })
      .expect(409);
  });
  it("Create user", async () => {
    await request
      .post("/user/register")
      .send({
        username: "tester",
        email: "notconflict@test.com",
        password: "password",
        passwordVerification: "password",
      })
      .expect(200);
  });
});

describe("User login", () => {
  it("Login", async () => {
    const res = await request
      .post("/user/login")
      .send({
        username: "tester",
        password: "password",
      })
      .expect(200);
    cookie = res.headers["set-cookie"];
    token = res.body;
    console.log(token);
  });
  it("Reject bad login attempt", async () => {
    await request
      .post("/user/login")
      .send({
        username: "tester",
      })
      .expect(400);
    await request
      .post("/user/login")
      .send({
        password: "password",
      })
      .expect(400);
    await request
      .post("/user/login")
      .send({
        username: "dontexist",
        password: "asdfasdf",
      })
      .expect(404);
    await request
      .post("/user/login")
      .send({
        username: "conflict",
        password: "incorrect",
      })
      .expect(401);
  });
});

describe("User deletion", () => {
  it("Handle bad delete attempt", async () => {
    await request
      .delete("/user/delete")
      .send({ password: "password" })
      .expect(401);
    await request
      .delete("/user/delete")
      .set("Authorization", `Bearer ${token.token}`)
      .send({ password: "incorect" })
      .expect(401);
  });
  it("Delete user", async () => {
    const res = await request
      .delete("/user/delete")
      .set("Authorization", `Bearer ${token.token}`)
      .send({
        password: "password",
      })
      .expect(200);
  });
});

describe("Refresh token", () => {
  it("Refresh access token", async () => {
    const res = await request
      .get("/user/refresh")
      .set("Cookie", cookie)
      .send()
      .expect(200);
    expect(typeof res.body?.token).toBe("string");
  });
});
