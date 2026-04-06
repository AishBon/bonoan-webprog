import Button from '../components/Button';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center">

      <h1 className="text-7xl font-bold text-orange-500">
        404
      </h1>

      <p className="mt-4 text-gray-400">
        This page cannot be found.
      </p>

      <Button to="/" className="mt-6 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        Go Home
      </Button>

    </div>
  );
};

export default NotFoundPage;