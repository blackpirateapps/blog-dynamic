import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { updatePost, listCategories, getPostById } from "@/lib/queries";
import { slugify } from "@/lib/slug";
import SubmitButton from "@/components/SubmitButton";

async function updatePostAction(formData: FormData) {
  "use server";
  await requireSession();
  const id = String(formData.get("id"));
  const title = String(formData.get("title") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const status = String(formData.get("status") || "draft") as "draft" | "published";
  const categoryId = String(formData.get("category_id") || "");
  const tagsString = String(formData.get("tags") || "");

  if (!id || !title || !content) {
    return;
  }

  const slug = slugify(title);
  const publishedAt = status === "published" ? new Date().toISOString() : null;
  const tags = tagsString.split(",").map(t => t.trim()).filter(Boolean);

  await updatePost({
    id,
    title,
    slug,
    excerpt: excerpt || null,
    content,
    status,
    publishedAt,
    categoryId: categoryId || null,
    tags
  });

  revalidatePath("/dashboard/posts");
  redirect("/dashboard/posts");
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireSession();
  const { id } = await params;
  const post = await getPostById(id);
  
  if (!post) {
    notFound();
  }

  const categories = await listCategories();
  const tagsString = post.tags ? post.tags.map(t => t.name).join(", ") : "";

  return (
    <div>
      <h1 style={{ marginBottom: 20, fontSize: 23, fontWeight: 400 }}>Edit Post</h1>
      <form action={updatePostAction}>
        <input type="hidden" name="id" value={post.id} />
        <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 20 }}>
          <div className="wp-card">
            <input name="title" className="wp-input" defaultValue={post.title} placeholder="Enter title here" style={{ fontSize: 20, padding: "10px" }} required />
            <textarea name="content" className="wp-textarea" defaultValue={post.content} rows={15} placeholder="Start writing..." style={{ fontSize: 16 }} required />
            
            <label className="wp-label">Excerpt</label>
            <textarea name="excerpt" className="wp-textarea" defaultValue={post.excerpt || ""} rows={3} />
          </div>

          <div>
            <div className="wp-card">
              <h3 style={{ margin: "0 0 10px 0", fontSize: 14 }}>Publish</h3>
              <div style={{ marginBottom: 10 }}>
                <label className="wp-label">Status</label>
                <select name="status" className="wp-select" defaultValue={post.status}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div style={{ textAlign: "right" }}>
                <SubmitButton label="Update" />
              </div>
            </div>

            <div className="wp-card">
              <h3 style={{ margin: "0 0 10px 0", fontSize: 14 }}>Categories</h3>
              <select name="category_id" className="wp-select" defaultValue={post.category_id || ""}>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="wp-card">
              <h3 style={{ margin: "0 0 10px 0", fontSize: 14 }}>Tags</h3>
              <input name="tags" className="wp-input" defaultValue={tagsString} placeholder="Separate with commas" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
