import { query, execute, db } from "@/lib/db";
import { Role } from "@/lib/auth";
import { newId } from "@/lib/ids";
import { slugify } from "@/lib/slug";

export type UserRow = {
  id: string;
  email: string;
  name: string;
  role: Role;
  password_hash: string;
  created_at: string;
};

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
};

export type TagRow = {
  id: string;
  name: string;
  slug: string;
};

export type PostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: "draft" | "published";
  author_id: string;
  category_id: string | null;
  category_name?: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  tags?: TagRow[];
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

export async function listCategories() {
  const result = await query<CategoryRow>("SELECT * FROM categories ORDER BY name ASC");
  return result.rows;
}

export async function listPosts() {
  const result = await query<PostRow>(
    `SELECT p.*, c.name as category_name 
     FROM posts p 
     LEFT JOIN categories c ON p.category_id = c.id 
     ORDER BY p.created_at DESC`
  );
  return result.rows;
}

export async function getPostBySlug(slug: string) {
  const result = await query<PostRow>(
    `SELECT p.*, c.name as category_name 
     FROM posts p 
     LEFT JOIN categories c ON p.category_id = c.id 
     WHERE p.slug = ? AND p.status = 'published' LIMIT 1`,
    [slug]
  );
  const post = result.rows[0] ?? null;
  if (post) {
    const tagsResult = await query<TagRow>(
      `SELECT t.* FROM tags t 
       JOIN post_tags pt ON t.id = pt.tag_id 
       WHERE pt.post_id = ?`,
      [post.id]
    );
    post.tags = tagsResult.rows;
  }
  return post;
}

export async function getPostById(id: string) {
  const result = await query<PostRow>("SELECT * FROM posts WHERE id = ? LIMIT 1", [id]);
  const post = result.rows[0] ?? null;
  if (post) {
    const tagsResult = await query<TagRow>(
      `SELECT t.* FROM tags t 
       JOIN post_tags pt ON t.id = pt.tag_id 
       WHERE pt.post_id = ?`,
      [post.id]
    );
    post.tags = tagsResult.rows;
  }
  return post;
}

async function getOrCreateTag(name: string): Promise<string> {
  const slug = slugify(name);
  const existing = await query<TagRow>("SELECT id FROM tags WHERE slug = ?", [slug]);
  if (existing.rows.length > 0) {
    return existing.rows[0].id;
  }
  const id = newId();
  await execute("INSERT INTO tags (id, name, slug) VALUES (?, ?, ?)", [id, name, slug]);
  return id;
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
  categoryId: string | null;
  tags: string[]; // List of tag names
}) {
  await execute(
    "INSERT INTO posts (id, title, slug, excerpt, content, status, author_id, published_at, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      input.id,
      input.title,
      input.slug,
      input.excerpt,
      input.content,
      input.status,
      input.authorId,
      input.publishedAt,
      input.categoryId
    ]
  );

  for (const tagName of input.tags) {
    if (!tagName.trim()) continue;
    const tagId = await getOrCreateTag(tagName.trim());
    await execute("INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)", [input.id, tagId]);
  }
}

export async function updatePost(input: {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: "draft" | "published";
  publishedAt: string | null;
  categoryId: string | null;
  tags: string[];
}) {
  await execute(
    "UPDATE posts SET title = ?, slug = ?, excerpt = ?, content = ?, status = ?, published_at = ?, category_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [
      input.title,
      input.slug,
      input.excerpt,
      input.content,
      input.status,
      input.publishedAt,
      input.categoryId,
      input.id
    ]
  );

  // Update tags: simplest way is delete all and re-add
  await execute("DELETE FROM post_tags WHERE post_id = ?", [input.id]);

  for (const tagName of input.tags) {
    if (!tagName.trim()) continue;
    const tagId = await getOrCreateTag(tagName.trim());
    await execute("INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)", [input.id, tagId]);
  }
}

export async function deletePost(id: string) {
  await execute("DELETE FROM posts WHERE id = ?", [id]);
}
