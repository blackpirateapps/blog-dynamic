import Link from "next/link";
import { getPostBySlug } from "@/lib/queries";
import { notFound } from "next/navigation";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const shareUrl = `https://example.com/${post.slug}`;
  const shareText = post.title;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="article-container">
      <article>
        <header className="article-header">
          <div className="meta" style={{ marginBottom: "12px" }}>
            {post.category_name && (
              <Link href={`/?category=${post.slug}`} className="category-tag">
                {post.category_name}
              </Link>
            )}
            {formatDate(post.published_at)}
          </div>
          <h1 className="article-title">{post.title}</h1>
          {post.excerpt && (
            <p style={{ fontSize: "1.25rem", color: "var(--muted)", lineHeight: "1.5", marginTop: "16px" }}>
              {post.excerpt}
            </p>
          )}
        </header>

        <div className="article-body" style={{ whiteSpace: "pre-wrap", marginBottom: "60px" }}>
          {post.content}
        </div>

        <footer style={{ borderTop: "1px solid var(--border)", paddingTop: "32px", marginBottom: "60px" }}>
          {post.tags && post.tags.length > 0 && (
            <div style={{ marginBottom: "28px" }}>
              <span style={{ fontFamily: "var(--font-ui)", fontWeight: "600", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", marginRight: "12px" }}>Tagged:</span>
              {post.tags.map(tag => (
                <span key={tag.id} style={{ display: "inline-block", background: "var(--border-light)", padding: "6px 12px", borderRadius: "2px", fontSize: "0.8rem", marginRight: "8px", color: "var(--muted)", fontFamily: "var(--font-ui)" }}>
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div>
            <span style={{ fontFamily: "var(--font-ui)", fontWeight: "600", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "16px" }}>Share this story</span>
            <div style={{ display: "flex", gap: "12px" }}>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="button ghost" style={{ padding: "10px" }} aria-label="Share on Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="button ghost" style={{ padding: "10px" }} aria-label="Share on Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="button ghost" style={{ padding: "10px" }} aria-label="Share on LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}