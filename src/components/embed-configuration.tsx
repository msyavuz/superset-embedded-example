import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InfoCircle } from "@/components/info-circle";

interface EmbedConfigurationProps {
  embedId: string;
  domain: string;
  username: string;
  password: string;
  jsonConfig: string;
  onEmbedIdChange: (value: string) => void;
  onDomainChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onJsonConfigChange: (value: string) => void;
}

export function EmbedConfiguration({
  embedId,
  domain,
  username,
  password,
  jsonConfig,
  onEmbedIdChange,
  onDomainChange,
  onUsernameChange,
  onPasswordChange,
  onJsonConfigChange,
}: EmbedConfigurationProps) {
  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="embed-id" className="text-foreground">
            Embedded Dashboard ID
            <InfoCircle>
              The unique identifier for the dashboard you want to embed.
              This is generated when you click "Embed Dashboard" in your
              superset instance.
            </InfoCircle>
          </Label>
          <Input
            id="embed-id"
            placeholder="Enter embedded ID"
            value={embedId}
            onChange={(e) => onEmbedIdChange(e.target.value)}
            className="bg-background border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="domain" className="text-foreground">
            Domain
            <InfoCircle>
              The base URL of your superset instance backend (e.g.,
              http://localhost:8088).
            </InfoCircle>
          </Label>
          <Input
            id="domain"
            placeholder="http://localhost:8088"
            value={domain}
            onChange={(e) => onDomainChange(e.target.value)}
            className="bg-background border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="text-foreground">
            Username
            <InfoCircle>
              The username for authentication to be used to generate the
              guest token. This user must have the necessary permissions to
              create guest tokens in superset.
            </InfoCircle>
          </Label>
          <Input
            id="username"
            placeholder="admin"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
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
            onChange={(e) => onPasswordChange(e.target.value)}
            className="bg-background border-border"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="json-config" className="text-foreground">
          Dashboard UI Configuration
          <InfoCircle>
            JSON configuration to customize the embedded dashboard's UI
            (e.g., hiding title, tabs, setting filters visibility).
          </InfoCircle>
        </Label>
        <Textarea
          id="json-config"
          placeholder={jsonConfig}
          value={jsonConfig}
          onChange={(e) => onJsonConfigChange(e.target.value)}
          className="font-mono text-sm bg-background border-border min-h-96 resize-none"
        />
      </div>

      <div className="space-y-2"></div>
    </>
  );
}