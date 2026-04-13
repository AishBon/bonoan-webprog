const Footer = () => {
  return (
    <footer className="border-t border-orange-600/40 bg-black text-gray-400">

      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        <div>
          <h2 className="text-lg font-bold text-orange-400">
            Solaris Studio
          </h2>
          <p className="mt-3 text-sm leading-6">
            Where structure meets creativity—crafted through light, contrast, and intention.
          </p>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-[0.3em] text-orange-400">
            Navigation
          </h3>

          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/articles">Articles</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-[0.3em] text-orange-400">
            Info
          </h3>

          <p className="mt-4 text-sm">
            Designed for clarity, built for expression.
          </p>
        </div>

      </div>

      <div className="text-center text-xs border-t border-orange-600/30 py-4">
        © {new Date().getFullYear()} Solaris Studio
      </div>

    </footer>
  );
};

export default Footer;