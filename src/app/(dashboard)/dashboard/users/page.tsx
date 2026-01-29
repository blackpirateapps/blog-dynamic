import { revalidatePath } from "next/cache";
import { requireRole, hashPassword } from "@/lib/auth";
import { createUser, deleteUser, listUsers } from "@/lib/queries";
import { newId } from "@/lib/ids";
import SubmitButton from "@/components/SubmitButton";

async function createUserAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const name = String(formData.get("name") || "").trim();
  const role = String(formData.get("role") || "editor") as "admin" | "editor";
  const password = String(formData.get("password") || "");

  if (!email || !name || !password) {
    return;
  }

  const passwordHash = await hashPassword(password);
  await createUser({
    id: newId(),
    email,
    name,
    role,
    passwordHash
  });

  revalidatePath("/dashboard/users");
}

async function deleteUserAction(formData: FormData) {
  "use server";
  await requireRole("admin");
  const id = String(formData.get("id") || "");
  if (!id) return;
  await deleteUser(id);
  revalidatePath("/dashboard/users");
}

export default async function UsersPage() {
  await requireRole("admin");
  const users = await listUsers();

  return (
    <div>
      <h1 style={{ marginBottom: 20, fontSize: 23, fontWeight: 400 }}>Users</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
        <div className="wp-card">
          <h3 style={{ margin: "0 0 15px 0", fontSize: 16 }}>Add New User</h3>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 15 }}>Create a new user and add them to this site.</p>
          <form action={createUserAction}>
            <label className="wp-label" htmlFor="name">Name</label>
            <input id="name" name="name" className="wp-input" required />
            
            <label className="wp-label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className="wp-input" required />
            
            <label className="wp-label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" className="wp-input" required />
            
            <label className="wp-label" htmlFor="role">Role</label>
            <select id="role" name="role" className="wp-select" defaultValue="editor">
              <option value="editor">Editor</option>
              <option value="admin">Administrator</option>
            </select>
            
            <SubmitButton label="Add New User" />
          </form>
        </div>

        <div className="wp-card" style={{ padding: 0 }}>
          <table className="wp-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Posts</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.name}</strong>
                    <div style={{ fontSize: 12, marginTop: 4 }}>
                       <form action={deleteUserAction} style={{ display: "inline" }}>
                        <input type="hidden" name="id" value={user.id} />
                        <button type="submit" style={{ background: "none", border: "none", padding: 0, color: "#a00", cursor: "pointer", fontSize: 12 }}>Delete</button>
                      </form>
                    </div>
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}