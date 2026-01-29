import { listPosts, listUsers } from "@/lib/queries";
import { requireSession } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await requireSession();
  const posts = await listPosts();
  const users = session.role === "admin" ? await listUsers() : [];

  return (
    <div>
      <h1>Overview</h1>
      <div className="grid">
        <div className="card">
          <h3>Total posts</h3>
          <p>{posts.length}</p>
        </div>
        <div className="card">
          <h3>Published</h3>
          <p>{posts.filter((post) => post.status === "published").length}</p>
        </div>
        {session.role === "admin" && (
          <div className="card">
            <h3>Team members</h3>
            <p>{users.length}</p>
          </div>
        )}
      </div>
    </div>
  );
}
