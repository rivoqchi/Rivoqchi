"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Code,
  ExternalLink,
  Link,
  Loader2,
  Mail,
  Phone,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleAccountField } from "@/components/contact/google-account-field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollReveal } from "@/components/motion";
import { Container } from "@/components/layout/container";
import { useContentData } from "@/hooks/use-content-data";
import { useTranslation } from "@/hooks/use-translation";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Code,
  linkedin: Link,
  send: Send,
};

export function ContactSection() {
  const { data } = useContentData();
  const { t } = useTranslation();
  const [googleAccount, setGoogleAccount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  if (!data || !t) return null;

  const { personal } = data;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      await api.submitContact({ googleAccount, purpose });
      setFeedback({ type: "success", text: t.contact.success });
      sessionStorage.setItem("cv-google-account-hint", googleAccount);
      sessionStorage.removeItem("cv-google-account-cleared");
      setGoogleAccount("");
      setPurpose("");
    } catch (err) {
      const text =
        err instanceof ApiError ? err.message : t.contact.error;
      setFeedback({ type: "error", text });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20">
      <Container>
        <ScrollReveal direction="up">
          <div className="mb-10 max-w-2xl">
            <h2 className="mb-3">{t.contact.title}</h2>
            <p className="text-muted-foreground">{t.contact.formTitle}</p>
          </div>
        </ScrollReveal>

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          <ScrollReveal direction="left" className="space-y-8">
            <div className="space-y-6">
              <ContactRow
                label={t.contact.email}
                href={`mailto:${personal.email}`}
                value={personal.email}
                icon={Mail}
              />
              <ContactRow
                label={t.contact.phone}
                href={`tel:${personal.phone}`}
                value={personal.phone}
                icon={Phone}
              />
            </div>

            {personal.social.length > 0 && (
              <>
                <Separator />
                <ul className="flex flex-wrap gap-2">
                  {personal.social.map((link) => {
                    const Icon = iconMap[link.icon] ?? ExternalLink;
                    return (
                      <li key={link.platform}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                        >
                          <Icon className="size-4 text-muted-foreground" />
                          {link.platform}
                          <ArrowUpRight className="size-3.5 text-muted-foreground" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </ScrollReveal>

          <ScrollReveal direction="right">
            <form onSubmit={handleSubmit} className="space-y-6">
              <GoogleAccountField
                label={t.contact.googleAccount}
                placeholder={t.contact.googleAccountPlaceholder}
                clearLabel={t.contact.googleAccountClear}
                value={googleAccount}
                onChange={setGoogleAccount}
                required
              />

              <div className="space-y-3">
                <Label htmlFor="purpose">{t.contact.purpose}</Label>
                <Textarea
                  id="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder={t.contact.purposePlaceholder}
                  rows={4}
                  className="min-h-[120px] resize-none border-0 bg-muted shadow-none focus-visible:ring-2"
                  required
                />
              </div>

              {feedback && (
                <div
                  role="status"
                  className={cn(
                    "flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm",
                    feedback.type === "success"
                      ? "bg-muted text-foreground"
                      : "bg-destructive/10 text-destructive",
                  )}
                >
                  {feedback.type === "success" ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                  ) : (
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  )}
                  <span>{feedback.text}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                {submitting ? "..." : t.contact.submit}
              </Button>
            </form>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}

function ContactRow({
  label,
  value,
  href,
  icon: Icon,
}: {
  label: string;
  value: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="group">
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      <a
        href={href}
        className="inline-flex items-center gap-2 text-lg font-medium transition-colors hover:text-muted-foreground"
      >
        <Icon className="size-4 text-muted-foreground" />
        <span className="break-all">{value}</span>
        <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
      </a>
    </div>
  );
}
