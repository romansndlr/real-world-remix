import { Link, useSearchParams, useTransition } from "remix";
import { Article, Favorites, Tag, User } from "@prisma/client";
import isEmpty from "lodash/isEmpty";
import ArticlePreview from "./article-preview";

const ArticleList: React.FC<{
  articles: Array<
    Article & { author: User; tags: Tag[]; favorited: Favorites[] }
  >;
  articlesCount: number;
  authUser?: User;
}> = ({ articles, authUser, articlesCount }) => {
  const { state } = useTransition();
  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") || 1;

  return (
    <div>
      {isEmpty(articles) && state === "idle" && (
        <div className="article-preview">
          <p>No articles are here... yet.</p>
        </div>
      )}
      {articles.map((article) => (
        <ArticlePreview
          article={article}
          authUser={authUser}
          key={article.id}
        />
      ))}
      {state === "loading" && (
        <div className="article-preview">
          <p>Loading...</p>
        </div>
      )}
      {articlesCount > 10 && (
        <nav>
          <ul className="pagination">
            {Array.from({ length: articlesCount }, (_, i) => (
              <li
                className={
                  Number(page) === i + 1 ? "page-item active" : "page-item"
                }
                key={i}
              >
                <Link to={`?page=${i + 1}`} className="page-link">
                  {i + 1}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ArticleList;
