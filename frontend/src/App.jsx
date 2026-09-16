import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import { LanguageProvider } from './contexts/LanguageContext';
import Footer from './components/Footer/Footer';
import E404 from './components/E404/E404';
import MovieDetails from './components/MovieDetails/MovieDetails';
import MoviesPage from './components/MoviesPage/MoviesPage';
import ShowMoviesPage from './components/ShowMoviesPage/ShowMoviesPage';

function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'movie/:id',
        element: <MovieDetails />,
      },
      {
        path: 'movies',
        element: <MoviesPage />,
        children: [
          {
            path: 'now-showing',
            element: <ShowMoviesPage type="nowShowing" />,
          },
          {
            path: 'coming-soon',
            element: <ShowMoviesPage type="comingSoon" />,
          },
        ],
      },
      {
        path: '404',
        element: <E404 />,
      },
      {
        path: '*',
        element: <E404 />,
      },
    ],
  },
]);

export default function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}