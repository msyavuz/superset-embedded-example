import { PropsWithChildren } from "react";

export function CodeBlock(props: PropsWithChildren) {
  return (
    <pre className="mt-2 p-4 bg-muted rounded text-left text-xs text-muted-foreground overflow-x-auto">
      {props.children}
    </pre>
  );
}
