import { describe, it } from "vitest";
import { config } from "dotenv";
import supertest from "supertest";
import { app } from "..";
config();

describe("Account api", () => {
  it("Verify input", () => {
    supertest(app)
      .post("/user/register")
      .expect(404, (err, res) => {
        console.error(err);
      });
  });
});
