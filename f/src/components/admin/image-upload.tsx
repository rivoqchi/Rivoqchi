"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { isLocalUpload, resolveMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (url: string | undefined) => void;
  disabled?: boolean;
  hint?: string;
  aspectClassName?: string;
}

function getFilenameFromUrl(url: string): string | null {
  const match = url.match(/\/uploads\/gallery\/([^/?#]+)$/);
  return match?.[1] ?? null;
}

export function ImageUpload({
  label,
  value,
  onChange,
  disabled,
  hint = "Bosing yoki sudrab tashlang · JPG, PNG, WebP · max 5MB",
  aspectClassName = "aspect-square max-w-[200px]",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length || disabled || uploading) return;

    const file = Array.from(fileList).find((item) => item.type.startsWith("image/"));
    if (!file) {
      setError("Faqat rasm fayllari qabul qilinadi (JPG, PNG, WebP)");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const [url] = await api.uploadGalleryImages([file]);
      if (!url) throw new Error("Yuklash javobi bo'sh");

      const previousFilename = value ? getFilenameFromUrl(value) : null;
      onChange(url);

      if (previousFilename) {
        try {
          await api.deleteGalleryImage(previousFilename);
        } catch {
          // Old file cleanup is best-effort
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yuklashda xatolik yuz berdi");
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  async function removeImage() {
    const previousFilename = value ? getFilenameFromUrl(value) : null;
    onChange(undefined);

    if (!previousFilename) return;

    try {
      await api.deleteGalleryImage(previousFilename);
    } catch {
      // Image is already removed from form state
    }
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {value ? (
        <div className={cn("group relative overflow-hidden rounded-xl border bg-muted", aspectClassName)}>
          <Image
            src={resolveMediaUrl(value) ?? value}
            alt=""
            fill
            className="object-cover"
            unoptimized={isLocalUpload(value)}
          />
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute right-2 top-2 size-8 bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
            onClick={() => void removeImage()}
            disabled={disabled || uploading}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (!disabled && !uploading) inputRef.current?.click();
            }
          }}
          onClick={() => {
            if (!disabled && !uploading) inputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            void handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex min-h-[148px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors",
            aspectClassName,
            dragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40",
            (disabled || uploading) && "pointer-events-none opacity-60",
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Yuklanmoqda...</p>
            </>
          ) : (
            <>
              <Upload className="size-8 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">Rasm yuklash</p>
              <p className="text-center text-xs text-muted-foreground">{hint}</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
