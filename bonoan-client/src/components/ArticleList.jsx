import { Link } from 'react-router-dom';
import Button from './Button';

const ArticleList = ({ articles }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {articles.map((article, index) => (
        <article
          key={article.name}
          className="rounded-3xl border border-orange-500/40 bg-gradient-to-br from-gray-900 via-black to-gray-950 p-5 shadow-lg hover:shadow-orange-500/30 transition-all hover:-translate-y-2"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-orange-400">
            Article {String(index + 1).padStart(2, '0')}
          </p>

          <h3 className="mt-3 text-lg font-semibold text-orange-400">
            {article.title}
          </h3>

          <p className="mt-3 text-sm text-gray-300 leading-6">
            {article.content[0].substring(0, 120)}...
          </p>

          <Link to={`/articles/${article.name}`}>
            <Button className="mt-4 bg-gradient-to-r from-orange-500 to-red-600 text-white">
              Read More
            </Button>
          </Link>
        </article>
      ))}
    </div>
  );
};

export default ArticleList;