"use client";

import { ImagePlus, X, Send } from "lucide-react";
import { useRef } from "react";
import type { ImageAttachment } from "@/types/chat";

type PromptInputProps = {
  onSubmit: () => void;
  onAddImages: (files: FileList | File[]) => void;
  onRemoveImage: (index: number) => void;
  images: ImageAttachment[];
  loading: boolean;
};

export function PromptInput({
  onSubmit,
  onAddImages,
  onRemoveImage,
  images,
  loading,
}: PromptInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onAddImages(event.target.files);
      event.target.value = "";
    }
  };

  return (
    <div className="rounded-2xl border border-white/[0.1] bg-[#111113] p-4 shadow-2xl">
      {images.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-3">
          {images.map((image, index) => (
            <div
              key={`${image.file.name}-${index}`}
              className="relative overflow-hidden rounded-xl border border-white/[0.1] bg-black"
            >
              {image.preview ? (
                <img
                  src={image.preview}
                  alt={image.file.name}
                  className="h-24 w-24 object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center text-xs text-white/60">
                  TIFF
                </div>
             )}

              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.tif,.tiff,image/png,image/jpeg,image/tiff"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-white/[0.1] px-4 py-3 text-sm text-white/80 transition hover:bg-white/[0.06] disabled:opacity-50"
        >
          <ImagePlus size={18} />
          Add Image
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || images.length === 0}
          className="ml-auto flex items-center gap-2 rounded-xl bg-[#0A84FF] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#0077ED] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={17} />
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>
    </div>
  );
}
