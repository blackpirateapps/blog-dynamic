import Link from "next/link";

// In Next.js 15+ searchParams is a Promise
export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const searchParams = await props.searchParams;

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
      <main style={{ maxWidth: 480, margin: "60px auto" }}>
        <div style={{ padding: "40px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--card)" }}>
          <h1 style={{ marginBottom: "24px", fontSize: "1.5rem" }}>Sign in</h1>
          {searchParams.error && (
            <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "12px", borderRadius: "4px", marginBottom: "20px", fontSize: "0.9rem" }}>
              {searchParams.error}
            </div>
          )}
          <form method="post" action="/api/login">
            <div style={{ marginBottom: "16px" }}>
              <label htmlFor="email" style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", fontWeight: "600" }}>Email</label>
              <input id="email" name="email" type="email" required style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label htmlFor="password" style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", fontWeight: "600" }}>Password</label>
              <input id="password" name="password" type="password" required style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid var(--border)" }} />
            </div>
            <button className="button" type="submit" style={{ width: "100%" }}>Sign in</button>
          </form>
        </div>
      </main>
    </div>
  );
}