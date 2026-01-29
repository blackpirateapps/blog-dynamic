import { requireRole } from "@/lib/auth";
import { getGeminiModel, saveGeminiModel } from "@/app/actions/settings";
import ModelSelector from "@/components/ModelSelector";

export default async function SettingsPage() {
  await requireRole("admin");
  const currentModel = await getGeminiModel();

  return (
    <div>
      <h1 style={{ marginBottom: 20, fontSize: 23, fontWeight: 400 }}>Settings</h1>
      
      <div className="wp-card" style={{ maxWidth: 600 }}>
        <h2 style={{ fontSize: 18, borderBottom: "1px solid #eee", paddingBottom: 10, marginBottom: 20 }}>AI Configuration</h2>
        
        <form action={saveGeminiModel}>
          <ModelSelector currentModel={currentModel} />
        </form>
      </div>
    </div>
  );
}
