import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../../components/Button";
import {
  fetchArticles,
  mapArticleFromApi,
} from "../../services/ArticleService";

const ArticlePage = () => {
  const { name } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchArticles();
        const raw = Array.isArray(data) ? data : (data.articles ?? []);
        const mapped = raw.map(mapArticleFromApi);
        // Match by the `name` slug stored in MongoDB
        const found = mapped.find((a) => a.name === name);
        if (found) setArticle(found);
        else setNotFound(true);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [name]);

  if (loading) {
    return (
      <div className="flex w-full flex-col gap-6 p-6">
        <p className="text-[#ffffff]/70 text-sm">Loading…</p>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="flex w-full flex-col gap-6 p-6">
        <h1 className="text-3xl font-bold text-[#ffffff]">Article not found</h1>
        <Button to="/articles">Back to Articles</Button>
      </div>
    );
  }

  // schema — join paragraphs for display
  const paragraphs = Array.isArray(article.content)
    ? article.content
    : [article.content ?? ""];

  return (
    <div className="flex w-full flex-col gap-6 p-6">
      <section className="max-w-3xl mx-auto w-full">
        <Button to="/articles" className="mb-4">
          ← Back to Articles
        </Button>

        <h1 className="mt-4 text-3xl font-bold text-[#ffffff]">
          {article.title}
        </h1>

        {/* Hero image — schema field is imageUrl */}
        {article.imageUrl && (
          <div className="flex justify-center my-6">
            <div className="w-full overflow-hidden rounded-[1.25rem]">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-100 object-cover"
              />
            </div>
          </div>
        )}

        {/* Content — each array entry rendered as its own paragraph */}
        <div className="text-[#ffffff]/90 text-base leading-7 space-y-4">
          {paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="mt-8">
          <Button to="/">Go Back Home</Button>
        </div>
      </section>
    </div>
  );
};

export default ArticlePage;
