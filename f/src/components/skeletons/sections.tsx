import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";
import { Separator } from "@/components/ui/separator";
import { SKILL_CATEGORY_META } from "@/components/sections/skills/category-meta";
import { cn } from "@/lib/utils";

const SKELETON_SKILL_LAYOUT = [
  { category: "frontend" as const, skillCount: 4 },
  { category: "backend" as const, skillCount: 2 },
  { category: "tools" as const, skillCount: 2 },
];

function SectionTitleSkeleton({
  className,
  width = "w-44",
}: {
  className?: string;
  width?: string;
}) {
  return (
    <Skeleton
      className={cn("h-10", width, className)}
      aria-hidden
    />
  );
}

function ProjectCardSkeleton() {
  return (
    <article className="flex w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 sm:w-[340px]">
      <Skeleton className="aspect-[16/10] w-full shrink-0 rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="mt-1 h-4 w-full" />
          <Skeleton className="mt-1 h-4 w-4/5" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-14 rounded-full" />
          ))}
        </div>
        <div className="mt-auto flex items-center gap-4">
          <Skeleton className="h-3.5 w-10" />
          <Skeleton className="h-3.5 w-10" />
        </div>
      </div>
    </article>
  );
}

function SkillCategoryCardSkeleton({
  className,
  skillCount = 3,
}: {
  className?: string;
  skillCount?: number;
}) {
  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10",
        className,
      )}
    >
      <header className="border-b border-foreground/[0.06] px-5 pb-4 pt-5 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-11 rounded-xl" />
            <div>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="mt-1.5 h-3 w-28" />
            </div>
          </div>
          <div className="text-right">
            <Skeleton className="ml-auto h-8 w-12" />
            <Skeleton className="mt-1.5 ml-auto h-3 w-14" />
          </div>
        </div>
      </header>
      <ul className="flex flex-1 flex-col gap-4 p-5 sm:gap-5 sm:p-6">
        {Array.from({ length: skillCount }).map((_, i) => (
          <li key={i} className="space-y-2.5 rounded-xl p-3 ring-1 ring-foreground/[0.06]">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-7 w-10 rounded-md" />
            </div>
            <Skeleton className="h-11 w-full rounded-xl" />
          </li>
        ))}
      </ul>
    </article>
  );
}

function IPhoneGallerySkeleton() {
  return (
    <div className="relative isolate z-10 w-full max-w-[360px] sm:max-w-[380px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-[4rem] bg-primary/[0.07] blur-2xl dark:bg-primary/[0.12]"
      />

      <div className="relative mx-auto w-full max-w-[360px] sm:max-w-[380px]">
        <div
          aria-hidden
          className="absolute -left-[4px] top-[19%] h-9 w-[4px] rounded-l-md bg-muted"
        />
        <div
          aria-hidden
          className="absolute -left-[4px] top-[28%] h-14 w-[4px] rounded-l-md bg-muted"
        />
        <div
          aria-hidden
          className="absolute -left-[4px] top-[40%] h-14 w-[4px] rounded-l-md bg-muted"
        />
        <div
          aria-hidden
          className="absolute -right-[4px] top-[32%] h-[4.5rem] w-[4px] rounded-r-md bg-muted"
        />

        <div className="relative rounded-[3.25rem] border-[7px] border-muted bg-muted/40 p-[11px] ring-1 ring-foreground/10">
          <div className="pointer-events-none absolute inset-x-0 top-[22px] z-20 flex justify-center">
            <Skeleton className="h-[30px] w-[118px] rounded-full" />
          </div>

          <Skeleton className="aspect-[9/19.5] w-full rounded-[2.6rem]" />

          <div className="pointer-events-none absolute bottom-[6px] left-1/2 z-10 h-[5px] w-[128px] -translate-x-1/2 rounded-full bg-foreground/10" />
        </div>
      </div>
    </div>
  );
}

function ContactRowSkeleton() {
  return (
    <div>
      <Skeleton className="mb-1 h-3 w-16" />
      <div className="flex items-center gap-2">
        <Skeleton className="size-4 shrink-0 rounded-sm" />
        <Skeleton className="h-7 w-52 max-w-full" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section id="hero" className="py-16">
      <Container className="flex min-h-[80vh] flex-col items-center justify-center gap-6 text-center">
        <Skeleton className="size-32 shrink-0 rounded-full border-2 border-border" />

        <div className="space-y-2">
          <Skeleton className="mx-auto h-12 w-56 sm:h-16 sm:w-72" />
          <Skeleton className="mx-auto h-6 w-40 sm:h-7 sm:w-52" />
        </div>

        <div className="w-full max-w-lg space-y-2">
          <Skeleton className="mx-auto h-4 w-full" />
          <Skeleton className="mx-auto h-4 w-4/5" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Skeleton className="size-4 shrink-0 rounded-sm" />
              <Skeleton className="h-4 w-28 sm:w-32" />
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </Container>
    </section>
  );
}

