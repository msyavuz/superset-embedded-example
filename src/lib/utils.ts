import axios, { AxiosRequestConfig } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function auth(url: string, username: string, password: string) {
  try {
    console.log("Authenticating to:", url);
    const { data } = await axios.post(
      url,
      { username, password, provider: "db" },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const accessToken = data["access_token"];
    console.log("Auth successful, token received");
    return {
      accessToken,
      authHeaders: {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      },
    };
  } catch (error: any) {
    if (error.response) {
      console.error("Auth failed - Server responded with:", error.response.status, error.response.data);
      throw new Error(`Authentication failed: ${error.response.data?.message || error.response.statusText}`);
    } else if (error.request) {
      console.error("Auth failed - No response received:", error.message);
      throw new Error(`Cannot connect to Superset. Is it running at ${url.replace('/api/v1/security/login', '')}?`);
    } else {
      console.error("Auth failed - Request setup error:", error.message);
      throw new Error(`Invalid request: ${error.message}`);
    }
  }
}

export async function fetchGuestToken(
  url: string,
  tokenOptions: any,
  auth_headers: AxiosRequestConfig<any>,
) {
  try {
    console.log("Fetching guest token from:", url);
    console.log("Token payload:", JSON.stringify(tokenOptions, null, 2));
    console.log("Auth headers:", JSON.stringify(auth_headers.headers, null, 2));
    const resp = await axios.post(url, tokenOptions, auth_headers);
    console.log("Guest token response status:", resp.status);
    console.log("Guest token response:", resp.data);
    const token = resp.data["token"];
    if (!token) {
      console.error("No token in response. Full response:", resp.data);
      throw new Error("No token received in response");
    }
    console.log("Guest token successfully extracted");
    return token;
  } catch (error: any) {
    console.error("Guest token fetch failed!");
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    console.error("Error message:", error.message);
    
    if (error.response?.status === 308) {
      throw new Error("API redirect issue - check trailing slashes in URLs");
    }
    if (error.response?.status === 400) {
      const details = error.response.data?.message || "Unknown error";
      throw new Error(`Bad request - ${details}`);
    }
    if (error.response?.status === 403) {
      throw new Error("Forbidden - user lacks 'can grant guest token' permission");
    }
    if (error.response?.status === 401) {
      throw new Error("Unauthorized - check login credentials");
    }
    throw error;
  }
}
