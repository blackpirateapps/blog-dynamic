import Link from "next/link";
import { listCategories, listTags } from "@/lib/queries";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const categories = await listCategories();
  const tags = await listTags();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div>
      <header>
        <div className="header-inner">
          <span className="masthead-date">{today}</span>
          <Link href="/" className="brand">Signal Desk</Link>
          <span className="tagline">Independent journalism, edited with care</span>
          <nav className="nav-bar">
            {categories.map(cat => (
              <Link key={cat.id} href={`/?category=${cat.slug}`} className="category-link">
                {cat.name}
              </Link>
            ))}
            <Link href="/login" className="nav-link">Log In</Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="footer">
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "48px" }}>
          <div>
            <h4>Signal Desk</h4>
            <p style={{ opacity: 0.75 }}>
              Independent news, edited with care. Covering the stories that matter with depth and perspective.
            </p>
          </div>
          <div>
            <h4>Sections</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {categories.map(cat => (
                <li key={cat.id} style={{ marginBottom: "10px" }}>
                  <Link href={`/?category=${cat.slug}`}>{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Topics</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {tags.slice(0, 8).map(tag => (
                <span key={tag.id} style={{ background: "rgba(255,255,255,0.1)", borderRadius: "2px", padding: "4px 10px", fontSize: "0.8rem" }}>
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4>Editorial</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: "10px" }}><Link href="/login">Staff Login</Link></li>
            </ul>
            <p style={{ marginTop: "24px", fontSize: "0.8rem", opacity: 0.6 }}>
              &copy; {new Date().getFullYear()} Signal Desk News. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
