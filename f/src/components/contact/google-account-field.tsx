"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getGoogleClientId,
  loadGoogleIdentityScript,
  parseGoogleCredentialEmail,
} from "@/lib/google-identity";
import { cn } from "@/lib/utils";

const SESSION_HINT_KEY = "cv-google-account-hint";
const USER_CLEARED_KEY = "cv-google-account-cleared";

interface GoogleAccountFieldProps {
  id?: string;
  label: string;
  placeholder: string;
  clearLabel: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function GoogleAccountField({
  id = "google-account",
  label,
  placeholder,
  clearLabel,
  value,
  onChange,
  required,
}: GoogleAccountFieldProps) {
  const [autoFilled, setAutoFilled] = useState(false);
  const userClearedRef = useRef(false);
  const autofillAttemptedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    userClearedRef.current = sessionStorage.getItem(USER_CLEARED_KEY) === "1";
  }, []);

  useEffect(() => {
    if (value || userClearedRef.current || autofillAttemptedRef.current) return;

    const sessionHint = sessionStorage.getItem(SESSION_HINT_KEY);
    if (sessionHint) {
      onChange(sessionHint);
      setAutoFilled(true);
      autofillAttemptedRef.current = true;
      return;
    }

    const clientId = getGoogleClientId();
    if (!clientId) {
      autofillAttemptedRef.current = true;
      return;
    }

    let cancelled = false;

    const requestGoogleAccount = async () => {
      try {
        await loadGoogleIdentityScript();
        if (cancelled || !window.google?.accounts?.id) return;

        window.google.accounts.id.initialize({
          client_id: clientId,
          auto_select: true,
          cancel_on_tap_outside: false,
          itp_support: true,
          context: "signin",
          callback: (response) => {
            if (userClearedRef.current || cancelled) return;

            const email = parseGoogleCredentialEmail(response.credential);
            if (!email) return;

            onChange(email);
            setAutoFilled(true);
            sessionStorage.setItem(SESSION_HINT_KEY, email);
            sessionStorage.removeItem(USER_CLEARED_KEY);
          },
        });

        window.google.accounts.id.prompt((notification) => {
          if (cancelled) return;

          autofillAttemptedRef.current = true;

          if (
            notification.isNotDisplayed() ||
            notification.isSkippedMoment()
          ) {
            return;
          }
        });
      } catch {
        autofillAttemptedRef.current = true;
      }
    };

    void requestGoogleAccount();

    return () => {
      cancelled = true;
      window.google?.accounts?.id?.cancel();
    };
  }, [onChange, value]);

  const handleChange = (next: string) => {
    if (autoFilled && next !== value) {
      setAutoFilled(false);
    }
    onChange(next);
  };

  const handleClear = () => {
    userClearedRef.current = true;
    autofillAttemptedRef.current = true;
    sessionStorage.setItem(USER_CLEARED_KEY, "1");
    sessionStorage.removeItem(SESSION_HINT_KEY);
    setAutoFilled(false);
    onChange("");
    window.google?.accounts?.id?.cancel();
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "h-10 border-0 bg-muted pr-10 shadow-none focus-visible:ring-2",
            autoFilled && "ring-1 ring-emerald-500/35",
          )}
          required={required}
        />
        {value ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-background/80 hover:text-foreground"
            aria-label={clearLabel}
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
