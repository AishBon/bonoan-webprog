import { createBrowserRouter, RouterProvider } from "react-router-dom";

/* PUBLIC LAYOUT */
import Layout from "./layouts/Layout";

/* AUTH LAYOUT */
import AuthLayout from "./layouts/AuthLayout";

/* DASHBOARD LAYOUT */
import DashLayout from "./layouts/DashLayout";

/* PUBLIC PAGES */
import HomePage from "./pages/LandingPages/HomePage";
import AboutPage from "./pages/LandingPages/AboutPage";
import ArticleListPage from "./pages/LandingPages/ArticleListPage";
import ArticlePage from "./pages/LandingPages/ArticlePage";

/* AUTH PAGES */
import SignInPage from "./pages/AuthPages/SignInPage";
import SignUpPage from "./pages/AuthPages/SignUpPage";

/* DASHBOARD PAGES */
import DashboardPage from "./pages/DashboardPages/DashboardPage";
import UsersPage from "./pages/DashboardPages/UsersPage";
import ReportsPage from "./pages/DashboardPages/ReportsPage";

/* ERROR */
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter([
  /* 🌐 PUBLIC SITE (WITH FOOTER) */
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "articles", element: <ArticleListPage /> },
      { path: "articles/:name", element: <ArticlePage /> },
    ],
  },

  /* 🔐 AUTH (NO FOOTER) */
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "signin", element: <SignInPage /> },
      { path: "signup", element: <SignUpPage /> },
    ],
  },

  /* 📊 DASHBOARD (NO FOOTER) */
  {
    path: "/dashboard",
    element: <DashLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "users", element: <UsersPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
 
 