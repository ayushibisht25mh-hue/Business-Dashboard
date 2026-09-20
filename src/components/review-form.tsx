"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Camera, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_PHOTOS = 3;
const MAX_FILE_SIZE = 1024 * 1024;

type ReviewFormProps = {
  salonId: string;
  bookingId: string;
  salonName: string;
};

export function ReviewForm({ salonId, bookingId, salonName }: ReviewFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handlePhotoSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (photos.length + files.length > MAX_PHOTOS) {
      setError(`You can add up to ${MAX_PHOTOS} photos.`);
      return;
    }

    setError("");

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload image files only.");
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("Each photo must be under 1 MB.");
        continue;
      }

      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

      setPhotos((current) => [...current, dataUrl]);
    }
  }

  function removePhoto(index: number) {
    setPhotos((current) => current.filter((_, i) => i !== index));
  }

  async function submitReview() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salonId,
          bookingId,
          rating,
          comment: comment.trim() || undefined,
          photos,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to submit review");
        return;
      }

      setSubmitted(true);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        Thanks for reviewing {salonName}!
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-900">Leave a review</p>

      <div className="mt-3 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => {
          const value = index + 1;
          const active = value <= (hoverRating || rating);

          return (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              className="rounded p-0.5 transition hover:scale-110"
              aria-label={`Rate ${value} stars`}
            >
              <Star
                className={cn(
                  "h-5 w-5",
                  active
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300"
                )}
              />
            </button>
          );
        })}
      </div>

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Share your experience..."
        rows={3}
        className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />

      <div className="mt-3">
        <div className="flex flex-wrap items-center gap-2">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt={`Upload preview ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white"
                aria-label="Remove photo"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {photos.length < MAX_PHOTOS && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-16 w-16 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-slate-400 transition hover:border-brand-400 hover:text-brand-600"
            >
              <Camera className="h-4 w-4" />
              <span className="mt-0.5 text-[10px] font-medium">Add</span>
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePhotoSelect}
        />

        <p className="mt-1.5 text-xs text-slate-400">
          Add up to {MAX_PHOTOS} photos (1 MB each)
        </p>
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      <Button
        size="sm"
        className="mt-3"
        onClick={submitReview}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit review"}
      </Button>
    </div>
  );
}
