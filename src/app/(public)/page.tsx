import Link from "next/link";
import { query } from "@/lib/db";

type PostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string | null;
};

export default async function HomePage() {
  const result = await query<PostRow>(
    "SELECT id, title, slug, excerpt, published_at FROM posts WHERE status = 'published' ORDER BY published_at DESC"
  );

  return (
    <div>
      <header>
        <div>
          <strong>Signal Desk</strong>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>Independent news, edited with care.</div>
        </div>
        <nav>
          <Link href="/login">Dashboard</Link>
        </nav>
      </header>
      <main>
        <div className="banner">
          <strong>Today&apos;s brief:</strong> A focused mix of policy, tech, and culture.
        </div>
        <section className="grid">
          {result.rows.length === 0 && (
            <div className="card">No published posts yet.</div>
          )}
          {result.rows.map((post) => (
            <Link key={post.id} href={`/${post.slug}`} className="card">
              <h2>{post.title}</h2>
              <p style={{ color: "var(--muted)" }}>{post.excerpt ?? ""}</p>
              <small>
                Published {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}
              </small>
            </Link>
          ))}
        </section>
      </main>
      <div className="footer">Signal Desk · Built for Vercel + Turso</div>
    </div>
  );
}
