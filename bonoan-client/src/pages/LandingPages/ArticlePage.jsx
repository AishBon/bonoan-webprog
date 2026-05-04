import { useParams } from 'react-router-dom';
import Button from '../../components/Button';
import articles from "../../data/article-content";

const slugify = (text) =>
  (text || "").toLowerCase().replace(/\s+/g, "-");

const ArticlePage = () => {
  const params = useParams();

  const articleId = Object.values(params)[0];

  const article = articles.find(
    (a) => slugify(a.name) === slugify(articleId)
  );

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white flex items-center justify-center p-10">
        <div>
          <h1 className="text-3xl text-orange-400 font-bold">
            Article not found
          </h1>

          <Button
            to="/articles"
            className="mt-6 bg-orange-500 px-4 py-2 rounded-lg"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white">

      {/* HEADER */}
      <section className="border-y border-orange-600 px-6 py-12">
        <Button
          to="/articles"
          className="mb-6 bg-gradient-to-r from-orange-500 to-red-600 text-white"
        >
          Back to Articles
        </Button>

        <h1 className="text-4xl font-bold text-orange-400 mt-2">
          {article.title}
        </h1>
      </section>

      {/* CONTENT */}
      <div className="flex flex-col items-center px-6 pb-10">

        {/* IMAGE CARD */}
        <section className="w-full max-w-3xl">
          <div className="border border-orange-500/40 rounded-2xl p-4 bg-gradient-to-br from-gray-900 to-black shadow-xl">
            <img
              src={article.image}
              alt={article.title}
              className="w-full rounded-xl object-cover"
            />
          </div>
        </section>

        {/* TEXT */}
        <section className="w-full max-w-3xl mt-10">
          {article.content.map((p, i) => (
            <p key={i} className="mt-6 text-gray-300 leading-7">
              {p}
            </p>
          ))}
        </section>

      </div>
    </div>
  );
};

export default ArticlePage;