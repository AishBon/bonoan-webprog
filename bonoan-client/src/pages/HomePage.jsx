import Button from '../components/Button';

const HomePage = () => {

  const features = [
    {
      title: "Solar Flares",
      desc: "Powerful bursts of energy shaping cosmic landscapes.",
      img: "https://wallpaperaccess.com/full/378498.jpg",
    },
    {
      title: "Red Giants",
      desc: "Massive stars expanding as they evolve over time.",
      img: "https://earthsky.org/upl/2021/08/red-giant-symphony-artist-e1628362062769.png",
    },
    {
      title: "Nebula Fields",
      desc: "Clouds of gas and dust where stars are born.",
      img: "https://w0.peakpx.com/wallpaper/122/222/HD-wallpaper-red-space-stars-galaxy-outer-space.jpg",
    },
    {
      title: "Stellar Dust",
      desc: "Fine particles scattered across deep space.",
      img: "https://cdn.mos.cms.futurecdn.net/9A228sxQbc8M5SRT7SUJuL.jpg",
    },
    {
      title: "Cosmic Horizons",
      desc: "The edge of observable space and beyond.",
      img: "https://wallpapers.com/images/hd/outer-space-red-4k-vfvraazbf2pvfzde.jpg",
    },
    {
      title: "Astral Energy",
      desc: "Invisible forces connecting celestial bodies.",
      img: "https://wallpaper.dog/large/10745128.jpg",
    },
  ];

  return (
    <div className="flex w-full flex-col gap-10 min-h-screen bg-gradient-to-b from-black via-gray-950 to-gray-900 text-white">

      {/* HERO SECTION */}
      <section className="border-y border-orange-600/50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-orange-400">
              Hero Section
            </p>

            <h1 className="max-w-xl text-4xl font-bold leading-tight">
              Welcome to <span className="text-orange-400">Solaris Studio</span>
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-7 text-gray-300">
              Solaris is the quiet warmth before the dawn—a singular point of gravity where the shadows retreat and your vision takes form.
            </p>

            <div className="mt-6">
              <Button 
                to="/about" 
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-red-600 hover:to-orange-500 shadow-lg hover:shadow-orange-500/40 transition-all"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="rounded-3xl border border-orange-500/40 p-6 bg-gradient-to-br from-gray-900 to-black shadow-2xl">
            
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl relative">
              
              <img
                src="https://th.bing.com/th/id/OIP.cxPZNdFYqVNDb6acwMX5cwHaFJ?w=232&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
                alt="Hero Illustration"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-orange-500/30 via-transparent to-transparent pointer-events-none"></div>
            </div>

          </div>

        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="border-y border-orange-600/50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-orange-400">
            Statistics
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            Quick Overview Blocks
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { num: '12', label: 'Projects Completed' },
            { num: '08', label: 'Layout Sections' },
            { num: '24', label: 'Screens Designed' },
            { num: '04', label: 'Layout Systems' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-gradient-to-br from-orange-500 via-red-600 to-orange-400 p-6 flex flex-col items-center justify-center shadow-xl"
            >
              <p className="text-3xl font-bold">{item.num}</p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 text-center">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="border-y border-orange-600/50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-orange-400">
            Features
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            Cosmic Feature Cards
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          {features.map((feature, i) => (
            <article
              key={i}
              className="rounded-3xl border border-orange-500/40 bg-gradient-to-br from-gray-900 via-black to-gray-950 p-5 shadow-lg hover:shadow-orange-500/30 transition-all hover:-translate-y-2"
            >

              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl relative">
                
                <img
                  src={feature.img}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent pointer-events-none"></div>
              </div>

              <h3 className="mt-4 text-lg font-semibold text-orange-400">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm text-gray-300 leading-6">
                {feature.desc}
              </p>

              <Button className="mt-4 bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-red-600 hover:to-orange-500">
                View More
              </Button>

            </article>
          ))}

        </div>
      </section>

    </div>
  );
};

export default HomePage;