import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { createPost, listCategories } from "@/lib/queries";
import { newId } from "@/lib/ids";
import { slugify } from "@/lib/slug";
import PostForm from "@/components/PostForm";

async function createPostAction(formData: FormData) {
  "use server";
  const session = await requireSession();
  const title = String(formData.get("title") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const status = String(formData.get("status") || "draft") as "draft" | "published";
  const categoryId = String(formData.get("category_id") || "");
  const tagsString = String(formData.get("tags") || "");

  if (!title || !content) {
    return;
  }

  const slug = slugify(title);
  const publishedAt = status === "published" ? new Date().toISOString() : null;
  const tags = tagsString.split(",").map(t => t.trim()).filter(Boolean);

  const id = newId();

  await createPost({
    id,
    title,
    slug,
    excerpt: excerpt || null,
    content,
    status,
    authorId: session.userId,
    publishedAt,
    categoryId: categoryId || null,
    tags
  });

  revalidatePath("/dashboard/posts");
  redirect("/dashboard/posts");
}

export default async function NewPostPage() {
  await requireSession();
  const categories = await listCategories();

  return (
    <div>
      <h1 style={{ marginBottom: 20, fontSize: 23, fontWeight: 400 }}>Add New Post</h1>
      <PostForm action={createPostAction} categories={categories} />
    </div>
  );
}
