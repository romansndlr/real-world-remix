import * as React from "react";
import { Article, Favorites, Follows, Tag, User } from "@prisma/client";
import { Form, Link } from "remix";
import FollowAuthorButton from "./follow-author-button";
import FavoriteArticleButton from "./favorite-article-button";

interface ArticleMetaProps {
  article: Article & { author: User & { followers: Follows[] }; favorited: Favorites[]; tags: Tag[] };
  authUser: User;
}

const ArticleMeta: React.FunctionComponent<ArticleMetaProps> = ({ article, authUser }) => {
  const isFavorited = article.favorited.find(({ userId }) => userId === authUser?.id);

  const isFollowing = article.author.followers.find(({ followerId }) => followerId === authUser?.id);

  return (
    <div className="article-meta">
      <Link to={`/profile/${article.author.username}`}>
        <img src={article.author.image || ""} />
      </Link>
      <div className="info">
        <Link to={`/profile/${article.author.username}`}>{article.author.username}</Link>
        <span className="date">{new Date(article.createdAt).toLocaleDateString()}</span>
      </div>
      {article.author.id === authUser?.id ? (
        <span>
          <Link className="btn btn-outline-secondary btn-sm" to={`/editor/${article.id}`}>
            <i className="ion-edit"></i> Edit Article
          </Link>
          &nbsp;&nbsp;
          <Form style={{ display: "inline-flex" }} method="post" action={`/article/${article.id}/delete`}>
            <button type="submit" className="btn btn-outline-danger btn-sm">
              <i className="ion-trash-a"></i> Delete Article
            </button>
          </Form>
        </span>
      ) : (
        <span style={{ display: "inline-flex" }}>
          <FollowAuthorButton
            isFollowing={!!isFollowing}
            authorId={article.author.id}
            followersCount={article.author.followers.length}
          >
            {article.author.username}
          </FollowAuthorButton>
          &nbsp;
          <FavoriteArticleButton
            articleId={article.id}
            isFavorited={!!isFavorited}
            favoritesCount={`(${article.favorited.length})`}
          >
            <i className="ion-heart"></i>&nbsp;&nbsp;Favorite Post
          </FavoriteArticleButton>
        </span>
      )}
    </div>
  );
};

export default ArticleMeta;
