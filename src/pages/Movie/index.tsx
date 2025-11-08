import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import type { Film } from "../../types/Film";
import { getFilm } from "../../service/tmdb/films.service";
import MovieImage from "./MovieImage";
import MovieDetails from "./MovieDetails";
import { useFilm } from "../../context/FilmContextt";
import { useToast } from "../../context/ToastContext";
import { FaSpinner } from "react-icons/fa";

export default function Movie() {
  const [film, setFilm] = useState<Film | null>(null);
  const { id } = useParams();

  const { loading, setLoading } = useFilm();
  const { showToast } = useToast();

  useEffect(() => {
    if (id) {
      const fetchFilm = async () => {
        try {
          setLoading(true);
          const response = await getFilm(Number(id));
          setFilm(response);
        } catch {
          showToast({ message: 'Erro ao buscar filme', type: 'error' });
        } finally {
          setLoading(false);
        }
      }
      fetchFilm();
    }
  }, [id]);


  if (loading || !film) {
    return <div className="flex items-center justify-center h-[calc(100vh-100px)]">
      {loading && <FaSpinner size={50} className="text-slate-300 animate-spin" />}
      <span className="text-slate-300 text-2xl font-bold ms-4">
        {loading ? 'Buscando filme...' : 'Dados do filme não encontrados'}
      </span>
    </div>
  }

  return (
    <section className="flex flex-col gap-8 px-5 py-6 lg:flex-row lg:items-start lg:gap-12 lg:px-12 lg:py-10">
      <MovieImage backdrop_path={film.backdrop_path ?? ''} title={film.title ?? ''} />
      <MovieDetails film={film} />
    </section>
  );
}