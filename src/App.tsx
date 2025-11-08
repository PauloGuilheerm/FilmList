import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Header from './components/Header'
import FilmProvider from './context/FilmProvider'
import Home from './pages/Home'
import { ToastProvider } from './context/ToastProvider'
import Movie from './pages/Movie'

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
  }
]);

export default function App() {
  return <ToastProvider>
    <FilmProvider>
      <RouterProvider router={router} />
    </FilmProvider>
  </ToastProvider>
}