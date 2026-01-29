"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { getSetting, setSetting } from "@/lib/settings";
import { getGeminiAccessToken, getGoogleCredentials } from "@/lib/google-auth";

export async function fetchAvailableModels() {
  await requireRole("admin");
  
  const accessToken = await getGeminiAccessToken();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!accessToken && !apiKey) {
    throw new Error("Neither GOOGLE_APPLICATION_CREDENTIALS_JSON nor GEMINI_API_KEY is set");
  }

  let url = "https://generativelanguage.googleapis.com/v1/models";
  const headers: Record<string, string> = {};

  if (accessToken) {
    const credentials = await getGoogleCredentials();
    headers["Authorization"] = `Bearer ${accessToken}`;
    headers["x-goog-user-project"] = credentials?.project_id;
  } else {
    url += `?key=${apiKey}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch models: ${response.statusText}`);
  }

  const data = await response.json();
  // Filter for models that support generateContent
  const models = data.models
    .filter((m: any) => m.supportedGenerationMethods.includes("generateContent"))
    .map((m: any) => m.name.replace("models/", "")); 
  
  return models;
}

export async function getGeminiModel() {
  // Allow editors to read, but only admin to set? For now let's say anyone can read.
  // Actually requireSession in server components usually.
  return await getSetting("gemini_model", "gemini-1.5-flash");
}

export async function saveGeminiModel(formData: FormData) {
  await requireRole("admin");
  const model = String(formData.get("model"));
  if (!model) return;
  
  await setSetting("gemini_model", model);
  revalidatePath("/dashboard/settings");
}
