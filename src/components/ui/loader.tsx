import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function Loader({ size = "md", className, label }: LoaderProps) {
  const sizes = {
    sm: "size-5 border-2",
    md: "size-8 border-[3px]",
    lg: "size-12 border-4",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <div
        className={cn(
          "rounded-full border-primary/30 border-t-primary animate-spin",
          sizes[size],
        )}
      />
      {label && (
        <p className="text-sm text-muted-foreground animate-pulse">{label}</p>
      )}
    </div>
  );
}

export function PageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader size="lg" label={label} />
    </div>
  );
}

export function InlineLoader() {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="size-1.5 rounded-full bg-primary/60 animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <div
        className="size-1.5 rounded-full bg-primary/60 animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <div
        className="size-1.5 rounded-full bg-primary/60 animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}
