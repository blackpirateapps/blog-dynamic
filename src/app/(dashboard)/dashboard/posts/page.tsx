import Link from "next/link";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { listPosts, deletePost } from "@/lib/queries";

async function deletePostAction(formData: FormData) {
  "use server";
  await requireSession();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await deletePost(id);
  revalidatePath("/dashboard/posts");
}

export default async function PostsPage() {
  await requireSession();
  const posts = await listPosts();

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ margin: "0 20px 0 0", fontSize: 23, fontWeight: 400 }}>Posts</h1>
        <Link href="/dashboard/posts/new" className="wp-button">Add New</Link>
      </div>
      
      <div className="wp-card" style={{ padding: 0 }}>
        <table className="wp-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <strong style={{ display: "block", fontSize: 14, marginBottom: 4 }}>
                    <Link href={`/dashboard/posts/${post.id}`} style={{ color: "#0073aa", textDecoration: "none" }}>{post.title}</Link>
                  </strong>
                  <div style={{ fontSize: 12 }}>
                    <Link href={`/dashboard/posts/${post.id}`} style={{ color: "#0073aa" }}>Edit</Link>
                    <span style={{ color: "#ddd", margin: "0 5px" }}>|</span>
                    <form action={deletePostAction} style={{ display: "inline" }}>
                      <input type="hidden" name="id" value={post.id} />
                      <button type="submit" style={{ background: "none", border: "none", padding: 0, color: "#a00", cursor: "pointer", fontSize: 12 }}>Trash</button>
                    </form>
                    <span style={{ color: "#ddd", margin: "0 5px" }}>|</span>
                     <Link href={`/${post.slug}`} target="_blank" style={{ color: "#0073aa" }}>View</Link>
                  </div>
                </td>
                <td>{post.category_name || "—"}</td>
                <td>{post.status}</td>
                <td>
                  {post.status === 'published' ? 'Published' : 'Last Modified'}<br />
                  <span style={{ color: "#50575e" }}>{new Date(post.updated_at).toLocaleDateString()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}