import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import type { Movie } from "../../types/Movie";
import { getMovie } from "../../service/tmdb/movies.service";
import MovieImage from "./MovieImage";
import MovieDetails from "./MovieDetails";
import { useToast } from "../../context/ToastContext";
import { FaSpinner } from "react-icons/fa";

export default function MoviePage() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const { showToast } = useToast();

  useEffect(() => {
    if (!id) return;

    const fetchMovie = async () => {
      try {
        setLoading(true);
        const response = await getMovie(Number(id));
        setMovie(response);
      } catch {
        showToast({ message: 'Erro ao buscar filme', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    void fetchMovie();
  }, [id, showToast]);


  if (loading || !movie) {
    return <div className="flex items-center justify-center h-[calc(100vh-100px)]">
      {loading && <FaSpinner size={50} className="text-slate-300 animate-spin" />}
      <span className="text-slate-300 text-2xl font-bold ms-4">
        {loading ? 'Buscando dados do filme...' : 'Dados do filme não encontrados'}
      </span>
    </div>
  }

  return (
    <section className="flex flex-col gap-8 px-5 py-6 pb-8 lg:flex-row lg:items-start lg:gap-12 lg:px-12 lg:py-10">
      <MovieImage backdrop_path={movie.backdrop_path ?? ''} title={movie.title ?? ''} />
      <MovieDetails movie={movie} />
    </section>
  );
}