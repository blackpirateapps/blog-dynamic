import Link from "next/link";
import { query } from "@/lib/db";
import { PostRow } from "@/lib/queries";

export default async function HomePage(props: { searchParams: Promise<{ category?: string }> }) {
  const searchParams = await props.searchParams;
  const categorySlug = searchParams.category;

  let sql = `
    SELECT p.id, p.title, p.slug, p.excerpt, p.published_at, c.name as category_name 
    FROM posts p 
    LEFT JOIN categories c ON p.category_id = c.id 
    WHERE p.status = 'published' 
  `;
  const args: any[] = [];

  if (categorySlug) {
    sql += " AND c.slug = ?";
    args.push(categorySlug);
  }

  sql += " ORDER BY p.published_at DESC";

  const result = await query<PostRow>(sql, args);

  const posts = result.rows;
  // If filtering, we don't necessarily want a hero layout, but for now keep it simple.
  // If there is a category filter, maybe no hero? Let's keep hero logic if no filter.
  
  let heroPost: PostRow | undefined;
  let otherPosts = posts;

  if (!categorySlug && posts.length > 0) {
    [heroPost, ...otherPosts] = posts;
  }

  return (
    <div>
      {posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
          <p>No stories found.</p>
          {categorySlug && <Link href="/">View all stories</Link>}
        </div>
      ) : (
        <>
          {heroPost && (
            <section className="hero-section">
              <Link href={`/${heroPost.slug}`} className="hero-card">
                <span className="meta">
                  {heroPost.category_name ? <span style={{ color: "var(--accent)", fontWeight: "bold", marginRight: "8px" }}>{heroPost.category_name}</span> : ""}
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
                   {post.category_name ? <span style={{ color: "var(--accent)", fontWeight: "bold", marginRight: "8px" }}>{post.category_name}</span> : ""}
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
    </div>
  );
}