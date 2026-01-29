import { GoogleAuth } from "google-auth-library";

export async function getGoogleCredentials(): Promise<any | null> {
  let credentialsSource = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

  if (!credentialsSource) {
    return null;
  }

  try {
    credentialsSource = credentialsSource.trim();
    
    // Check if it is a URL
    if (credentialsSource.startsWith("http://") || credentialsSource.startsWith("https://")) {
      const response = await fetch(credentialsSource);
      if (!response.ok) {
        console.error(`Failed to fetch credentials from URL: ${response.status} ${response.statusText}`);
        return null;
      }
      return await response.json();
    } else {
      // Existing logic for raw JSON string
      if (
        (credentialsSource.startsWith("'") && credentialsSource.endsWith("'")) ||
        (credentialsSource.startsWith('"') && credentialsSource.endsWith('"'))
      ) {
        credentialsSource = credentialsSource.substring(1, credentialsSource.length - 1);
      }
      return JSON.parse(credentialsSource);
    }
  } catch (error) {
    console.error("Failed to parse/fetch Google Credentials:", error);
    return null;
  }
}

export async function getGeminiAccessToken(): Promise<string | null> {
  const credentials = await getGoogleCredentials();

  if (!credentials) {
    return null;
  }

  try {
    const auth = new GoogleAuth({
      credentials,
      scopes: [
        "https://www.googleapis.com/auth/cloud-platform",
        "https://www.googleapis.com/auth/generative-language"
      ]
    });
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    return accessToken.token || null;
  } catch (error) {
    console.error("Failed to get Google Access Token:", error);
    return null;
  }
}
