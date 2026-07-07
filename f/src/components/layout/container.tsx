import { cn } from "@/lib/utils";

export const CONTAINER_CLASS = "mx-auto w-full max-w-5xl px-4";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "nav";
}

export function Container({
  children,
  className,
  as: Tag = "div",
}: ContainerProps) {
  return <Tag className={cn(CONTAINER_CLASS, className)}>{children}</Tag>;
}
