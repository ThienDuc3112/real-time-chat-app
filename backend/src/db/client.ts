import { Client } from "pg";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schemas from "./schema";
config();

const client = new Client({ connectionString: process.env.PG_URL });
client.connect();
export const db = drizzle(client, {
  schema: schemas,
});
