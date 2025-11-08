export type FavoritesSortOption = "title-asc" | "title-desc" | "rating-desc" | "rating-asc";

type FavoritesHeaderProps = {
  selectedSort: FavoritesSortOption;
  onSortChange: (value: FavoritesSortOption) => void;
};

export default function FavoritesHeader({ selectedSort, onSortChange }: FavoritesHeaderProps) {
  return (
    <section className="
    border-b border-gray-700 bg-slate-800 px-6 flex items-start justify-center flex-col h-[150px] gap-4">
      <h2 className="text-2xl font-bold text-white">Meus Filmes Favoritos</h2>
      <div className="flex items-center gap-2">
        <span className="text-md text-gray-200">
          Ordenar por:
        </span>
        <select
          className="
        bg-slate-700 text-white px-3 pr-6 py-2 rounded-md outline-none focus:outline-none 
        focus:ring-0 focus:ring-offset-0 focus:shadow-none cursor-pointer
        "
          value={selectedSort}
          onChange={(event) => onSortChange(event.target.value as FavoritesSortOption)}
        >
          <option value="title-asc">Título (A-Z)</option>
          <option value="title-desc">Título (Z-A)</option>
          <option value="rating-desc">Nota (maior-menor)</option>
          <option value="rating-asc">Nota (menor-maior)</option>
        </select>
      </div>
    </section>
  );
}