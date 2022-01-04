import { Link } from "remix";
import { Article, Favorites, Tag, User } from "@prisma/client";
import { FavoriteArticleButton } from ".";

const ArticlePreview: React.FC<{
  article: Article & { author: User; tags: Tag[]; favorited: Favorites[] };
  authUser?: User;
}> = ({ article, authUser }) => {
  const isFavorited = article.favorited.find(({ userId }) => userId === authUser?.id);

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
          <span className="date">{new Date(article.createdAt).toLocaleDateString()}</span>
        </div>
        {article.author.id !== authUser?.id && (
          <FavoriteArticleButton
            articleId={article.id}
            isFavorited={!!isFavorited}
            favoritesCount={article.favorited.length}
          >
            <i className="ion-heart"></i>
          </FavoriteArticleButton>
        )}
      </div>
      <Link to={`/article/${article.id}/comments/new`} className="preview-link">
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
