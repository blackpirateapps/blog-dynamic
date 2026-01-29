import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { createPost, deletePost, listPosts } from "@/lib/queries";
import { newId } from "@/lib/ids";
import { slugify } from "@/lib/slug";

async function createPostAction(formData: FormData) {
  "use server";
  const session = requireSession();
  const title = String(formData.get("title") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const status = String(formData.get("status") || "draft") as "draft" | "published";

  if (!title || !content) {
    return;
  }

  const slug = slugify(title);
  const publishedAt = status === "published" ? new Date().toISOString() : null;

  await createPost({
    id: newId(),
    title,
    slug,
    excerpt: excerpt || null,
    content,
    status,
    authorId: session.userId,
    publishedAt
  });

  revalidatePath("/dashboard/posts");
}

async function deletePostAction(formData: FormData) {
  "use server";
  requireSession();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await deletePost(id);
  revalidatePath("/dashboard/posts");
}

export default async function PostsPage() {
  requireSession();
  const posts = await listPosts();

  return (
    <div>
      <h1>Posts</h1>
      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Create new post</h3>
        <form action={createPostAction}>
          <label htmlFor="title">Title</label>
          <input id="title" name="title" required />
          <label htmlFor="excerpt">Excerpt</label>
          <input id="excerpt" name="excerpt" />
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" rows={8} required />
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue="draft">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button className="button" type="submit">Save</button>
        </form>
      </div>
      <div className="card">
        <h3>All posts</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.status}</td>
                <td>{new Date(post.updated_at).toLocaleDateString()}</td>
                <td>
                  <form action={deletePostAction}>
                    <input type="hidden" name="id" value={post.id} />
                    <button className="button ghost" type="submit">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
