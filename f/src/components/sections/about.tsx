"use client";

import { IPhoneGallery } from "@/components/about/iphone-gallery";
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/motion";
import { Container } from "@/components/layout/container";
import { getAlternateDirection } from "@/lib/motion";
import { resolveAboutGallery } from "@/lib/about-gallery";
import { useContentData } from "@/hooks/use-content-data";
import { useTranslation } from "@/hooks/use-translation";

export function AboutSection() {
  const { data } = useContentData();
  const { t } = useTranslation();

  if (!data || !t) return null;

  const { personal } = data;
  const galleryImages = resolveAboutGallery(personal.gallery);
  const aboutDetails = personal.aboutDetails ?? [];

  return (
    <section id="about" className="relative overflow-x-clip py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[480px] -translate-y-1/2 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,var(--foreground)_0%,transparent_100%)] opacity-[0.03]"
      />

      <Container>
        <ScrollReveal direction="left">
          <div className="mb-10 max-w-2xl sm:mb-14">
            <h2 className="mb-3">{t.about.title}</h2>
            <p className="text-base text-muted-foreground sm:text-lg">
              {personal.title}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="order-2 lg:order-1">
            <ScrollReveal direction="up" delay={0.08}>
              <figure className="relative max-w-xl space-y-6 sm:space-y-7">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-1 top-0 font-heading text-7xl leading-none text-foreground/[0.06] sm:-left-2 sm:text-8xl"
                >
                  &ldquo;
                </span>
                <blockquote className="relative border-l border-foreground/15 pl-6 sm:pl-8">
                  <p className="text-base leading-[1.8] text-foreground/90 sm:text-lg sm:leading-[1.85]">
                    {personal.bio}
                  </p>
                </blockquote>

                {aboutDetails.length > 0 && (
                  <StaggerGroup className="space-y-5 pl-6 sm:space-y-6 sm:pl-8">
                    {aboutDetails.map((paragraph, index) => (
                      <StaggerItem
                        key={index}
                        direction={getAlternateDirection(index)}
                      >
                        <p className="text-[15px] leading-[1.8] text-muted-foreground sm:text-base sm:leading-[1.85]">
                          {paragraph}
                        </p>
                      </StaggerItem>
                    ))}
                  </StaggerGroup>
                )}
              </figure>
            </ScrollReveal>
          </div>

          <ScrollReveal
            direction="right"
            delay={0.12}
            className="order-1 flex justify-center lg:sticky lg:top-24 lg:order-2 lg:justify-center xl:justify-end"
          >
            <div className="relative isolate z-10 w-full max-w-[360px] sm:max-w-[380px]">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-6 rounded-[4rem] bg-primary/[0.07] blur-2xl dark:bg-primary/[0.12]"
              />
              <IPhoneGallery images={galleryImages} size="lg" className="relative z-10" />
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
