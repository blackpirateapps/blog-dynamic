import Link from "next/link";
import { query } from "@/lib/db";

type PostRow = {
  id: string;
  title: string;
  slug: string;
  content: string;
  published_at: string | null;
};

export default async function PostPage({ params }: { params: { slug: string } }) {
  const result = await query<PostRow>(
    "SELECT id, title, slug, content, published_at FROM posts WHERE slug = ? AND status = 'published' LIMIT 1",
    [params.slug]
  );
  const post = result.rows[0];

  if (!post) {
    return (
      <main>
        <p>Post not found.</p>
        <Link href="/">Back to home</Link>
      </main>
    );
  }

  return (
    <div>
      <header>
        <div>
          <strong>Signal Desk</strong>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>Field notes and deep reads.</div>
        </div>
        <nav>
          <Link href="/">Home</Link>
        </nav>
      </header>
      <main>
        <article className="card" style={{ padding: 32 }}>
          <h1>{post.title}</h1>
          <p style={{ color: "var(--muted)" }}>
            Published {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}
          </p>
          <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{post.content}</div>
        </article>
      </main>
    </div>
  );
}
