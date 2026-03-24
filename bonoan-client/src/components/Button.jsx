import { Link } from 'react-router-dom';

const variantClasses = {
  primary: 'bg-orange-600 text-white hover:bg-orange-700',
  secondary: 'bg-gray-700 text-gray-100 hover:bg-gray-600',
};

const Button = ({ children, to, type = 'button', variant = 'primary', className = '' }) => {
  const classes = [
    'inline-flex items-center justify-center rounded-full border-2 border-transparent px-4 py-2 text-sm font-semibold uppercase tracking-widest transition',
    variantClasses[variant] ?? variantClasses.primary,
    className,
  ].join(' ');

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes}>
      {children}
    </button>
  );
};

export default Button;