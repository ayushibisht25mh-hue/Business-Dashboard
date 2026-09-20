export const DEFAULT_LOCATION = {
  lat: 28.6139,
  lng: 77.209,
  label: "New Delhi",
};

export const NEARBY_RADIUS_KM = 50;

export function parseCoords(lat?: string, lng?: string) {
  const parsedLat = lat ? parseFloat(lat) : NaN;
  const parsedLng = lng ? parseFloat(lng) : NaN;

  if (
    Number.isFinite(parsedLat) &&
    Number.isFinite(parsedLng) &&
    parsedLat >= -90 &&
    parsedLat <= 90 &&
    parsedLng >= -180 &&
    parsedLng <= 180
  ) {
    return { lat: parsedLat, lng: parsedLng, fromDevice: true };
  }

  return {
    lat: DEFAULT_LOCATION.lat,
    lng: DEFAULT_LOCATION.lng,
    fromDevice: false,
  };
}

export function buildHomeQuery(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const qs = search.toString();
  return qs ? `/?${qs}` : "/";
}
