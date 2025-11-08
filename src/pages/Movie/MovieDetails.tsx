import type { Film } from "../../types/Film";
import Badge from "../../components/Badge";
import { formatDateBR } from "../../utils/date";
import Rating from "../../components/Card/Rating";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { useFavorites } from "../../hooks/useFavorites";

export default function MovieDetails({ film }: { film: Film }) {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl lg:text-3xl font-bold text-white ms-5 my-3">
        {film.title}
      </h2>
      <div className="flex flex-wrap gap-2 ms-5">
        {film.genres.map((genre) => (
          <Badge key={genre.id}>
            {genre.name}
          </Badge>
        ))}
      </div>
      <div className="mt-2">
        <div>
          <span className="text-md font-medium text-slate-400 ms-5">
            Data de lançamento:
          </span>
          <span className="text-sm text-slate-400 ms-1">
            {formatDateBR(film.release_date)}
          </span>
        </div>
        <div>
          <span className="text-md font-medium text-slate-400 ms-5">
            Nota TMDB:
          </span>
          <Rating className="ms-1" rating={Number.parseInt(film.vote_average.toFixed(2))} />
        </div>
      </div>
      <div className="max-w-full overflow-hidden mt-4">
        <span className="text-lg font-semibold text-white ms-5">
          Sinopse:
        </span>
        <p className="text-sm text-slate-200 ms-5 break-words">
          {film.overview}
        </p>
      </div>
      <button className="
        bg-redbutton text-white px-4 py-2 rounded-md ms-5 mt-4 w-[230px] cursor-pointer
        hover:bg-redbutton/80 transition-all duration-300
        focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none flex justify-center items-center gap-2"
        onClick={() => toggleFavorite(film)}
      >
        {isFavorite(film.id) ? (
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