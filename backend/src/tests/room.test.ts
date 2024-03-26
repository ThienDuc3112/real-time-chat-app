import { config } from "dotenv";
import supertest from "supertest";
import { beforeAll, describe, it } from "vitest"
import { app } from "..";
config()

const request = supertest(app);
let cookie = "";
let token = {
    token: "",
    expiredAt: 0,
};
describe("Room", async () => {
    beforeAll(async () => {
        const res = await request
            .post("/room/")
            .send({
                username: "tester",
                password: "password",
            })
            .expect(200);
        cookie = res.headers["set-cookie"];
        token = res.body;
        console.log(token);
    })
    describe("Room creation", () => {
        it("Create room", async () => {
            await request
                .post("/room/")
                .send({
                    username: "tester",
                    email: "notconflict@test.com",
                    password: "password",
                    passwordVerification: "password",
                })
                .expect(200);
        });
    })
})
