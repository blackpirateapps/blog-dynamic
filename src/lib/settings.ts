import { query, execute } from "@/lib/db";

export async function getSetting(key: string, defaultValue: string = ""): Promise<string> {
  const result = await query<{ value: string }>("SELECT value FROM settings WHERE key = ? LIMIT 1", [key]);
  return result.rows[0]?.value ?? defaultValue;
}

export async function setSetting(key: string, value: string): Promise<void> {
  // SQLite UPSERT syntax
  await execute(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    [key, value]
  );
}
