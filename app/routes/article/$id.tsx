import { Article, Favorites, Follows, Tag, User } from "@prisma/client";
import { Form, json, Link, LoaderFunction, Outlet, redirect, useLoaderData } from "remix";
import { ArticleMeta, FavoriteArticleButton, FollowAuthorButton } from "~/components";
import { getAuthUser } from "~/utils";
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

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <ArticleMeta article={article} authUser={authUser} />
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
          <ArticleMeta article={article} authUser={authUser} />
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
