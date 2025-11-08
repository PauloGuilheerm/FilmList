import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Header from './components/Header'
import MovieProvider from './context/MovieProvider'
import Home from './pages/Home'
import { ToastProvider } from './context/ToastProvider'
import Movie from './pages/Movie'
import Favorites from './pages/Favorites'

const GenericComponent = ({ children }: { children: React.ReactNode }) => {
  return <>
    <Header />
    {children}
  </>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <GenericComponent>
      <Home />
    </GenericComponent>
  },
  {
    path: '/movie/:id',
    element: <GenericComponent>
      <Movie />
    </GenericComponent>
  },
  {
    path: '/favorites',
    element: <GenericComponent>
      <Favorites />
    </GenericComponent>
  }
]);

export default function App() {
  return <ToastProvider>
    <MovieProvider>
      <RouterProvider router={router} />
    </MovieProvider>
  </ToastProvider>
}