import Button from '../components/Button';
import { Link } from 'react-router-dom';
import articles from '../assets/article-content';

const ArticleListPage = () => {
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

      {/* GRID */}
      <section className="px-6 pb-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {articles.map((article, i) => (
            <article key={i} className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-gray-800 to-black p-4 shadow-lg hover:scale-105 transition-all">

              <div className="aspect-[4/3] overflow-hidden rounded-xl">
                <img src={article.image} className="w-full h-full object-cover" />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-orange-400">
                {article.title}
              </h3>

              <p className="mt-3 text-sm text-gray-300">
                {article.content[0]}
              </p>

              <Link to={`/articles/${article.name}`}>
                <Button className="mt-4 bg-gradient-to-r from-orange-500 to-red-600 text-white">
                  Read More
                </Button>
              </Link>

            </article>
          ))}

        </div>
      </section>

    </div>
  );
};

export default ArticleListPage;