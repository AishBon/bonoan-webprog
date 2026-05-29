import { Outlet } from "react-router-dom";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <div className="relative min-h-screen flex flex-col text-gray-100 overflow-hidden">
      {/* SIDE ORANGE GLOW BACKGROUND */}
      <div className="fixed inset-0 -z-10 bg-black" />
      <div className="fixed inset-y-0 left-0 w-1/3 -z-10 bg-gradient-to-r from-orange-900/60 via-orange-700/20 to-transparent" />
      <div className="fixed inset-y-0 right-0 w-1/3 -z-10 bg-gradient-to-l from-orange-900/60 via-orange-700/20 to-transparent" />

      <NavBar />

      <main className="flex-grow pb-16 pt-24">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
