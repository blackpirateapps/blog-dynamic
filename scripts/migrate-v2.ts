import "dotenv/config";
import { db } from "../src/lib/db";
import { newId } from "../src/lib/ids";
import { slugify } from "../src/lib/slug";

const DEFAULT_CATEGORIES = ["World", "Politics", "Business", "Tech", "Science", "Sports", "Opinion"];

async function migrate() {
  console.log("Running v2 migration...");

  // 1. Create tables
  await db.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE
    );
  `);
  
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS post_tags (
      post_id TEXT NOT NULL,
      tag_id TEXT NOT NULL,
      PRIMARY KEY (post_id, tag_id),
      FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
    );
  `);

  // 2. Add category_id to posts if not exists
  try {
    // Attempt to select the column. If it fails, we add it.
    await db.execute("SELECT category_id FROM posts LIMIT 1");
    console.log("category_id column already exists.");
  } catch (e) {
    console.log("Adding category_id column to posts...");
    // SQLite limitations: Cannot add REFERENCES in ALTER TABLE usually, but we can add the column.
    // Foreign key constraints in SQLite are often deferred or not enforced on ALTER, but simple column add is fine.
    // We will just add the column as TEXT for now.
    await db.execute("ALTER TABLE posts ADD COLUMN category_id TEXT REFERENCES categories(id)");
  }

  // 3. Seed Categories
  for (const name of DEFAULT_CATEGORIES) {
    const slug = slugify(name);
    try {
      await db.execute({
        sql: "INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)",
        args: [newId(), name, slug]
      });
    } catch (e) {
      // Ignore unique constraint violations (already exists)
    }
  }

  console.log("v2 Migration complete");
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
