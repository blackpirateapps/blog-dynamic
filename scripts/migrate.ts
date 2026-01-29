import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { db } from "../src/lib/db";

const schemaPath = path.join(process.cwd(), "db", "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");

const statements = schema
  .split(";")
  .map((stmt) => stmt.trim())
  .filter(Boolean);

async function migrate() {
  for (const statement of statements) {
    await db.execute({ sql: statement });
  }
  console.log("Migration complete");
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
