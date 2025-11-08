import type { MouseEvent } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import Rating from "./Rating";

type CardProps = {
  title: string;
  rating: number;
  posterUrl?: string;
  onToggleFavorite: () => void;
  onFilmClick: (index: number) => void;
  isFavorite?: boolean;
  index: number;
};

export default function Card({
  title,
  rating,
  posterUrl,
  onToggleFavorite,
  isFavorite = false,
  onFilmClick,
  index
}: CardProps) {
  const handleToggleFavorite = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onToggleFavorite();
  };

  return (
    <div
      className="
      group relative w-[190px] rounded-xl bg-[#334155] 
      shadow-md ring-1 ring-black/5 overflow-hidden
      transition-all duration-300 hover:scale-105 cursor-pointer"
      aria-label={`Filme: ${title}`}
      tabIndex={index}
      onClick={() => onFilmClick(index)}
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
      </div>

      <div className="flex flex-col items-start justify-start gap-2 bg-[#334155] pb-3 ps-2 pt-2">
        <div className="min-w-0">
          <p className="truncate text-[12px] font-semibold text-white" title={title}>{title}</p>
        </div>

        <Rating rating={rating} />
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-xl ring-0 transition group-hover:ring-2 group-hover:ring-white/10" />
    </div>
  );
}
