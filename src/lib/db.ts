import { createClient } from "@libsql/client";

const url = process.env.LIBSQL_URL;
const authToken = process.env.LIBSQL_AUTH_TOKEN;

if (!url) {
  throw new Error("LIBSQL_URL is not set");
}

export const db = createClient({
  url,
  authToken
});

export type DbResult<T> = {
  rows: T[];
};

export async function query<T>(sql: string, args: unknown[] = []): Promise<DbResult<T>> {
  const result = await db.execute({ sql, args });
  return { rows: result.rows as T[] };
}

export async function execute(sql: string, args: unknown[] = []): Promise<void> {
  await db.execute({ sql, args });
}
