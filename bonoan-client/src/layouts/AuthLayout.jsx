import { Outlet } from 'react-router-dom';
import logo from '../assets/images/SolarisLogoWht.png';

const AuthLayout = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white">
      
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex items-center justify-center border-r border-orange-600/40 p-10 relative overflow-hidden">

          {/* BACKGROUND IMAGE */}
          <img
            src="https://img.freepik.com/premium-photo/andromeda-galaxy-closeup-background-image-galaxy-background-wallpaper-landscape_1020697-463575.jpg"
            alt="Solaris Visual"
            className="absolute inset-0 w-full h-full object-cover opacity-100"
          />

          {/* CONTENT */}
            <div className="relative z-10 w-full max-w-md border border-orange-500/40 rounded-3xl p-10 bg-gradient-to-br from-gray-900 to-black shadow-xl text-center">
            {/* LOGO */}
            <div className="flex justify-center mb-5">
              <img
                src={logo}
                alt="Solaris Logo"
                className="w-16 h-16 object-cover rounded-full border border-orange-500/40 shadow-lg"
              />
            </div>

            <h2 className="text-2xl font-bold text-orange-400">
              Solaris Studio
            </h2>

            <p className="mt-4 text-gray-300 text-sm">
              Where design meets intention and clarity.
            </p>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <main className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md border border-orange-500/40 rounded-3xl p-8 bg-gradient-to-br from-gray-900 to-black shadow-xl">
            <Outlet />
          </div>
        </main>

      </div>
    </section>
  );
};

export default AuthLayout;