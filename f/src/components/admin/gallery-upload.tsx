"use client";

import { useRef, useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface GalleryUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
  label?: string;
  hint?: string;
  previewAspectClassName?: string;
}

function getFilenameFromUrl(url: string): string | null {
  const match = url.match(/\/uploads\/gallery\/([^/?#]+)$/);
  return match?.[1] ?? null;
}

export function GalleryUpload({
  images,
  onChange,
  disabled,
  label = "Galereya rasmlari",
  hint = "Bosing yoki sudrab tashlang · JPG, PNG, WebP · har biri max 5MB",
  previewAspectClassName = "aspect-[9/16]",
}: GalleryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length || disabled || uploading) return;

    const files = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (!files.length) {
      setError("Faqat rasm fayllari qabul qilinadi (JPG, PNG, WebP)");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const urls = await api.uploadGalleryImages(files);
      onChange([...images, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yuklashda xatolik yuz berdi");
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  async function removeImage(url: string) {
    onChange(images.filter((image) => image !== url));

    const filename = getFilenameFromUrl(url);
    if (!filename) return;

    try {
      await api.deleteGalleryImage(filename);
    } catch {
      // Gallery entry is already removed from form state
    }
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

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
            <p className="mt-2 text-sm font-medium">Rasmlarni yuklash</p>
            <p className="text-center text-xs text-muted-foreground">{hint}</p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((url) => (
            <div
              key={url}
              className={cn(
                "group relative overflow-hidden rounded-lg border bg-muted",
                previewAspectClassName,
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute right-2 top-2 size-8 bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
                onClick={() => void removeImage(url)}
                disabled={disabled || uploading}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
