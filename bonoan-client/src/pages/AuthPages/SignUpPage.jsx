import { Link } from 'react-router-dom';
import Button from '../../components/Button';

const inputClasses =
  'mt-2 w-full rounded-xl border border-orange-500/30 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500';

const SignUpPage = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-orange-400">Sign Up</h1>

      <p className="mt-3 text-sm text-gray-400">
        Create your Solaris account and start exploring.
      </p>

      <form className="mt-8 space-y-5">

        <div className="grid grid-cols-2 gap-4">
          <input placeholder="First Name" className={inputClasses} />
          <input placeholder="Last Name" className={inputClasses} />
        </div>

        <input placeholder="Email" className={inputClasses} />
        <input type="password" placeholder="Password" className={inputClasses} />

        <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white">
          Create Account
        </Button>

      </form>

      <p className="mt-6 text-sm text-gray-400">
        Already have an account?{' '}
        <Link to="/auth/signin" className="text-orange-400 hover:underline">
          Log In
        </Link>
      </p>
    </>
  );
};

export default SignUpPage;