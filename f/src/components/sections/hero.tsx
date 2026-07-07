"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/motion";
import { useContentData } from "@/hooks/use-content-data";
import { useTranslation } from "@/hooks/use-translation";
import { resolveMediaUrl } from "@/lib/media";

export function HeroSection() {
  const { data } = useContentData();
  const { t } = useTranslation();

  if (!data || !t) return null;

  const { personal } = data;
  const avatarUrl = resolveMediaUrl(personal.avatar);
  const initials = personal.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <section id="hero" className="py-16">
      <Container className="flex min-h-[80vh] flex-col items-center justify-center gap-6 text-center">
      <FadeIn delay={0.1}>
        <Avatar className="size-32 border-2 border-border">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={personal.name} />
          ) : null}
          <AvatarFallback className="text-3xl font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </FadeIn>

      <FadeIn delay={0.25}>
        <div className="space-y-2">
          <h1 className="font-bold sm:text-6xl">{personal.name}</h1>
          <p className="text-lg font-light tracking-wide text-muted-foreground sm:text-xl">
            {personal.title}
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.4}>
        <p className="max-w-lg text-muted-foreground">{personal.bio}</p>
      </FadeIn>

      <StaggerGroup
        className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground"
        trigger="mount"
        delay={0.55}
      >
        <StaggerItem direction="left">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4" />
            {personal.location}
          </span>
        </StaggerItem>
        <StaggerItem direction="up">
          <span className="flex items-center gap-1.5">
            <Mail className="size-4" />
            {personal.email}
          </span>
        </StaggerItem>
        <StaggerItem direction="right">
          <span className="flex items-center gap-1.5">
            <Phone className="size-4" />
            {personal.phone}
          </span>
        </StaggerItem>
      </StaggerGroup>

      <StaggerGroup
        className="flex gap-3"
        staggerDelay={0.15}
        trigger="mount"
        delay={0.85}
      >
        <StaggerItem direction="left">
          <Button nativeButton={false} render={<a href="#contact" />}>
            {t.hero.contactMe}
          </Button>
        </StaggerItem>
        <StaggerItem direction="right">
          <Button
            variant="outline"
            nativeButton={false}
            render={<a href="#projects" />}
          >
            {t.hero.viewProjects}
          </Button>
        </StaggerItem>
      </StaggerGroup>
      </Container>
    </section>
  );
}
