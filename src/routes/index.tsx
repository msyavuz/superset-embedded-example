import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { auth, fetchGuestToken } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import type { EmbeddedDashboard } from "@superset-ui/embedded-sdk";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { themes } from "@/lib/presetThemes";

export const Route = createFileRoute("/")({ component: App });

const defaultUIConfig = JSON.stringify(
  {
    filters: {
      visible: true,
      expanded: true,
    },
    urlParams: {},
  },
  null,
  2,
);

export const guestTokenFn = createServerFn()
  .inputValidator(
    (data: {
      domain: string;
      username: string;
      password: string;
      embedId: string;
    }) => data,
  )
  .handler(async ({ data: { domain, password, username, embedId } }) => {
    const { authHeaders } = await auth(
      `${domain}/api/v1/security/login`,
      username,
      password,
    );
    const guestToken = await fetchGuestToken(
      `${domain}/api/v1/security/guest_token`,
      {
        resources: [
          {
            type: "dashboard",
            id: embedId,
          },
        ],
        rls: [],
        user: {
          username: "guest",
          first_name: "Guest",
          last_name: "User",
        },
      },
      authHeaders,
    );

    return guestToken;
  });

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

  const getGuestToken = useServerFn(guestTokenFn);

  const { data: guestToken } = useQuery({
    queryKey: ["guest_token"],
    queryFn: async () =>
      await getGuestToken({ data: { domain, username, password, embedId } }),
  });

  const handleDisplay = () => {
    try {
      JSON.parse(jsonConfig);

      if (!embedId.trim()) {
        setError("Embedded ID is required");
        return;
      }

      setError("");
      setIsEmbedded(true);
      embedDashboard({
        fetchGuestToken: () => guestToken,
        id: embedId,
        supersetDomain: domain,
        mountPoint: document.getElementById("embedded-container")!,
        dashboardUiConfig: JSON.parse(jsonConfig),
      }).then((dashboard) => {
        setDashboardInstance(dashboard);
      });
    } catch (e) {
      setError("Invalid JSON configuration");
    }
  };

  const handleReset = () => {
    setIsEmbedded(false);
    setError("");
    setDashboardInstance(null);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Control Panel - Left Sidebar */}
      <div className="w-80 flex-shrink-0 border-r border-border bg-muted p-6 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Embed Demo
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure and test superset embedded dashboards.
            </p>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="embed-id" className="text-foreground">
                Embedded Dashboard ID
              </Label>
              <Input
                id="embed-id"
                placeholder="Enter embedded ID"
                value={embedId}
                onChange={(e) => setEmbedId(e.target.value)}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain" className="text-foreground">
                Domain
              </Label>
              <Input
                id="domain"
                placeholder="http://localhost:8088"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                Username
              </Label>
              <Input
                id="username"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-border"
              />
            </div>
          </div>

          {/* JSON Config */}
          <div className="space-y-2">
            <Label htmlFor="json-config" className="text-foreground">
              Dashboard UI Configuration
            </Label>
            <Textarea
              id="json-config"
              placeholder={defaultUIConfig}
              value={jsonConfig}
              onChange={(e) => setJsonConfig(e.target.value)}
              className="font-mono text-sm bg-background border-border min-h-96 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Select></Select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleDisplay}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Display Embed
            </Button>
            {isEmbedded && (
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Preview Area - Main Content */}
      <div className="flex-1 flex flex-col">
        {isEmbedded && (
          <>
            {/* Header Info */}
            <div className="border-b border-border bg-card p-4">
              <div className="max-w-full">
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Embedded Preview
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium text-foreground">
                      Embedded Dashboard ID:
                    </span>{" "}
                    {embedId}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">
                      Superset Domain:
                    </span>{" "}
                    {domain || "—"}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">User:</span>{" "}
                    {username || "—"}
                  </div>
                  <div>
                    <Select
                      onValueChange={(value) => {
                        if (dashboardInstance) {
                          dashboardInstance.setThemeConfig(
                            themes.find((theme) => theme.name === value)
                              ?.config || {},
                          );
                        }
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {themes.map((theme) => (
                          <SelectItem value={theme.name} key={theme.name}>
                            {theme.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <pre className="mt-6 p-4 bg-muted rounded text-left text-xs text-muted-foreground overflow-x-auto">
                  {JSON.stringify(
                    {
                      id: embedId,
                      supersetDomain: domain,
                      mountPoint:
                        'document.getElementById("embedded-container")!',
                      dashboardUiConfig: JSON.parse(jsonConfig),
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            </div>
          </>
        )}

        {!isEmbedded && (
          <div className="flex-1 flex items-center justify-center bg-background p-6">
            <Card className="bg-card border-border p-12 text-center max-w-md">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Ready to embed
              </h2>
              <p className="text-muted-foreground mb-6">
                Fill in the configuration on the left panel and click "Display
                Embed" to preview your embedded content.
              </p>
            </Card>
          </div>
        )}

        {/* Embedded Container - always present but visibility controlled */}
        <div
          className={`${isEmbedded ? "flex-1" : "hidden"} overflow-auto p-6 bg-background`}
          id="embedded-container"
        ></div>
      </div>
    </div>
  );
}