export function AboutSkeleton() {
  return (
    <section id="about" className="relative overflow-x-clip py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[480px] -translate-y-1/2 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,var(--foreground)_0%,transparent_100%)] opacity-[0.03]"
      />

      <Container>
        <div className="mb-10 max-w-2xl sm:mb-14">
          <SectionTitleSkeleton className="mb-3" width="w-44" />
          <Skeleton className="h-6 w-56 sm:h-7 sm:w-64" />
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="order-2 lg:order-1">
            <figure className="relative max-w-xl space-y-6 sm:space-y-7">
              <Skeleton className="absolute -left-1 top-0 h-16 w-12 sm:-left-2 sm:h-20 sm:w-14" />
              <blockquote className="relative border-l border-foreground/15 pl-6 sm:pl-8">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-11/12" />
                </div>
              </blockquote>

              <div className="space-y-5 pl-6 sm:space-y-6 sm:pl-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[92%]" />
                  </div>
                ))}
              </div>
            </figure>
          </div>

          <div className="order-1 flex justify-center lg:order-2 lg:justify-center xl:justify-end">
            <IPhoneGallerySkeleton />
          </div>
        </div>
      </Container>
    </section>
  );
}

export function ExperienceSkeleton() {
  return (
    <section id="experience" className="py-20">
      <Container>
        <SectionTitleSkeleton className="mb-10 sm:mb-12" width="w-48" />

        <div className="relative">
          <div
            aria-hidden
            className="absolute top-3 bottom-3 left-[11px] w-px bg-gradient-to-b from-foreground/20 via-foreground/10 to-transparent"
          />

          <div className="relative space-y-0">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "relative grid grid-cols-[24px_minmax(0,1fr)] gap-5 sm:gap-8",
                  i < 1 && "pb-10 sm:pb-12",
                )}
              >
                <div className="relative flex justify-center pt-2">
                  <Skeleton
                    className={cn(
                      "relative z-10 rounded-full ring-4 ring-background",
                      i === 0 ? "size-3" : "size-2.5",
                    )}
                  />
                </div>

                <article className="min-w-0 rounded-2xl p-4 sm:p-5 sm:pl-6">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <div className="min-w-0 space-y-1">
                      <Skeleton className="h-7 w-52 sm:h-8" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                    <Skeleton className="h-3 w-28 shrink-0" />
                  </div>

                  <div className="mb-5 max-w-2xl space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <Skeleton key={j} className="h-6 w-20 rounded-full" />
                    ))}
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function SkillsSkeleton() {
  return (
    <section id="skills" className="py-20">
      <Container>
        <div className="mb-10 flex items-end justify-between gap-4 sm:mb-12">
          <SectionTitleSkeleton width="w-36" />
          <Skeleton className="h-9 w-14" />
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[min(100%,640px)]">
          <Skeleton className="absolute inset-0 rounded-full opacity-40" />
          {Array.from({ length: 8 }).map((_, index) => {
            const angle = (index / 8) * Math.PI * 2;
            const x = 50 + 38 * Math.cos(angle - Math.PI / 2);
            const y = 50 + 38 * Math.sin(angle - Math.PI / 2);
            return (
              <Skeleton
                key={index}
                className="absolute h-7 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ left: `${x}%`, top: `${y}%` }}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function ProjectsSkeleton() {
  return (
    <section id="projects" className="overflow-hidden py-20">
      <Container>
        <SectionTitleSkeleton className="mb-6" width="w-40" />

        <div className="relative w-full min-w-0 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent" />

          <Skeleton className="absolute top-1/2 left-0 z-20 size-7 -translate-y-1/2 rounded-[min(var(--radius-md),12px)] shadow-md" />
          <Skeleton className="absolute top-1/2 right-0 z-20 size-7 -translate-y-1/2 rounded-[min(var(--radius-md),12px)] shadow-md" />

          <div className="flex w-full min-w-0 items-stretch gap-4 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function ContactSkeleton() {
  return (
    <section id="contact" className="py-20">
      <Container>
        <div className="mb-10 max-w-2xl">
          <SectionTitleSkeleton className="mb-3" width="w-36" />
          <Skeleton className="h-5 w-56" />
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          <div className="space-y-8">
            <div className="space-y-6">
              <ContactRowSkeleton />
              <ContactRowSkeleton />
            </div>

            <Separator />

            <ul className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i}>
                  <Skeleton className="h-[38px] w-28 rounded-full" />
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-[120px] w-full rounded-md" />
            </div>
            <Skeleton className="h-9 w-full rounded-lg sm:w-32" />
          </div>
        </div>
      </Container>
    </section>
  );
}
