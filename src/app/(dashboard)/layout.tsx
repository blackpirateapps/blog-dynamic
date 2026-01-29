import Link from "next/link";
import { requireSession } from "@/lib/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = requireSession();

  return (
    <div>
      <header>
        <div>
          <strong>Signal Desk · Dashboard</strong>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>
            Signed in as {session.email} ({session.role})
          </div>
        </div>
        <nav>
          <Link href="/dashboard">Overview</Link>
          <Link href="/dashboard/posts">Posts</Link>
          {session.role === "admin" && <Link href="/dashboard/users">Users</Link>}
          <form action="/api/logout" method="post" style={{ display: "inline" }}>
            <button className="button ghost" type="submit">Sign out</button>
          </form>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
