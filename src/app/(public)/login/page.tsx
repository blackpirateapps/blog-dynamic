import Link from "next/link";

export default function LoginPage({
  searchParams
}: {
  searchParams: { error?: string };
}) {
  return (
    <div>
      <header>
        <div>
          <strong>Signal Desk</strong>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>Editorial dashboard access.</div>
        </div>
        <nav>
          <Link href="/">Home</Link>
        </nav>
      </header>
      <main style={{ maxWidth: 520 }}>
        <div className="card">
          <h1>Sign in</h1>
          {searchParams.error && (
            <div className="banner">{searchParams.error}</div>
          )}
          <form method="post" action="/api/login">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required />
            <button className="button" type="submit">Sign in</button>
          </form>
        </div>
      </main>
    </div>
  );
}
