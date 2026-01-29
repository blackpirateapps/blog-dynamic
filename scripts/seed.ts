import "dotenv/config";
import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";
import { newId } from "../src/lib/ids";

async function seed() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
  }

  const existing = await db.execute({
    sql: "SELECT id FROM users WHERE email = ? LIMIT 1",
    args: [email]
  });

  if (existing.rows.length > 0) {
    console.log("Admin user already exists, updating credentials...");
    const passwordHash = await hashPassword(password);
    await db.execute({
      sql: "UPDATE users SET name = ?, password_hash = ? WHERE email = ?",
      args: [name, passwordHash, email]
    });
    console.log("Admin user updated");
    return;
  }

  const passwordHash = await hashPassword(password);

  await db.execute({
    sql: "INSERT INTO users (id, email, name, role, password_hash) VALUES (?, ?, ?, 'admin', ?)",
    args: [newId(), email, name, passwordHash]
  });

  console.log("Admin user created");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
