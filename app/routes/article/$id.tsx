import { Article, Favorites, Follows, Tag, User } from "@prisma/client";
import { Form, json, Link, LoaderFunction, Outlet, redirect, useLoaderData } from "remix";
import { FavoriteArticleButton, FollowAuthorButton } from "~/components";
import { getAuthUser } from "~/services";
import { db } from "~/utils";

interface ArticleLoader {
  article: Article & { author: User & { followers: Follows[] }; favorited: Favorites[]; tags: Tag[] };
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
      author: {
        include: {
          followers: true,
        },
      },
      favorited: true,
      tags: true,
    },
  });

  return json({ article, authUser });
};

const Article = () => {
  const { article, authUser } = useLoaderData<ArticleLoader>();

  const isFavorited = article.favorited.find(({ userId }) => userId === authUser?.id);

  const isFollowing = article.author.followers.find(({ followerId }) => followerId === authUser?.id);

  const ArticleMeta = () => (
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
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
