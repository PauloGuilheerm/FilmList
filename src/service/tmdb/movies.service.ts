import type { Movie } from "../../types/Movie";
import type { MoviesResponse } from "../../types/MoviesResponse";
import httpClient from "../HttpClient";

export const getMovies = async (page: number): Promise<MoviesResponse> => {
  const response = await httpClient.get<MoviesResponse>('/movie/popular', {
    params: {
      page: page,
      language: 'pt-BR'
    }
  });
  return response;
};

export const getMovie = async (id: number): Promise<Movie> => {
  const response = await httpClient.get<Movie>(`/movie/${id}`, {
    params: {
      language: 'pt-BR'
    }
  });
  return response;
};

export const searchMovies = async (query: string, page: number): Promise<MoviesResponse> => {
  const encodedQuery = encodeURIComponent(query);
  const response = await httpClient.get<MoviesResponse>('/search/movie', {
    params: {
      query: encodedQuery,
      page: page,
      language: 'pt-BR'
    }
  });
  return response;
};