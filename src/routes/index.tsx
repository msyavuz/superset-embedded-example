import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import type { EmbeddedDashboard } from "@superset-ui/embedded-sdk";
import { guestTokenFn } from "@/lib/guestTokens";
import { ControlPanel } from "@/components/control-panel";
import { PreviewArea } from "@/components/preview-area";
import { EmbedConfiguration } from "@/components/embed-configuration";

export const Route = createFileRoute("/")({ component: App });

const defaultUIConfig = JSON.stringify(
  {
    hideTitle: true,
    hideTab: true,
    filters: {
      visible: true,
      expanded: true,
    },
    urlParams: {},
  },
  null,
  2,
);

function App() {
  const [embedId, setEmbedId] = useState("");
  const [domain, setDomain] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [jsonConfig, setJsonConfig] = useState(defaultUIConfig);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [error, setError] = useState("");
  const [dashboardInstance, setDashboardInstance] =
    useState<EmbeddedDashboard | null>(null);
  const [shouldFetchToken, setShouldFetchToken] = useState(false);

  const getGuestToken = useServerFn(guestTokenFn);

  const { data: guestToken, refetch: refetchGuestToken, error: tokenError } = useQuery({
    queryKey: ["guest_token", domain, username, password, embedId],
    queryFn: async () => {
      console.log("Fetching guest token...");
      try {
        const token = await getGuestToken({ data: { domain, username, password, embedId } });
        console.log("Token fetched:", token ? "Success" : "Failed");
        return token;
      } catch (err: any) {
        console.error("Token fetch error:", err);
        throw err;
      }
    },
    enabled: shouldFetchToken && !!domain && !!username && !!password && !!embedId,
    retry: false,
  });

  const handleDisplay = async () => {
    try {
      JSON.parse(jsonConfig);

      if (!embedId.trim()) {
        setError("Embedded ID is required");
        return;
      }

      if (!domain.trim()) {
        setError("Domain is required");
        return;
      }

      if (!username.trim()) {
        setError("Username is required");
        return;
      }

      if (!password.trim()) {
        setError("Password is required");
        return;
      }

      // Validate URL format
      try {
        new URL(domain);
      } catch {
        setError("Invalid domain URL. Please enter a valid URL like http://localhost:8088");
        return;
      }

      setError("");
      setShouldFetchToken(true);
      
      // Wait for token to be fetched
      const tokenResult = await refetchGuestToken();
      const token = guestToken || tokenResult.data;
      
      if (tokenError || tokenResult.error) {
        const errorMsg = tokenError?.message || tokenResult.error?.message || "Unknown error";
        console.error("Token fetch error:", errorMsg);
        setError(`Failed to get guest token: ${errorMsg}`);
        return;
      }
      
      if (!token) {
        setError("Failed to get guest token. Please check your credentials and domain.");
        return;
      }

      console.log("Embedding dashboard with token...");
      setIsEmbedded(true);
      
      // Dynamically import to avoid SSR issues
      const { embedDashboard } = await import("@superset-ui/embedded-sdk");
      
      try {
        const dashboard = await embedDashboard({
          fetchGuestToken: () => {
            console.log("Providing guest token to embedded SDK");
            return Promise.resolve(token);
          },
          id: embedId,
          supersetDomain: domain,
          mountPoint: document.getElementById("embedded-container")!,
          dashboardUiConfig: JSON.parse(jsonConfig),
        });
        console.log("Dashboard embedded successfully");
        setDashboardInstance(dashboard);
      } catch (embedError: any) {
        console.error("Embed error:", embedError);
        setError(`Failed to embed dashboard: ${embedError.message || "Unknown error"}`);
        setIsEmbedded(false);
      }
    } catch (e: any) {
      console.error("Error in handleDisplay:", e);
      if (e.message?.includes("JSON")) {
        setError("Invalid JSON configuration");
      } else {
        setError(e.message || "An error occurred while embedding the dashboard");
      }
    }
  };

  const handleReset = () => {
    setIsEmbedded(false);
    setError("");
    setDashboardInstance(null);
    setShouldFetchToken(false);
  };

  const handleThemeChange = (theme: string) => {
    console.log("Theme changed to:", theme);
  };

  return (
    <div className="flex h-screen bg-background">
      <ControlPanel
        error={error}
        isEmbedded={isEmbedded}
        onDisplay={handleDisplay}
        onReset={handleReset}
      >
        <EmbedConfiguration
          embedId={embedId}
          domain={domain}
          username={username}
          password={password}
          jsonConfig={jsonConfig}
          onEmbedIdChange={setEmbedId}
          onDomainChange={setDomain}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
          onJsonConfigChange={setJsonConfig}
        />
      </ControlPanel>

      <PreviewArea
        isEmbedded={isEmbedded}
        embedId={embedId}
        domain={domain}
        username={username}
        jsonConfig={jsonConfig}
        dashboardInstance={dashboardInstance}
        onThemeChange={handleThemeChange}
      />
    </div>
  );
}
