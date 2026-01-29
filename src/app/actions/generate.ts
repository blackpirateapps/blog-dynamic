"use server";

import { getSetting } from "@/lib/settings";
import { getGeminiAccessToken, getGoogleCredentials } from "@/lib/google-auth";

export async function generatePostContent(prompt: string) {
  const model = await getSetting("gemini_model", "gemini-1.5-flash");
  
  const accessToken = await getGeminiAccessToken();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!accessToken && !apiKey) {
    throw new Error("Neither GOOGLE_APPLICATION_CREDENTIALS_JSON nor GEMINI_API_KEY is set");
  }

  const systemPrompt = `
    You are a professional blog post writer. 
    Generate a blog post based on the user's prompt.
    Return ONLY a valid JSON object with the following structure:
    {
      "title": "The post title",
      "excerpt": "A short summary (1-2 sentences)",
      "content": "The full blog post content in HTML format (use <p>, <h2>, <ul>, <li>, etc.)",
      "tags": ["tag1", "tag2", "tag3"]
    }
    Do not wrap the JSON in markdown code blocks. Return raw JSON.
  `;

  let url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    const credentials = await getGoogleCredentials();
    headers["Authorization"] = `Bearer ${accessToken}`;
    headers["x-goog-user-project"] = credentials?.project_id;
  } else {
    url += `?key=${apiKey}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      contents: [{
        parts: [{ text: systemPrompt + "\n\nUser Prompt: " + prompt }]
      }]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Gemini API Error: ${response.status} ${response.statusText}`, errorBody);
    throw new Error(`Gemini API Error: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("No content generated");
  }

  try {
    // Clean up potential markdown formatting if the model adds it despite instructions
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Failed to parse JSON:", text);
    throw new Error("Failed to parse generated content");
  }
}
