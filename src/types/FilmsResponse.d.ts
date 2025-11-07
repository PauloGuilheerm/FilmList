import type { Film } from "./Film";

export type FilmsResponse = {
  page: number;
  results: Film[];
  total_pages: number;
  total_results: number;
};
