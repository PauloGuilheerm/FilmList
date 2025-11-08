export default function FavoritesHeader() {
  return (
    <section className="
    border-b border-gray-700 bg-slate-800 px-6 flex items-start justify-center flex-col h-[150px] gap-4">
      <h2 className="text-2xl font-bold text-white">Meus Filmes Favoritos</h2>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-200">
          Ordenar por:
        </span>
        <select>
          <option value="az">A-Z/Z-A</option>
          <option value="nota">maior nota/menor nota</option>
        </select>
      </div>
    </section>
  );
}