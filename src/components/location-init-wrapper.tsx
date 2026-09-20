"use client";

import { Suspense } from "react";
import { LocationInit } from "./location-init";

export function LocationInitWrapper() {
  return (
    <Suspense fallback={null}>
      <LocationInit />
    </Suspense>
  );
}
