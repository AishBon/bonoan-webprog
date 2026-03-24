import Button from '../components/Button';

const ArticlePage = () => {

  const articles = [
    {
      title: "Light as a Design Principle",
      desc: "Light defines depth, guides focus, and reveals structure within a composition.",
      img: "https://img.freepik.com/premium-photo/photo-galaxy-background-with-cosmic-debris-celestial-bodies_611870-47513.jpg" 
    },
    {
      title: "Building Visual Hierarchy",
      desc: "Hierarchy creates clarity, allowing the eye to move naturally through a layout.",
      img: "https://img.freepik.com/premium-photo/sci-fi-virtual-reality-landscape-cyberpunk-style-3d-render-fantasy-universe-space-cloud-background_24623-1141.jpg"
    },
    {
      title: "The Role of Negative Space",
      desc: "Empty space is not absence—it is balance, breathing room, and quiet emphasis.",
      img: "https://img.freepik.com/premium-photo/red-black-abstract-background-abstract-red-color-background_552988-3225.jpg"
    },
    {
      title: "Designing with Intent",
      desc: "Every element should exist for a reason, contributing to the overall experience.",
      img: "https://t4.ftcdn.net/jpg/07/44/17/63/360_F_744176363_ID9NFwUVaYAhE7BYcK1Qp0F9DxJr1BtL.jpg"
    },
  ];

  return (
    <div className="flex flex-col gap-10 min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white">

      {/* HEADER */}
      <section className="border-y-2 border-orange-600 px-6 py-12 text-center">
        <p className="text-orange-400 text-xs uppercase tracking-[0.3em]">
          Articles
        </p>
        <h1 className="text-4xl font-bold mt-3">
          Insights & Design Thoughts
        </h1>
      </section>

      {/* ARTICLES GRID */}
      <section className="px-6 pb-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {articles.map((article, i) => (
            <article
              key={i}
              className="
                rounded-3xl 
                border border-orange-500/30 
                bg-gradient-to-br from-gray-800 to-black 
                shadow-lg 
                hover:-translate-y-3 
                hover:scale-105 
                hover:shadow-orange-500/40
                transition-all duration-300 
                p-4
              "
            >

              {/* IMAGE */}
              <div className="w-full aspect-[4/3] overflow-hidden rounded-xl">
                <img
                  src={article.img}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* TITLE */}
              <h3 className="mt-4 text-lg font-semibold text-orange-400">
                {article.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-sm mt-3 text-gray-300">
                {article.desc}
              </p>

              <Button className="mt-4 bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-red-600 hover:to-orange-500">
                Read More
              </Button>

            </article>
          ))}

        </div>
      </section>

      {/* FEATURED */}
      <section className="border-y-2 border-orange-600 px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <div className="w-full aspect-[4/3]">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/035/380/129/small_2x/ai-generated-red-and-white-stars-in-space-free-photo.jpg"
                alt="Featured"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-orange-400">
              Featured Insight
            </h2>

            <p className="mt-4 text-gray-300 leading-7">
              Design is the quiet alignment of form, purpose, and perception—where every decision shapes how something is understood.
            </p>

            <p className="mt-4 text-gray-400 text-sm">
              A refined system turns complexity into clarity, allowing ideas to communicate without distraction.
            </p>

            <Button className="mt-6 bg-gradient-to-r from-orange-500 to-red-600 text-white">
              Explore More
            </Button>
          </div>

        </div>
      </section>

    </div>
  );
};

export default ArticlePage;