import { NavLink } from 'react-router-dom';
import logo from '../assets/images/SolarisLogoWht.png';

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Articles', to: '/articles' },
];

const navLinkClassName = ({ isActive }) =>
  [
    'px-4 py-2 rounded-full text-sm font-semibold transition',
    isActive
      ? 'bg-orange-600 text-white'
      : 'text-gray-300 hover:bg-orange-700 hover:text-white',
  ].join(' ');

const NavBar = () => {
  return (
    <header className="fixed top-0 w-full bg-black shadow-md z-50">
      <div className="flex items-center justify-between px-6 py-4 w-full">

        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Solaris Logo"
            className="w-12 h-12 rounded-full object-cover"
          />
          <span className="font-bold text-xl text-white">Solaris Studio</span>
        </div>

        <nav className="flex gap-3">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClassName}>
              {link.label}
            </NavLink>
          ))}
        </nav>

      </div>
    </header>
  );
};

export default NavBar;