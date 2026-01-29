import { GoogleAuth } from "google-auth-library";

export async function getGeminiAccessToken(): Promise<string | null> {
  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

  if (!credentialsJson) {
    return null;
  }

  try {
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
