import Button from '../components/Button';

const NotFoundPage = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen text-white overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0">
        <img
          src="https://wallpapercave.com/wp/wp7315907.jpg"
          alt="404 Background"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.92),rgba(0,0,0,0.25),rgba(0,0,0,0.92))]"></div>
        <div className="absolute inset-0 bg-orange-900/15"></div>
      </div>

      {/* BOX CONTAINER */}
      <div className="relative z-10 w-full max-w-md mx-6">

        <div className="border border-orange-500/40 rounded-3xl p-10 bg-gradient-to-br from-gray-900/90 to-black/90 shadow-2xl text-center backdrop-blur-sm">

          <h1 className="text-7xl font-bold text-orange-400">
            404
          </h1>

          <p className="mt-4 text-orange-100 text-lg">
            This page cannot be found.
          </p>

          <Button
            to="/"
            className="mt-8 w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl"
          >
            Go Home
          </Button>

        </div>

      </div>

    </div>
  );
};

export default NotFoundPage;