import Link from "next/link";
import { requireSession } from "@/lib/auth";
import "./dashboard.css";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <Link href="/dashboard" className="dashboard-brand">Signal Desk</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard/posts">Posts</Link>
        {session.role === "admin" && <Link href="/dashboard/users">Users</Link>}
      </aside>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            Howdy, {session.email}
          </div>
          <form action="/api/logout" method="post">
            <button className="wp-button secondary" type="submit">Log Out</button>
          </form>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}
