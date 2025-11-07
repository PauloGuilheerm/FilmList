import Clapper from '../../assets/clapper.png'
import { Tabs } from '../Tabs'

export default function Header() {
  return <header className="flex justify-between items-center bg-[#1e293b] h-[70px] px-4">
    <div className="flex items-center gap-2">
      <img src={Clapper} alt="Clapper" className="h-8 w-8" />
      <span className="text-yellow-400 font-bold text-xl">
        MovieDBO
      </span>
    </div>
    <input
      type="text"
      placeholder="Buscar filmes..."
      className="
        w-full max-w-md rounded-full bg-[#334155] h-[45px] px-4 py-2 text-slate-100
        placeholder:text-slate-400 outline-none text-md font-medium
        focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none"
      />

    <Tabs tabs={[{ label: 'Home', to: '/' }, { label: 'Favoritos', to: '/favoritos' }]} />
  </header>
}