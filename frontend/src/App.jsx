import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import { LanguageProvider } from './contexts/LanguageContext';
import Footer from './components/Footer/Footer';
import E404 from './components/E404/E404';
import MovieDetails from './components/MovieDetails/MovieDetails';
import MoviesPage from './components/MoviesPage/MoviesPage';
import ShowMoviesPage from './components/ShowMoviesPage/ShowMoviesPage';
import SupportPage from './components/SupportPage/SupportPage';
import SupportPageContact from './components/SupportPageContact/SupportPageContact';
import SupportPageItem from './components/SupportPageItem/SupportPageItem';
import SupportPageFaq from './components/SupportPageFAQ/SupportPageFAQ';
import SupportPageRefund from './components/SupportPageRefund/SupportPageRefund';
import SnacksPage from './components/SnacksPage/SnacksPage';
import CinemasPage from './components/CinemasPage/CinemasPage';
import { UserProvider } from './contexts/AccountContext';
import AccountPage from './components/AccountPage/AccountPage';
import LoginComponent from './components/LoginComponent/LoginComponent';
import ProfileComponent from './components/ProfileComponent/ProfileComponent';
import RegisterComponent from './components/RegisterComponent/RegisterComponent';
import VerifyComponent from './components/VerifyComponent/VerifyComponent';
import ForgotPassComponent from './components/ForgotPassComponent/ForgotPassComponent';
import ResetPassComponent from './components/ResetPassComponent/ResetPassComponent';

function RootLayout() {
  return (
    <>
      <Header />
      <Outlet className="max-w-7xl mx-auto" />
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
        path: 'snacks',
        element: <SnacksPage />,
      },
      {
        path: 'cinemas',
        element: <CinemasPage />,
      },
      {
        path: 'support',
        element: <SupportPage />,
        children: [
          {
            "path": "contact",
            "element": <SupportPageContact />
          },
          {
            "path": "faq",
            "element": <SupportPageFaq />
          },
          {
            "path": "terms-and-conditions",
            "element": <SupportPageItem item="termsAndConditions" />
          },
          {
            "path": "terms-of-use",
            "element": <SupportPageItem item="termsOfUse" />
          },
          {
            "path": "privacy-policy",
            "element": <SupportPageItem item="privacyPolicy" />
          },
          {
            "path": "refunds",
            "element": <SupportPageRefund />
          }
        ]
      },
      {
        path: "account",
        element: <AccountPage />,
        children: [
          {
            path: "profile",
            element: <ProfileComponent />
          },
          {
            path: "register",
            element: <RegisterComponent />
          },
          {
            path: "login",
            element: <LoginComponent />
          },
          {
            path: "verify",
            element: <VerifyComponent />
          },
          {
            path: "forgot-password",
            element: <ForgotPassComponent />
          },
          {
            path: "reset-password",
            element: <ResetPassComponent />
          }
        ]
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
    <UserProvider>
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
    </UserProvider>
  );
}