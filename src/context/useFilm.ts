import { useContext } from "react";
import { FavoritesContext } from "./filmContext";

export const useFavorites = () => useContext(FavoritesContext);

