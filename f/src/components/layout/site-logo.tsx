"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useContentData } from "@/hooks/use-content-data";
import { isLocalUpload, resolveMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

interface SiteLogoProps {
  className?: string;
  showName?: boolean;
}

export function SiteLogo({ className, showName = true }: SiteLogoProps) {
  const { data, isLoading } = useContentData();

  if (isLoading || !data) {
    return (
      <span className={cn("flex min-w-0 items-center gap-2.5", className)}>
        <Skeleton className="size-8 shrink-0 rounded-full" />
        {showName && <Skeleton className="h-6 w-28 sm:w-32" />}
      </span>
    );
  }

  const { personal } = data;
  const avatarUrl = resolveMediaUrl(personal.avatar);
  const initials = personal.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <span className={cn("flex min-w-0 items-center gap-2.5", className)}>
      {avatarUrl ? (
        <span className="relative size-8 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
          <Image
            src={avatarUrl}
            alt={`${personal.name} logo`}
            width={32}
            height={32}
            className="size-full object-cover"
            unoptimized={isLocalUpload(avatarUrl)}
            priority
          />
        </span>
      ) : (
        <Avatar className="size-8 shrink-0">
          <AvatarImage src={avatarUrl} alt={personal.name} />
          <AvatarFallback className="text-xs font-semibold">{initials}</AvatarFallback>
        </Avatar>
      )}

      {showName && (
        <span className="min-w-0 font-heading text-base font-semibold leading-tight tracking-tight sm:text-lg">
          <span className="line-clamp-1">{personal.name}</span>
        </span>
      )}
    </span>
  );
}
