import { Form, Link, useLocation, useTransition } from "remix";
import classNames from "classnames";
import { Article, Favorites, Tag, User } from "@prisma/client";

const ArticlePreview: React.FC<{
  article: Article & { author: User; tags: Tag[]; favorited: Favorites[] };
  authUser?: User;
}> = ({ article, authUser }) => {
  const { submission } = useTransition();
  const location = useLocation();

  const formData = submission?.formData;

  const isSubmitting = Number(formData?.get("id")) === Number(article.id);

  const isFavorited = article.favorited.find(
    ({ userId }) => userId === authUser?.id
  );

  return (
    <div className="article-preview" key={article.id}>
      <div className="article-meta">
        <Link to={`/profile/${article.author.username}`}>
          <img src={article.author.image as string} />
        </Link>
        <div className="info">
          <Link to={`/profile/${article.author.username}`} className="author">
            {article.author.username}
          </Link>
          <span className="date">
            {new Date(article.createdAt).toLocaleDateString()}
          </span>
        </div>
        <Form
          key={`favorite-article-${article.id}-form`}
          method="post"
          action="/favorite-article"
        >
          <input
            type="hidden"
            name="favorited"
            value={isFavorited ? "1" : ""}
          />
          <input type="hidden" name="id" value={article.id} />
          <input type="hidden" name="referer" value={location.pathname} />
          <button
            className={classNames("btn btn-sm pull-xs-right", {
              "btn-outline-primary": !isFavorited,
              "btn-primary": isFavorited,
            })}
            disabled={isSubmitting}
          >
            <i className="ion-heart"></i> {article.favorited.length}
          </button>
        </Form>
      </div>
      <Link to={`/article/${article.id}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tags.map((tag) => (
            <li className="tag-default tag-pill tag-outline" key={tag.id}>
              {tag.name}
            </li>
          ))}
        </ul>
      </Link>
    </div>
  );
};

export default ArticlePreview;
