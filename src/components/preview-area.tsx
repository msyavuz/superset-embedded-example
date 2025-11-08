import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoCircle } from "@/components/info-circle";
import { CodeBlock } from "@/components/code-block";
import { themes } from "@/lib/presetThemes";
import { buildGuestTokenPayload } from "@/lib/guestTokens";
import type { EmbeddedDashboard } from "@superset-ui/embedded-sdk";

interface PreviewAreaProps {
  isEmbedded: boolean;
  embedId: string;
  domain: string;
  username: string;
  jsonConfig: string;
  dashboardInstance: EmbeddedDashboard | null;
  onThemeChange: (theme: string) => void;
}

export function PreviewArea({
  isEmbedded,
  embedId,
  domain,
  username,
  jsonConfig,
  dashboardInstance,
  onThemeChange,
}: PreviewAreaProps) {
  return (
    <div className="flex-1 flex flex-col">
      {isEmbedded && (
        <>
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
                        onThemeChange(value);
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

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <Label>
                    Guest token configuration
                    <InfoCircle>
                      This configuration is used to generate the guest token for
                      embedding. Resources, RLS, and user information are
                      specified here.
                    </InfoCircle>
                  </Label>

                  <CodeBlock>
                    {JSON.stringify(buildGuestTokenPayload(embedId), null, 2)}
                  </CodeBlock>
                </div>
                <div>
                  <Label>
                    Embed Configuration
                    <InfoCircle>
                      This argument object is passed to the{" "}
                      <code>embedDashboard</code> function from the Superset
                      Embedded SDK.
                    </InfoCircle>
                  </Label>
                  <CodeBlock>
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
                  </CodeBlock>
                </div>
              </div>
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

      <div
        className={`${isEmbedded ? "flex-1" : "hidden"} overflow-auto p-6 bg-background`}
        id="embedded-container"
      ></div>
    </div>
  );
}

