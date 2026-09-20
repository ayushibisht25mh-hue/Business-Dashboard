import Image from "next/image";

function isDataUrl(url: string) {
  return url.startsWith("data:");
}

export function ReviewPhotos({ photos }: { photos: string[] }) {
  if (photos.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {photos.map((photo, index) => (
        <a
          key={index}
          href={photo}
          target="_blank"
          rel="noopener noreferrer"
          className="relative h-20 w-20 overflow-hidden rounded-xl border border-slate-200 transition hover:opacity-90 sm:h-24 sm:w-24"
        >
          {isDataUrl(photo) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={`Review photo ${index + 1}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              src={photo}
              alt={`Review photo ${index + 1}`}
              fill
              className="object-cover"
              sizes="96px"
            />
          )}
        </a>
      ))}
    </div>
  );
}
