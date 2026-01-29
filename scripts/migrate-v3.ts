import "dotenv/config";
import { db } from "../src/lib/db";

async function migrate() {
  console.log("Running v3 migration...");

  await db.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  console.log("v3 Migration complete");
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
