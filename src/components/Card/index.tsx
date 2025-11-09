import type { MouseEvent, ReactNode } from "react";
import { useMemo } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart, FaTrash } from "react-icons/fa";
import Rating from "./Rating";

type CardProps = {
  title: string;
  rating: number;
  posterUrl?: string;
  onToggleFavorite: () => void;
  onMovieClick: (index: number) => void;
  isFavorite?: boolean;
  index: number;
  cardAction: 'favorite' | 'delete';
  highlightTerm?: string;
};

export default function Card({
  title,
  rating,
  posterUrl,
  onToggleFavorite,
  isFavorite = false,
  onMovieClick,
  index,
  cardAction,
  highlightTerm
}: CardProps) {
  const sanitizedHighlight = highlightTerm?.trim();

  const highlightedTitle = useMemo<ReactNode>(() => {
    if (!sanitizedHighlight) {
      return title;
    }

    const escapedTerm = sanitizedHighlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedTerm})`, "gi");
    const parts = title.split(regex);

    return parts.map((part, partIndex) => {
      const isMatch = part.toLowerCase() === sanitizedHighlight.toLowerCase();

      if (isMatch) {
        return (
          <span
            key={`highlight-${part}-${partIndex}`}
            className="bg-yellow-400 p-1 text-black"
          >
            {part}
          </span>
        );
      }

      return <span key={`text-${part}-${partIndex}`}>{part}</span>;
    });
  }, [sanitizedHighlight, title]);

  const handleToggleFavorite = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onToggleFavorite();
  };

  return (
    <div
      className="
      group relative w-[190px] rounded-xl bg-[#334155] 
      shadow-md ring-1 ring-black/5 overflow-hidden
      transition-all duration-300 hover:scale-105 cursor-pointer h-[270px]"
      aria-label={`Filme: ${title}`}
      tabIndex={index}
      onClick={() => onMovieClick(index)}
    >
      <div className="relative h-[190px] w-full bg-[#526075]">
        {posterUrl ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${posterUrl}`}
            alt={`Poster do filme ${title}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full select-none items-center justify-center text-[11px] text-white/60">
            Poster do Filme
          </div>
        )}

        {cardAction === 'delete' ? (
          <button
            type="button"
            aria-label={"deletar dos favoritos"}
            onClick={handleToggleFavorite}
            className="
          absolute right-2 top-2 z-20 inline-grid h-7 w-7 place-items-center rounded-full bg-black/80 backdrop-blur-sm ring-1 ring-white/20 transition
          hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/80 cursor-pointer"
          >
            {<FaTrash color="white" size={10} />}
          </button>
        ) : (
          <button
            type="button"
            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            onClick={handleToggleFavorite}
            className="
          absolute right-2 top-2 z-20 inline-grid h-7 w-7 place-items-center rounded-full bg-black/80 backdrop-blur-sm ring-1 ring-white/20 transition
          hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/80 cursor-pointer"
          >
            {isFavorite ? <FaHeart color="red" size={10} /> : <CiHeart color="red" size={13} />}
          </button>
        )}
      </div>

      <div className="flex flex-col items-start justify-start gap-2 bg-[#334155] pb-3 ps-2 pt-2">
        <div className="min-w-0">
          <p className="truncate text-[12px] font-semibold text-white" title={title}>
            {highlightedTitle}
          </p>
        </div>

        <Rating rating={rating} />
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-xl ring-0 transition group-hover:ring-2 group-hover:ring-white/10" />
    </div>
  );
}
