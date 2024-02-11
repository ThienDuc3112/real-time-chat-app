import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { config } from "dotenv";
config();

const pool = new Pool({
  connectionString: `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@localhost:${process.env.PG_PORT}/${process.env.PG_DB}?schema=public`,
});

const db = drizzle(pool);

async function main() {
  console.log("Starting migration...");
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("Migration ended");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
