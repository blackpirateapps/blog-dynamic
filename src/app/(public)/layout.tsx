import Link from "next/link";
import { listCategories, listTags } from "@/lib/queries";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const categories = await listCategories();
  const tags = await listTags();

  return (
    <div>
      <header>
        <div className="header-inner" style={{ flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", marginBottom: "16px" }}>
            <Link href="/" className="brand">Signal Desk.</Link>
            <nav>
              <Link href="/login" className="nav-link">Log In</Link>
            </nav>
          </div>
          <nav style={{ borderTop: "1px solid var(--border)", width: "100%", paddingTop: "12px", overflowX: "auto", whiteSpace: "nowrap" }}>
            {categories.map(cat => (
              <Link key={cat.id} href={`/?category=${cat.slug}`} style={{ marginRight: "20px", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase", display: "inline-block" }}>
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer style={{ borderTop: "1px solid var(--border)", background: "#f9f9f9", padding: "60px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px" }}>
          <div>
            <h4 style={{ marginBottom: "20px", fontSize: "1rem" }}>Signal Desk.</h4>
            <p style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.6 }}>
              Independent news, edited with care. Covering the stories that matter with depth and perspective.
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: "20px", fontSize: "1rem" }}>Sections</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {categories.map(cat => (
                <li key={cat.id} style={{ marginBottom: "8px" }}>
                  <Link href={`/?category=${cat.slug}`} style={{ fontSize: "0.9rem", color: "var(--muted)" }}>{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: "20px", fontSize: "1rem" }}>Trending Topics</h4>
             <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {tags.slice(0, 10).map(tag => (
                 <span key={tag.id} style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: "4px", padding: "4px 8px", fontSize: "0.8rem", color: "var(--muted)" }}>
                   #{tag.name}
                 </span>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: "20px", fontSize: "1rem" }}>Editorial</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: "8px" }}><Link href="/login" style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Staff Login</Link></li>
            </ul>
             <p style={{ marginTop: "20px", fontSize: "0.8rem", color: "var(--muted)" }}>
              &copy; {new Date().getFullYear()} Signal Desk News.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
