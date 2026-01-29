import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { updatePost, listCategories, getPostById } from "@/lib/queries";
import { slugify } from "@/lib/slug";
import PostForm from "@/components/PostForm";

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
      <PostForm 
        action={updatePostAction} 
        categories={categories}
        initialData={{
          id: post.id,
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          status: post.status,
          category_id: post.category_id,
          tags: tagsString
        }}
      />
    </div>
  );
}
