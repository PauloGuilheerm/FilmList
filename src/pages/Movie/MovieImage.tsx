import { useMemo } from "react";

export default function MovieImage({ backdrop_path, title }: { backdrop_path: string, title: string }) {

  const backdropUrl = useMemo(() => {
    if (!backdrop_path) return null;

    const path = backdrop_path;
    return {
      default: `https://image.tmdb.org/t/p/w780${path}`,
      srcSet: `
        https://image.tmdb.org/t/p/w300${path} 300w,
        https://image.tmdb.org/t/p/w500${path} 500w,
        https://image.tmdb.org/t/p/w780${path} 780w
      `,
    };
  }, [backdrop_path]);

  return <figure className="w-full overflow-hidden rounded-2xl shadow-lg lg:w-2/3">
    {backdropUrl ? (
      <img
        src={backdropUrl.default}
        srcSet={backdropUrl.srcSet}
        sizes="(max-width: 1024px) 100vw, 100vw"
        alt={`Poster do filme ${title}`}
        loading="lazy"
        className="w-full object-cover"
        style={{
          height: 'calc(100vh)',
          maxHeight: '770px',
          minHeight: '320px',
        }}
      />
    ) : (
      <div className="flex aspect-video w-full items-center justify-center bg-slate-700 text-sm text-slate-300">
        Poster indisponível
      </div>
    )}
    <figcaption className="sr-only">{title}</figcaption>
  </figure>
}