import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme-toggle";
import { StepsDialog } from "@/components/steps-dialog";
import { useState, ReactNode } from "react";

interface ControlPanelProps {
  children: ReactNode;
  error?: string;
  isEmbedded: boolean;
  onDisplay: () => void;
  onReset: () => void;
}

export function ControlPanel({
  children,
  error,
  isEmbedded,
  onDisplay,
  onReset,
}: ControlPanelProps) {
  const [stepsOpen, setStepsOpen] = useState(false);

  return (
    <div className="w-80 flex-shrink-0 border-r border-border bg-muted p-6 overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-4">
            Embed Demo <ModeToggle />
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure and test superset embedded dashboards.
          </p>
          <Button
            className="w-full mt-4"
            variant="default"
            onClick={() => setStepsOpen(true)}
          >
            How does it work?
          </Button>
          <StepsDialog
            open={stepsOpen}
            onOpenChange={(open) => setStepsOpen(open)}
            title="How does embedding work in this application?"
            steps={[
              {
                number: 1,
                title: "Authenticate user",
                description:
                  "The username and password are used to authenticate the user and get authentication headers from the superset backend. This step happens on the server side.",
              },
              {
                number: 2,
                title: "Generate guest token",
                description:
                  "Using the authenticated user, a guest token is generated for the embedded dashboard. This token includes resource access and RLS policies. This step also happens on the server side.",
              },
              {
                number: 3,
                title: "Embed dashboard",
                description:
                  "On the client side, the Superset Embedded SDK is used to embed the dashboard into the page using the guest token obtained from the server.",
              },
              {
                number: 4,
                title: "Interact with embedded dashboard",
                description:
                  "Once embedded, you can call methods on the dashboard instance. Changing themes is one example of such interaction.",
              },
            ]}
          />
        </div>

        {children}

        {error && (
          <div className="p-3 rounded-md bg-destructive/10 border border-destructive text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button
            onClick={onDisplay}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Display Embed
          </Button>
          {isEmbedded && (
            <Button
              onClick={onReset}
              variant="outline"
              className="flex-1 bg-transparent"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}