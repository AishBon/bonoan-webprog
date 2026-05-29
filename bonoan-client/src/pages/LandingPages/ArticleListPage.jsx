import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ArticleList from "../../components/ArticleList";
import Button from "../../components/Button";
import {
  fetchArticles,
  mapArticleFromApi,
} from "../../services/ArticleService";

const ArticleListPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchArticles();
        const raw = Array.isArray(data) ? data : (data.articles ?? []);
        // Only show active articles publicly
        const active = raw
          .filter((a) => a.isActive !== false)
          .map(mapArticleFromApi);
        setArticles(active);
      } catch {
        setError("Could not load articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="flex flex-col gap-10 min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white">
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <section className="border-y-2 border-orange-600 px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center max-w-7xl mx-auto">
          <div className="order-2 lg:order-1">
            <p className="text-orange-400 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
              Articles
            </p>
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
              Insights &amp; Design Thoughts
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-gray-300 sm:text-base">
              Explore our latest articles and featured content — fresh ideas,
              curated picks, and everything worth reading.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button to="/" variant="primary">
                Back Home
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl order-1 lg:order-2 border border-orange-500/30">
            <img
              src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b177348c-abb5-48ae-9ef3-80a8e4b4d9b8/dga8dp5-3843d3b4-d268-453e-bc90-f7ae8f6f3aa0.png/v1/fill/w_1280,h_854,q_80,strp/new_iron_planet_burns___spews_rusty_clouds_003_by_lowthunders_dga8dp5-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODU0IiwicGF0aCI6IlwvZlwvYjE3NzM0OGMtYWJiNS00OGFlLTllZjMtODBhOGU0YjRkOWI4XC9kZ2E4ZHA1LTM4NDNkM2I0LWQyNjgtNDUzZS1iYzkwLWY3YWU4ZjZmM2FhMC5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.JoqLsHqxnnNwxiEfbD-RRJMRmOqr7l8WqF4BMLaRL-U"
              alt="Featured Article"
              className="w-full h-72 object-cover opacity-80"
            />
          </div>
        </div>
      </section>

      {/* ── ARTICLE GRID ────────────────────────────────────────────────── */}
      <section className="px-6 pb-10 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <p className="text-orange-400 text-xs uppercase tracking-[0.3em] font-semibold">
            Featured
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Latest Articles
          </h2>
        </div>

        {/* Loading */}
        {loading && <p className="text-gray-400 text-sm">Loading articles…</p>}

        {/* Error */}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Empty */}
        {!loading && !error && articles.length === 0 && (
          <p className="text-gray-400 text-sm">
            No articles available yet. Check back soon!
          </p>
        )}

        {/* Grid */}
        {!loading && !error && articles.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((article, i) => (
              <article
                key={article.id ?? article._id ?? i}
                className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-gray-800 to-black p-4 shadow-lg hover:scale-105 transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-xl">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-orange-400">
                  {article.title}
                </h3>

                <p className="mt-3 text-sm text-gray-300 line-clamp-3">
                  {Array.isArray(article.content)
                    ? article.content[0]
                    : article.content}
                </p>

                <Link
                  to={`/articles/${article.name ?? article.slug ?? article.id}`}
                >
                  <Button className="mt-4 bg-gradient-to-r from-orange-500 to-red-600 text-white">
                    Read More
                  </Button>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ArticleListPage;
