import { useNavigate } from 'react-router-dom';
import Clapper from '../../assets/clapper.png';

export default function EmptyFavorites() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center w-full h-100 gap-3">
      <img src={Clapper} alt="Clapper" className="h-24 w-24" />
      <h3 className="text-xl font-normal text-slate-500">
        Nenhum filme favorito ainda
      </h3>
      <span className="text-slate-500 font-normal text-md">
        Comece explorando filmes populares e adicione seus favoritos!
      </span>
      <button 
      className="bg-ocean mt-2 text-white px-4 py-2 rounded-md hover:bg-ocean/80 transition-all duration-300 cursor-pointer"
      onClick={() => navigate('/')}
      >
        Explorar Filmes
      </button>
    </div>
  );
}