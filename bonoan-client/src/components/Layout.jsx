import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <NavBar />
      <main className="pb-16 pt-24">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;