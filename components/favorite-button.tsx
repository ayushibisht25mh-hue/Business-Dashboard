"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export function FavoriteButton({
  salonId,
  initialFavorited,
  isLoggedIn,
}: {
  salonId: string;
  initialFavorited: boolean;
  isLoggedIn: boolean;
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!isLoggedIn) {
      window.location.href = `/login?callbackUrl=${window.location.pathname}`;
      return;
    }
    setLoading(true);
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salonId }),
    });
    const data = await res.json();
    setFavorited(data.favorited);
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg backdrop-blur-sm transition hover:scale-105 active:scale-95 ${
        favorited
          ? "bg-red-500 text-white"
          : "bg-white/90 text-slate-600 hover:text-red-500"
      }`}
    >
      <Heart
        className={`h-5 w-5 transition ${favorited ? "fill-white" : ""}`}
      />
    </button>
  );
}
