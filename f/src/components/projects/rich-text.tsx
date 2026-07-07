import { cn } from "@/lib/utils";

interface RichTextProps {
  html: string;
  className?: string;
}

export function RichText({ html, className }: RichTextProps) {
  return (
    <div
      className={cn(
        "space-y-3 text-sm leading-relaxed text-muted-foreground",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_b]:font-semibold [&_b]:text-foreground",
        "[&_em]:italic [&_i]:italic",
        "[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
        "[&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5",
        "[&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5",
        "[&_p+p]:mt-3",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
