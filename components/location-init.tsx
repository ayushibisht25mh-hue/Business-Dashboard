"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const STORAGE_KEY = "preppy:last-location";

export function LocationInit() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    if (searchParams.get("lat") && searchParams.get("lng")) return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { lat, lng } = JSON.parse(saved);
        if (typeof lat === "number" && typeof lng === "number") {
          applyCoords(lat, lng);
          return;
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ lat, lng }));
        applyCoords(lat, lng);
      },
      () => {
        // Permission denied — keep default Delhi coords
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 }
    );

    function applyCoords(lat: number, lng: number) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("lat", lat.toFixed(6));
      params.set("lng", lng.toFixed(6));
      router.replace(`/?${params.toString()}`, { scroll: false });
    }
  }, [router, searchParams]);

  return null;
}
