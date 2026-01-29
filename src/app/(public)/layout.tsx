import Link from "next/link";
import { listCategories } from "@/lib/queries";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const categories = await listCategories();

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
          <nav style={{ borderTop: "1px solid var(--border)", width: "100%", paddingTop: "12px" }}>
            {categories.map(cat => (
              <Link key={cat.id} href={`/?category=${cat.slug}`} style={{ marginRight: "20px", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase" }}>
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <div className="footer">
        &copy; {new Date().getFullYear()} Signal Desk News. All rights reserved.
      </div>
    </div>
  );
}
