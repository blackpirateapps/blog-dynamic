import Link from "next/link";
import { query } from "@/lib/db";
import { notFound } from "next/navigation";

type PostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  published_at: string | null;
};

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  // In Next.js 15+ params is a Promise
  const { slug } = await params;
  
  const result = await query<PostRow>(
    "SELECT id, title, slug, excerpt, content, published_at FROM posts WHERE slug = ? AND status = 'published' LIMIT 1",
    [slug]
  );
  const post = result.rows[0];

  if (!post) {
    notFound();
  }

  return (
    <div>
      <header>
        <div className="header-inner">
          <Link href="/" className="brand">Signal Desk.</Link>
          <nav>
            <Link href="/" className="nav-link">Home</Link>
          </nav>
        </div>
      </header>
      <main>
        <article style={{ maxWidth: "700px", margin: "0 auto" }}>
          <header style={{ marginBottom: "40px", textAlign: "center" }}>
             <span className="meta" style={{ justifyContent: "center", display: "flex" }}>
                {post.published_at ? new Date(post.published_at).toLocaleDateString(undefined, {
                  year: 'numeric', month: 'long', day: 'numeric'
                }) : ""}
              </span>
            <h1 style={{ fontSize: "2.5rem", lineHeight: "1.2", marginBottom: "16px" }}>{post.title}</h1>
            {post.excerpt && <p style={{ fontSize: "1.2rem", color: "var(--muted)", lineHeight: "1.5" }}>{post.excerpt}</p>}
          </header>
          <div style={{ fontSize: "1.125rem", lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
            {post.content}
          </div>
        </article>
      </main>
      <div className="footer">
        &copy; {new Date().getFullYear()} Signal Desk News. All rights reserved.
      </div>
    </div>
  );
}