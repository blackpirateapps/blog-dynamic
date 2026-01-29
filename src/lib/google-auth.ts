import { GoogleAuth } from "google-auth-library";

export async function getGeminiAccessToken(): Promise<string | null> {
  let credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

  if (!credentialsJson) {
    return null;
  }

  try {
    // Robustly clean the string: remove leading/trailing whitespace, and then remove wrapping quotes if present.
    credentialsJson = credentialsJson.trim();
    if (
      (credentialsJson.startsWith("'") && credentialsJson.endsWith("'")) ||
      (credentialsJson.startsWith('"') && credentialsJson.endsWith('"'))
    ) {
      credentialsJson = credentialsJson.substring(1, credentialsJson.length - 1);
    }

    const credentials = JSON.parse(credentialsJson);
    const auth = new GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/cloud-platform"]
    });
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    return accessToken.token || null;
  } catch (error) {
    console.error("Failed to get Google Access Token:", error);
    return null;
  }
}
