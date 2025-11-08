import { useNavigate } from 'react-router-dom';
import Clapper from '../../assets/clapper.png'
import { Tabs } from '../Tabs'

export default function Header() {
  const navigate = useNavigate();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    navigate(`/search?query=${event.target.value}`);
  };

  const handleRedirectToHome = () => {
    navigate('/');
  };

  return <>
    <header className="flex justify-between items-center h-[70px] px-4 border-b border-gray-800">
      <div className="flex items-center gap-1 cursor-pointer" onClick={handleRedirectToHome}>
        <img src={Clapper} alt="Clapper" className="h-12 w-12" />
        <span className="text-yellow-400 font-bold text-2xl">
          MovieDB
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
    <div className="border-b border-slate-700" />
  </>
}