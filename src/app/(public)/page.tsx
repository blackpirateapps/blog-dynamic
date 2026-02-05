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

  let heroPost: PostRow | undefined;
  let otherPosts = posts;

  if (!categorySlug && posts.length > 0) {
    [heroPost, ...otherPosts] = posts;
  }

  const formatDate = (dateStr: string | null, long = false) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (long) {
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div>
      {posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--muted)" }}>
          <p style={{ fontSize: "1.25rem" }}>No stories found.</p>
          {categorySlug && <Link href="/" className="read-more">View all stories &rarr;</Link>}
        </div>
      ) : (
        <>
          {heroPost && (
            <section className="hero-section">
              <Link href={`/${heroPost.slug}`} className="hero-card">
                <span className="meta">
                  {heroPost.category_name && <span className="category-tag">{heroPost.category_name}</span>}
                  {formatDate(heroPost.published_at, true)}
                </span>
                <h1 className="hero-title">{heroPost.title}</h1>
                <p className="hero-excerpt">{heroPost.excerpt}</p>
                <span className="read-more">Continue reading &rarr;</span>
              </Link>
            </section>
          )}

          <section className="grid">
            {otherPosts.map((post) => (
              <Link key={post.id} href={`/${post.slug}`} className="card">
                <span className="meta">
                  {post.category_name && <span className="category-tag">{post.category_name}</span>}
                  {formatDate(post.published_at)}
                </span>
                <h2 className="card-title">{post.title}</h2>
                <p className="card-excerpt">{post.excerpt}</p>
                <span className="read-more">Read more &rarr;</span>
              </Link>
            ))}
          </section>
        </>
      )}
    </div>
  );
}