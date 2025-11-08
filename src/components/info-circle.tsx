import { PropsWithChildren } from "react";
import { HoverCard, HoverCardContent } from "./ui/hover-card";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import { AlertCircleIcon } from "lucide-react";

export function InfoCircle(props: PropsWithChildren) {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <AlertCircleIcon size={16} />
      </HoverCardTrigger>
      <HoverCardContent className="w-80">{props.children}</HoverCardContent>
    </HoverCard>
  );
}
