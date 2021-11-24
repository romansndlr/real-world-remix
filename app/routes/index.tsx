import axios from "axios";
import classNames from "classnames";
import React from "react";
import { createSearchParams } from "react-router-dom";
import {
  Link,
  LoaderFunction,
  useLoaderData,
  useSearchParams,
  useTransition,
} from "remix";
import type { Article } from "~/Models";

interface HomeLoader {
  articles: Array<Article>;
  tags: string[];
}

enum Feed {
  Global = "global",
  Personal = "personal",
}

export const loader: LoaderFunction = async ({ request }) => {
  const searchParams = new URL(request.url).searchParams;

  const { data: articlesData } = await axios.get(
    "https://api.realworld.io/api/articles",
    {
      params: {
        tag: searchParams.has("tag") ? searchParams.get("tag") : undefined,
      },
    }
  );

  const { data: tagsData } = await axios.get(
    "https://api.realworld.io/api/tags"
  );

  return {
    ...articlesData,
    ...tagsData,
  };
};

export default function Index() {
  const { articles, tags } = useLoaderData<HomeLoader>();
  const { state } = useTransition();
  const [searchParams] = useSearchParams();

  const updateQueryString = React.useCallback(
    (obj) =>
      `/?${createSearchParams({
        ...Object.fromEntries(searchParams),
        ...obj,
      }).toString()}`,
    []
  );

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>
      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <Link
                    to={updateQueryString({ feed: Feed.Personal })}
                    className={classNames("nav-link", {
                      active: searchParams.get("feed") === Feed.Personal,
                    })}
                  >
                    Your Feed
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to={updateQueryString({ feed: Feed.Global })}
                    className={classNames("nav-link", {
                      active: searchParams.get("feed") === Feed.Global,
                    })}
                  >
                    Global Feed
                  </Link>
                </li>
              </ul>
            </div>
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
          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <div className="tag-list">
                {tags.map((tag, i) => (
                  <Link
                    to={updateQueryString({ tag })}
                    className="tag-pill tag-default"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
