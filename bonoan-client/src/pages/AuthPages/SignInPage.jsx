import { Link } from 'react-router-dom';
import Button from '../../components/Button';

const inputClasses =
  'mt-2 w-full rounded-xl border border-orange-500/30 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500';

const SignInPage = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-orange-400">Log In</h1>

      <p className="mt-3 text-sm text-gray-400">
        Welcome back. Enter your credentials to continue.
      </p>

      <form className="mt-8 space-y-5">

        <div>
          <label className="text-sm text-gray-300">Email</label>
          <input type="email" className={inputClasses} placeholder="Enter your email" />
        </div>

        <div>
          <label className="text-sm text-gray-300">Password</label>
          <input type="password" className={inputClasses} placeholder="Enter your password" />
        </div>

        <div className="flex justify-between text-xs text-gray-400">
          <span>Remember me</span>
          <span className="hover:text-orange-400 cursor-pointer">Forgot?</span>
        </div>

        <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white">
          Log In
        </Button>

      </form>

      <p className="mt-6 text-sm text-gray-400">
        No account?{' '}
        <Link to="/auth/signup" className="text-orange-400 hover:underline">
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default SignInPage;