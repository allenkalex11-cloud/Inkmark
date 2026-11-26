import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full resize-y rounded-md border border-border-strong bg-surface px-3 py-3 text-sm text-fg",
        "placeholder:text-subtle",
        className,
      )}
      {...props}
    />
  );
}
