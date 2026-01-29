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

  const posts = result.rows;
  const [heroPost, ...otherPosts] = posts;

  return (
    <div>
      <header>
        <div className="header-inner">
          <div className="brand">Signal Desk.</div>
          <nav>
            <Link href="/login" className="nav-link">Log In</Link>
          </nav>
        </div>
      </header>
      <main>
        {posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
            <p>No stories have been published yet.</p>
          </div>
        ) : (
          <>
            {heroPost && (
              <section className="hero-section">
                <Link href={`/${heroPost.slug}`} className="hero-card">
                  <span className="meta">
                    {heroPost.published_at ? new Date(heroPost.published_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : "Latest"}
                  </span>
                  <h1 className="hero-title">{heroPost.title}</h1>
                  <p className="hero-excerpt">{heroPost.excerpt}</p>
                </Link>
              </section>
            )}

            <section className="grid">
              {otherPosts.map((post) => (
                <Link key={post.id} href={`/${post.slug}`} className="card">
                  <span className="meta">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}
                  </span>
                  <h2 className="card-title">{post.title}</h2>
                  <p className="card-excerpt">{post.excerpt}</p>
                  <span style={{ textDecoration: "underline", fontSize: "0.9rem" }}>Read full story &rarr;</span>
                </Link>
              ))}
            </section>
          </>
        )}
      </main>
      <div className="footer">
        &copy; {new Date().getFullYear()} Signal Desk News. All rights reserved.
      </div>
    </div>
  );
}