import { useParams } from 'react-router-dom';
import Button from '../../components/Button';
import articles from "../../assets/article-content";

const ArticlePage = () => {
  const { articleId } = useParams();
  const article = articles.find(a => a.name === articleId);

  if (!article) {
    return (
      <div className="text-white p-10">
        <h1 className="text-3xl">Article not found</h1>
        <Button to="/articles" className="mt-6">
          Back
        </Button>
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

        <p className="text-orange-400 text-xs uppercase tracking-[0.3em]">
          Article Title
        </p>

        <h1 className="text-4xl font-bold mt-2 text-orange-400">
          {article.title}
        </h1>

      </section>

      <div className="flex flex-col items-center px-6 pb-10">

        <section className="w-full max-w-3xl">

          <div className="border border-orange-500/40 rounded-2xl p-4 bg-gradient-to-br from-gray-900 to-black shadow-xl">

            <div className="w-full aspect-[16/10] overflow-hidden rounded-xl">

              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />

            </div>

          </div>

        </section>

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