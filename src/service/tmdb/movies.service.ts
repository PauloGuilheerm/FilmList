import type { Movie } from "../../types/Movie";
import type { MoviesResponse } from "../../types/MoviesResponse";
import httpClient from "../HttpClient";

export const getMovies = async (page: number): Promise<MoviesResponse> => {
    const response = await httpClient.get<MoviesResponse>(`/movie/popular?page=${page}`);
    return response;
};

export const getMovie = async (id: number): Promise<Movie> => {
    const response = await httpClient.get<Movie>(`/movie/${id}`);
    return response;
};