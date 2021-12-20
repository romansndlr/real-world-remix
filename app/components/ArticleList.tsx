import isEmpty from "lodash/isEmpty";
import * as React from "react";
import { Link, useTransition } from "remix";
import { Article } from "~/models";

const ArticleList: React.FC<{ articles: Array<Article> }> = ({ articles }) => {
  const { state } = useTransition();

  return (
    <div>
      {isEmpty(articles) && state === "idle" && (
        <div className="article-preview">
          <p>No articles are here... yet.</p>
        </div>
      )}
      {articles.map((article) => (
        <div className="article-preview" key={article.slug}>
          <div className="article-meta">
            <Link to={`/profile/${article.author.username}`}>
              <img src="http://i.imgur.com/Qr71crq.jpg" />
            </Link>
            <div className="info">
              <Link
                to={`/profile/${article.author.username}`}
                className="author"
              >
                {article.author.username}
              </Link>
              <span className="date">
                {new Date(article.createdAt).toLocaleDateString()}
              </span>
            </div>
            <button className="btn btn-outline-primary btn-sm pull-xs-right">
              <i className="ion-heart"></i> {article.favoritesCount}
            </button>
          </div>
          <Link to={`/article/${article.slug}`} className="preview-link">
            <h1>{article.title}</h1>
            <p>{article.description}</p>
            <span>Read more...</span>
          </Link>
        </div>
      ))}
      {(state === "loading" || state === "submitting") && (
        <div className="article-preview">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default ArticleList;
