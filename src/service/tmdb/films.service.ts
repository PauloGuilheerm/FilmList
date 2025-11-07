import type { FilmsResponse } from "../../types/FilmsResponse";
import httpClient from "../HttpClient";

export const getFilms = async (page: number): Promise<FilmsResponse> => {
    const response = await httpClient.get<FilmsResponse>(`/movie/popular?page=${page}`);
    return response;
};