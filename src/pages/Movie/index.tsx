import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { Film } from "../../types/Film";
import { getFilm } from "../../service/tmdb/films.service";
import Badge from "../../components/Badge";
import { formatDateBR } from "../../utils/date";
import { useFavorites } from "../../hooks/useFavorites";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import Rating from "../../components/Card/Rating";

export default function Movie() {
  const [film, setFilm] = useState<Film | null>(null);
  const { id } = useParams();

  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (id) {
      getFilm(Number(id)).then((response) => {
        setFilm(response);
      });
    }
  }, [id]);

  const backdropUrl = useMemo(() => {
    if (!film?.backdrop_path) return null;

    const path = film.backdrop_path;
    return {
      default: `https://image.tmdb.org/t/p/w780${path}`,
      srcSet: `
        https://image.tmdb.org/t/p/w300${path} 300w,
        https://image.tmdb.org/t/p/w500${path} 500w,
        https://image.tmdb.org/t/p/w780${path} 780w
      `,
    };
  }, [film?.backdrop_path]);

  if (!film) {
    return (
      <section className="flex h-screen items-center justify-center bg-slate-900">
        <span className="text-slate-300">Carregando…</span>
      </section>
    );
  }

  console.log(film);

  return (
    <section className="flex p-7 lg:flex-row lg:items-start">
      <figure className="w-full overflow-hidden rounded-2xl shadow-lg lg:w-2/3">
        {backdropUrl ? (
          <img
            src={backdropUrl.default}
            srcSet={backdropUrl.srcSet}
            sizes="(max-width: 1024px) 100vw, 100vw"
            alt={`Poster do filme ${film.title}`}
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
        <figcaption className="sr-only">{film.title}</figcaption>
      </figure>
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
    </section>
  );
}