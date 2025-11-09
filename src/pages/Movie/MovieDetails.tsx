import type { Movie } from "../../types/Movie";
import Badge from "../../components/Badge";
import { formatDateBR } from "../../utils/date";
import Rating from "../../components/Card/Rating";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { useFavorites } from "../../hooks/useFavorites";

export default function MovieDetails({ movie }: { movie: Movie }) {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <div className="mt-6 flex w-full flex-col gap-4 lg:mt-0 lg:flex-1 lg:gap-6 lg:pl-6">
      <h2 className="text-2xl font-bold text-white sm:text-3xl">
        {movie.title}
      </h2>
      <div className="flex flex-wrap gap-2">
        {movie.genres.map((genre) => (
          <Badge key={genre.id}>
            {genre.name}
          </Badge>
        ))}
      </div>
      <div className="mt-2 space-y-1 text-slate-400">
        <div>
          <span className="text-md font-medium">
            Data de lançamento:
          </span>
          <span className="ms-1 text-sm">
            {formatDateBR(movie.release_date)}
          </span>
        </div>
        <div>
          <span className="text-md font-medium">
            Nota TMDB:
          </span>
          <Rating className="ms-1 inline-flex" rating={Number.parseInt(movie.vote_average.toFixed(2))} />
        </div>
      </div>
      <div className="mt-4 max-w-full">
        <span className="text-lg font-semibold text-white">
          Sinopse:
        </span>
        <p className="mt-1 text-sm text-slate-200 break-words">
          {movie.overview}
        </p>
      </div>
      <button className="
        mt-4 inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-md bg-redbutton px-4 py-2 text-white
        hover:bg-redbutton/80 transition-all duration-300
        focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none cursor-pointer"
        onClick={() => toggleFavorite(movie)}
      >
        {isFavorite(movie.id) ? (
          <>
            <FaHeart color="white" size={16} />
            Remover dos favoritos
          </>
        ) : (
          <>
            <CiHeart color="white" size={16} />
            Adicionar aos favoritos
          </>
        )}
      </button>
    </div>
  );
}
