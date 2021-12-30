import { Article, Favorites, Tag, User } from "@prisma/client";
import { json, Link, LoaderFunction, redirect, useLoaderData } from "remix";
import { FavoriteArticleButton } from "~/components";
import { getAuthUser } from "~/services";
import { db } from "~/utils";

interface ArticleLoader {
  article: Article & { author: User; favorited: Favorites[]; tags: Tag[] };
  authUser: User;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const { id } = params;

  if (!id) {
    return redirect("/");
  }

  const authUser = await getAuthUser(request);

  const article = await await db.article.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      author: true,
      favorited: true,
      tags: true,
    },
  });

  return json({ article, authUser });
};

const Article = () => {
  const { article, authUser } = useLoaderData<ArticleLoader>();

  const isFavorited = article.favorited.find(
    ({ userId }) => userId === authUser?.id
  );

  const ArticleMeta = () => (
    <div className="article-meta">
      <Link to={`/profile/${article.author.username}`}>
        <img src={article.author.image || ""} />
      </Link>
      <div className="info">
        <Link to={`/profile/${article.author.username}`}>
          {article.author.username}
        </Link>
        <span className="date">
          {new Date(article.createdAt).toLocaleDateString()}
        </span>
      </div>
      {article.author.id === authUser.id ? (
        <span>
          <Link
            className="btn btn-outline-secondary btn-sm"
            to={`/editor/${article.id}`}
          >
            <i className="ion-edit"></i> Edit Article
          </Link>
          &nbsp;&nbsp;
          <button className="btn btn-outline-danger btn-sm">
            <i className="ion-trash-a"></i> Delete Article
          </button>
        </span>
      ) : (
        <span>
          <button className="btn btn-sm btn-outline-secondary">
            <i className="ion-plus-round"></i>
            &nbsp; Follow Eric Simons <span className="counter">(10)</span>
          </button>
          &nbsp;&nbsp;
          <FavoriteArticleButton
            style={{ display: "inline-flex" }}
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

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <ArticleMeta />
        </div>
      </div>
      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <p>{article.body}</p>
            <ul className="tag-list">
              {article.tags.map((tag) => (
                <li className="tag-default tag-pill tag-outline" key={tag.id}>
                  {tag.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <hr />
        <div className="article-actions">
          <ArticleMeta />
        </div>
        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <form className="card comment-form">
              <div className="card-block">
                <textarea
                  className="form-control"
                  placeholder="Write a comment..."
                  rows={3}
                ></textarea>
              </div>
              <div className="card-footer">
                <img
                  src="http://i.imgur.com/Qr71crq.jpg"
                  className="comment-author-img"
                />
                <button className="btn btn-sm btn-primary">Post Comment</button>
              </div>
            </form>

            <div className="card">
              <div className="card-block">
                <p className="card-text">
                  With supporting text below as a natural lead-in to additional
                  content.
                </p>
              </div>
              <div className="card-footer">
                <a href="" className="comment-author">
                  <img
                    src="http://i.imgur.com/Qr71crq.jpg"
                    className="comment-author-img"
                  />
                </a>
                &nbsp;
                <a href="" className="comment-author">
                  Jacob Schmidt
                </a>
                <span className="date-posted">Dec 29th</span>
              </div>
            </div>

            <div className="card">
              <div className="card-block">
                <p className="card-text">
                  With supporting text below as a natural lead-in to additional
                  content.
                </p>
              </div>
              <div className="card-footer">
                <a href="" className="comment-author">
                  <img
                    src="http://i.imgur.com/Qr71crq.jpg"
                    className="comment-author-img"
                  />
                </a>
                &nbsp;
                <a href="" className="comment-author">
                  Jacob Schmidt
                </a>
                <span className="date-posted">Dec 29th</span>
                <span className="mod-options">
                  <i className="ion-edit"></i>
                  <i className="ion-trash-a"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
