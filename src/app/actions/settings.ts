"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { getSetting, setSetting } from "@/lib/settings";

export async function fetchAvailableModels() {
  await requireRole("admin");
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch models: ${response.statusText}`);
  }

  const data = await response.json();
  // Filter for models that support generateContent
  const models = data.models
    .filter((m: any) => m.supportedGenerationMethods.includes("generateContent"))
    .map((m: any) => m.name.replace("models/", "")); // Strip 'models/' prefix for cleaner display/usage if desired, but API expects 'models/...' or just name. We'll store just the ID usually.
  
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
