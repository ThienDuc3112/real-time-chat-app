import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { rooms, messages, users, roomToMember } from "./schema";
import { config } from "dotenv";
import { faker } from "@faker-js/faker"
import { eq } from "drizzle-orm";

config()

const main = async () => {
    const client = new Pool({ connectionString: `${process.env.PG_URL}` })
    const db = drizzle(client);
    const data: (typeof rooms.$inferInsert)[] = []
    for (let i = 0; i < 10; i++) {
        data.push({
            name: faker.word.noun(),
        })
    }
    const testUser = (await db.select().from(users).where(eq(users.username, "admin")))[0]
    if (!testUser) throw new Error("No admin user found");
    console.log("Seeding start")
    data.forEach(async roomData => {
        const room = (await db.insert(rooms).values({ name: roomData.name }).returning())[0]
        if (!room) return;
        await db.insert(roomToMember).values({ roomId: room.id, userId: testUser.id })
        for (let i = 0; i < 5; i++) {
            await db.insert(messages).values({ content: faker.lorem.sentence(), userId: testUser.id, roomId: room.id });
        }
    })
    console.log("Seeding complete")
}

main()
