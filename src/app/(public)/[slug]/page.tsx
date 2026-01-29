import Link from "next/link";
import { getPostBySlug } from "@/lib/queries";
import { notFound } from "next/navigation";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const shareUrl = `https://example.com/${post.slug}`; // Replace with actual domain in production
  const shareText = post.title;

  return (
    <div>
      <article style={{ maxWidth: "700px", margin: "0 auto" }}>
        <header style={{ marginBottom: "40px", textAlign: "center" }}>
          <div style={{ marginBottom: "16px" }}>
            {post.category_name && (
               <Link href={`/?category=${post.slug}`} className="meta" style={{ color: "var(--accent)", fontWeight: "bold", display: "inline-block", marginRight: "12px" }}>
                 {post.category_name}
               </Link>
            )}
            <span className="meta" style={{ display: "inline-block" }}>
              {post.published_at ? new Date(post.published_at).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric'
              }) : ""}
            </span>
          </div>
          <h1 style={{ fontSize: "2.5rem", lineHeight: "1.2", marginBottom: "16px" }}>{post.title}</h1>
          {post.excerpt && <p style={{ fontSize: "1.2rem", color: "var(--muted)", lineHeight: "1.5" }}>{post.excerpt}</p>}
        </header>

        <div style={{ fontSize: "1.125rem", lineHeight: "1.8", whiteSpace: "pre-wrap", marginBottom: "60px" }}>
          {post.content}
        </div>

        <footer style={{ borderTop: "1px solid var(--border)", paddingTop: "30px", marginBottom: "60px" }}>
          {post.tags && post.tags.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontWeight: "bold", fontSize: "0.9rem", marginRight: "8px" }}>Tags:</span>
              {post.tags.map(tag => (
                <span key={tag.id} style={{ display: "inline-block", background: "#f0f0f0", padding: "4px 8px", borderRadius: "4px", fontSize: "0.85rem", marginRight: "8px", color: "var(--muted)" }}>
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          <div>
            <span style={{ fontWeight: "bold", fontSize: "0.9rem", display: "block", marginBottom: "12px" }}>Share this story:</span>
            <div style={{ display: "flex", gap: "12px" }}>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="button ghost" style={{ padding: "8px", display: "inline-flex", alignItems: "center", justifyContent: "center" }} aria-label="Share on Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="button ghost" style={{ padding: "8px", display: "inline-flex", alignItems: "center", justifyContent: "center" }} aria-label="Share on Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="button ghost" style={{ padding: "8px", display: "inline-flex", alignItems: "center", justifyContent: "center" }} aria-label="Share on LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}