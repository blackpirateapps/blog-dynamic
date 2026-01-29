"use client";

import { useState } from "react";
import SubmitButton from "@/components/SubmitButton";
import { generatePostContent } from "@/app/actions/generate";

type Category = {
  id: string;
  name: string;
};

type PostFormProps = {
  action: (formData: FormData) => void;
  categories: Category[];
  initialData?: {
    id?: string;
    title?: string;
    content?: string;
    excerpt?: string | null;
    status?: string;
    category_id?: string | null;
    tags?: string;
  };
};

export default function PostForm({ action, categories, initialData = {} }: PostFormProps) {
  const [title, setTitle] = useState(initialData.title || "");
  const [content, setContent] = useState(initialData.content || "");
  const [excerpt, setExcerpt] = useState(initialData.excerpt || "");
  const [tags, setTags] = useState(initialData.tags || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [prompt, setPrompt] = useState("");

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const data = await generatePostContent(prompt);
      setTitle(data.title);
      setExcerpt(data.excerpt);
      setContent(data.content);
      if (data.tags && Array.isArray(data.tags)) {
        setTags(data.tags.join(", "));
      }
      setShowPromptModal(false);
      setPrompt("");
    } catch (error) {
      alert("Failed to generate content: " + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <form action={action}>
        {initialData.id && <input type="hidden" name="id" value={initialData.id} />}
        <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 20 }}>
          <div className="wp-card">
            <div style={{ marginBottom: 15, display: "flex", justifyContent: "flex-end" }}>
              <button 
                type="button" 
                className="wp-button secondary" 
                onClick={() => setShowPromptModal(true)}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                Generate with Gemini
              </button>
            </div>

            <input 
              name="title" 
              className="wp-input" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Enter title here" 
              style={{ fontSize: 20, padding: "10px" }} 
              required 
            />
            <textarea 
              name="content" 
              className="wp-textarea" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15} 
              placeholder="Start writing..." 
              style={{ fontSize: 16 }} 
              required 
            />
            
            <label className="wp-label">Excerpt</label>
            <textarea 
              name="excerpt" 
              className="wp-textarea" 
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3} 
            />
          </div>

          <div>
            <div className="wp-card">
              <h3 style={{ margin: "0 0 10px 0", fontSize: 14 }}>Publish</h3>
              <div style={{ marginBottom: 10 }}>
                <label className="wp-label">Status</label>
                <select name="status" className="wp-select" defaultValue={initialData.status || "draft"}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div style={{ textAlign: "right" }}>
                <SubmitButton label={initialData.id ? "Update" : "Publish"} />
              </div>
            </div>

            <div className="wp-card">
              <h3 style={{ margin: "0 0 10px 0", fontSize: 14 }}>Categories</h3>
              <select name="category_id" className="wp-select" defaultValue={initialData.category_id || ""}>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="wp-card">
              <h3 style={{ margin: "0 0 10px 0", fontSize: 14 }}>Tags</h3>
              <input 
                name="tags" 
                className="wp-input" 
                value={tags} 
                onChange={(e) => setTags(e.target.value)}
                placeholder="Separate with commas" 
              />
            </div>
          </div>
        </div>
      </form>

      {showPromptModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{ background: "#fff", padding: 25, borderRadius: 8, width: 400, maxWidth: "90%" }}>
            <h3 style={{ marginTop: 0 }}>Generate with Gemini</h3>
            <p style={{ fontSize: 14, color: "#666" }}>Describe what you want to write about.</p>
            <textarea 
              className="wp-textarea" 
              rows={4} 
              value={prompt} 
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A comprehensive guide to coffee brewing..."
              autoFocus
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button className="wp-button secondary" onClick={() => setShowPromptModal(false)}>Cancel</button>
              <button 
                className="wp-button" 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
              >
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
