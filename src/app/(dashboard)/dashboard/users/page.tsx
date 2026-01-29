import { revalidatePath } from "next/cache";
import { requireRole, hashPassword } from "@/lib/auth";
import { createUser, deleteUser, listUsers } from "@/lib/queries";
import { newId } from "@/lib/ids";

async function createUserAction(formData: FormData) {
  "use server";
  requireRole("admin");
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
  requireRole("admin");
  const id = String(formData.get("id") || "");
  if (!id) return;
  await deleteUser(id);
  revalidatePath("/dashboard/users");
}

export default async function UsersPage() {
  requireRole("admin");
  const users = await listUsers();

  return (
    <div>
      <h1>Users</h1>
      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Add team member</h3>
        <form action={createUserAction}>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" required />
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
          <label htmlFor="password">Temporary password</label>
          <input id="password" name="password" type="password" required />
          <label htmlFor="role">Role</label>
          <select id="role" name="role" defaultValue="editor">
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </select>
          <button className="button" type="submit">Create user</button>
        </form>
      </div>
      <div className="card">
        <h3>Current users</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <form action={deleteUserAction}>
                    <input type="hidden" name="id" value={user.id} />
                    <button className="button ghost" type="submit">Remove</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
