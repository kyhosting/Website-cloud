import axios from "axios";
import { storage } from "../storage";

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
}

export interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const GOOGLE_OAUTH_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

export function getGoogleAuthUrl(hostname: string): string {
  // Build redirect URI dynamically from hostname
  const protocol = hostname.includes("localhost") ? "http" : "https";
  const redirectUri = `${protocol}://${hostname}/api/auth/google/callback`;
  
  const params = new URLSearchParams({
    client_id: GOOGLE_OAUTH_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid profile email",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export function getRedirectUri(hostname: string): string {
  const protocol = hostname.includes("localhost") ? "http" : "https";
  return `${protocol}://${hostname}/api/auth/google/callback`;
}

export async function exchangeGoogleCode(code: string, hostname: string): Promise<GoogleUserInfo> {
  try {
    const redirectUri = getRedirectUri(hostname);
    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: GOOGLE_OAUTH_CLIENT_ID,
      client_secret: GOOGLE_OAUTH_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    const { id_token } = tokenResponse.data;

    // Decode JWT token (without verification for now - can add verification later)
    const parts = id_token.split(".");
    const decoded = JSON.parse(Buffer.from(parts[1], "base64").toString());

    return {
      sub: decoded.sub,
      email: decoded.email,
      name: decoded.name || "",
      picture: decoded.picture,
    };
  } catch (error) {
    console.error("Google OAuth exchange error:", error);
    throw new Error("Failed to exchange Google code");
  }
}

export async function upsertGoogleUser(userInfo: GoogleUserInfo) {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const visibleId = `KIFZUSR-${randomNum}`;

  return await storage.upsertUser({
    id: userInfo.sub,
    visibleId,
    email: userInfo.email,
    firstName: userInfo.name.split(" ")[0] || "",
    lastName: userInfo.name.split(" ").slice(1).join(" ") || "",
    profileImageUrl: userInfo.picture,
  });
}
