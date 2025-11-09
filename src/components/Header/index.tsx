import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Clapper from '../../assets/clapper.png'
import { Tabs } from '../Tabs'
import useDebounce from '../../hooks/useDebounce';

export default function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { debouncedValue } = useDebounce(search, 500);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleRedirectToSearch = () => {
    navigate(`/search?q=${encodeURIComponent(debouncedValue.trim())}`);
  };

  const handleDirectToHome = () => {
    navigate('/',);
  };

  useEffect(() => {
    if (!debouncedValue.trim()) {
      return;
    }

    handleRedirectToSearch();
  }, [debouncedValue]);

  const location = useLocation();

  useEffect(() => {
    if (location.search.includes('q')) {
      const [_, searchValue] = location.search.split('q=');
      setSearch(searchValue);
    } else {
      setSearch('');
    }
  }, [debouncedValue, location.pathname, location.search]);

  const handleClearSearch = () => {
    setSearch('');
    handleDirectToHome();
    setIsMenuOpen(false);
  };

  const tabs = [
    {
      label: 'Home', to: '/', onClick: () => {
        setSearch('');
        navigate('/',);
      }
    },
    {
      label: 'Favoritos', to: '/favorites', onClick: () => {
        navigate('/favorites');
        setSearch('');
      }
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return <header className="sticky top-0 z-40 border-b border-gray-700 bg-slate-800/95 backdrop-blur supports-[backdrop-filter]:bg-slate-800/80 relative">
    <div className="flex w-full flex-wrap items-center gap-3 px-4 py-3 md:flex-nowrap md:justify-between">
      <button
        type="button"
        className="flex cursor-pointer items-center gap-2 bg-transparent border-0 p-0 focus:outline-none focus:ring-0"
        onClick={handleClearSearch}
      >
        <img src={Clapper} alt="Clapper" className="h-12 w-12" />
        <span className="text-2xl font-bold text-yellow-400">
          MovieDB
        </span>
      </button>

      <div className="order-3 w-full md:order-2 md:max-w-xl md:flex-1 md:px-6">
        <input
          type="text"
          placeholder="Buscar filmes..."
          className="w-full rounded-full bg-[#334155] px-4 py-2 text-md font-medium text-slate-100 placeholder:text-slate-400 outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none"
          onFocus={closeMenu}
          onChange={handleSearch}
          value={search}
        />
      </div>

      <div className="order-2 ml-auto flex items-center gap-2 md:order-3 md:ml-0">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-700 text-slate-200 transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/60 focus:ring-offset-2 focus:ring-offset-slate-900 md:hidden"
          onClick={toggleMenu}
          aria-label="Abrir menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="hidden md:block">
          <Tabs tabs={tabs} />
        </div>
      </div>
    </div>
    {isMenuOpen && (
      <div className="md:hidden">
        <div className="mx-auto w-full max-w-6xl px-4 pb-4">
          <div className="rounded-xl border border-slate-700/70 bg-slate-900/95 p-3 shadow-lg shadow-black/30">
            <Tabs tabs={tabs} orientation="vertical" className="w-full" onSelect={closeMenu} />
          </div>
        </div>
      </div>
    )}
  </header>
}