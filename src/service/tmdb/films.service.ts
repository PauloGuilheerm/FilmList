import type { Film } from "../../types/Film";
import type { FilmsResponse } from "../../types/FilmsResponse";
import httpClient from "../HttpClient";

export const getFilms = async (page: number): Promise<FilmsResponse> => {
    const response = await httpClient.get<FilmsResponse>(`/movie/popular?page=${page}`);
    return response;
};

export const getFilm = async (id: number): Promise<Film> => {
    const response = await httpClient.get<Film>(`/movie/${id}`);
    return response;
};