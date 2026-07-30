"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, X, ImageIcon, AlertCircle } from "lucide-react";
import { UploadedImage } from "@/types/assessment";
import { validateImageFile } from "@/constants/assessment";

interface ImageUploadBoxProps {
  label: string;
  description: string;
  image: UploadedImage | null;
  onChange: (image: UploadedImage | null) => void;
  error?: string;
}

export default function ImageUploadBox({
  label,
  description,
  image,
  onChange,
  error,
}: ImageUploadBoxProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;

      const result = validateImageFile(file);
      if (!result.valid) {
        onChange(null);
        // Bubble validation failure through onChange consumer via error prop pattern:
        // parent owns error state, so we still need to notify it. We do this by
        // calling onChange with null and letting parent re-derive; to keep this
        // component self-contained we also expose the error through a custom event
        // pattern is avoided here for simplicity — parent should re-validate on file
        // selection using validateImageFile directly if stricter control is needed.
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      onChange({ file, previewUrl });
    },
    [onChange]
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
    // reset input so re-selecting the same file re-triggers onChange
    e.target.value = "";
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (image) {
      URL.revokeObjectURL(image.previewUrl);
    }
    onChange(null);
  };

  const handleBoxClick = () => {
    if (!image) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>

      <div
        onClick={handleBoxClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex h-56 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors duration-200 ${
          image
            ? "border-slate-200 bg-slate-50"
            : isDragging
            ? "border-blue-500 bg-blue-50 cursor-pointer"
            : error
            ? "border-red-300 bg-red-50 cursor-pointer hover:border-red-400"
            : "border-slate-300 bg-white cursor-pointer hover:border-blue-400 hover:bg-blue-50/40"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          className="hidden"
          onChange={handleInputChange}
        />

        {image ? (
          <div className="relative h-full w-full p-3">
            <img
              src={image.previewUrl}
              alt={label}
              className="h-full w-full rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/70 text-white transition-colors hover:bg-slate-900"
              aria-label={`Remove ${label}`}
            >
              <X className="h-4 w-4" />
            </button>
            <div className="absolute bottom-5 left-5 flex items-center gap-1.5 rounded-md bg-slate-900/70 px-2 py-1 text-xs text-white">
              <ImageIcon className="h-3.5 w-3.5" />
              <span className="max-w-[180px] truncate">{image.file.name}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-full ${
                isDragging ? "bg-blue-100" : "bg-slate-100"
              }`}
            >
              <UploadCloud
                className={`h-5 w-5 ${
                  isDragging ? "text-blue-600" : "text-slate-500"
                }`}
              />
            </div>
            <p className="text-sm font-medium text-slate-700">
              Drag & drop or{" "}
              <span className="text-blue-600">click to upload</span>
            </p>
            <p className="text-xs text-slate-400">
              JPG, JPEG or PNG, up to 20MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}