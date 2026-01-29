"use client";

import { useState } from "react";
import { fetchAvailableModels } from "@/app/actions/settings";
import SubmitButton from "@/components/SubmitButton";

export default function ModelSelector({ currentModel }: { currentModel: string }) {
  const [models, setModels] = useState<string[]>([currentModel]);
  const [error, setError] = useState("");
  
  const handleFetch = async () => {
    setError("");
    try {
      const fetched = await fetchAvailableModels();
      setModels(Array.from(new Set([...models, ...fetched])));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <>
      <div style={{ marginBottom: 15 }}>
        <label className="wp-label">Gemini Model</label>
        <div style={{ display: "flex", gap: 10 }}>
          <select name="model" className="wp-select" defaultValue={currentModel} style={{ marginBottom: 0 }}>
            {models.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <button type="button" className="wp-button secondary" onClick={handleFetch}>Fetch Models</button>
        </div>
        {error && <p style={{ color: "red", fontSize: 12, marginTop: 5 }}>{error}</p>}
        <p style={{ fontSize: 12, color: "#666", marginTop: 5 }}>
          Select the model to use for AI content generation. Click "Fetch Models" to refresh the list from Google.
        </p>
      </div>
      <SubmitButton label="Save Changes" />
    </>
  );
}
