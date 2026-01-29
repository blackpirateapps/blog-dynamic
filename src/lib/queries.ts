import { query, execute } from "@/lib/db";
import { Role } from "@/lib/auth";

export type UserRow = {
  id: string;
  email: string;
  name: string;
  role: Role;
  password_hash: string;
  created_at: string;
};

export type PostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: "draft" | "published";
  author_id: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export async function getUserByEmail(email: string) {
  const result = await query<UserRow>(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return result.rows[0] ?? null;
}

export async function getUserById(id: string) {
  const result = await query<UserRow>("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);
  return result.rows[0] ?? null;
}

export async function listUsers() {
  const result = await query<UserRow>(
    "SELECT id, email, name, role, password_hash, created_at FROM users ORDER BY created_at DESC"
  );
  return result.rows;
}

export async function createUser(input: {
  id: string;
  email: string;
  name: string;
  role: Role;
  passwordHash: string;
}) {
  await execute(
    "INSERT INTO users (id, email, name, role, password_hash) VALUES (?, ?, ?, ?, ?)",
    [input.id, input.email, input.name, input.role, input.passwordHash]
  );
}

export async function deleteUser(id: string) {
  await execute("DELETE FROM users WHERE id = ?", [id]);
}

export async function listPosts() {
  const result = await query<PostRow>(
    "SELECT * FROM posts ORDER BY created_at DESC"
  );
  return result.rows;
}

export async function getPostById(id: string) {
  const result = await query<PostRow>("SELECT * FROM posts WHERE id = ? LIMIT 1", [id]);
  return result.rows[0] ?? null;
}

export async function createPost(input: {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: "draft" | "published";
  authorId: string;
  publishedAt: string | null;
}) {
  await execute(
    "INSERT INTO posts (id, title, slug, excerpt, content, status, author_id, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      input.id,
      input.title,
      input.slug,
      input.excerpt,
      input.content,
      input.status,
      input.authorId,
      input.publishedAt
    ]
  );
}

export async function updatePost(input: {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: "draft" | "published";
  publishedAt: string | null;
}) {
  await execute(
    "UPDATE posts SET title = ?, slug = ?, excerpt = ?, content = ?, status = ?, published_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [
      input.title,
      input.slug,
      input.excerpt,
      input.content,
      input.status,
      input.publishedAt,
      input.id
    ]
  );
}

export async function deletePost(id: string) {
  await execute("DELETE FROM posts WHERE id = ?", [id]);
}
