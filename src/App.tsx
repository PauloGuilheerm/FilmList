import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Header from './components/Header'
import FilmProvider from './context/FilmProvider'

const GenericComponent = ({children}: {children: React.ReactNode}) => {
  return <>
    <Header />
    {children}
  </>
}
const router = createBrowserRouter([
  {
    path: '/',
    element: <GenericComponent>
      <span>Home</span>
    </GenericComponent>
  },
  {

  }
])
export default function App() {
  return <FilmProvider>
    <RouterProvider router={router} />
  </FilmProvider>
}