import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";

type CardProps = {
  title: string;
  rating: number | string;
  posterUrl?: string;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
};

export default function Card({
  title,
  rating,
  posterUrl,
  onToggleFavorite,
  isFavorite = false,
}: CardProps) {
  return (
    <div
      className="group relative w-[190px] rounded-xl bg-[#334155] shadow-md ring-1 ring-black/5 overflow-hidden"
      aria-label={`Filme: ${title}`}
    >
      <div className="relative h-[190px] w-full bg-[#526075]">
        {posterUrl ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${posterUrl}`}
            alt={`Poster do filme ${title}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[11px] text-white/60 select-none">
            Poster do Filme
          </div>
        )}

        <button
          type="button"
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          onClick={onToggleFavorite}
          className="
          absolute right-2 top-2 inline-grid h-7 w-7 place-items-center rounded-full bg-black/80 backdrop-blur-sm ring-1 ring-white/20 transition
          hover:bg-black/60 cursor-pointer"
        >
          {isFavorite ? <FaHeart color="red" size={10}/> : <CiHeart color="red" size={13}/>}
        </button>
      </div>

      <div className="flex flex-col items-start justify-start gap-2 ps-2 pb-3 pt-2 bg-[#334155]">
        <div className="min-w-0">
          <p className="truncate text-[12px] font-semibold text-white truncate" title={title}>{title}</p>
        </div>

        <span
          className="
          items-center justify-start rounded-full bg-[#f59e0b]
          px-1 py-[3px] text-[11px] font-semibold text-black/90"
          title="Nota"
        >
          {rating}
        </span>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-xl ring-0 transition group-hover:ring-2 group-hover:ring-white/10" />
    </div>
  );
}
