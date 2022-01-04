import { json, LoaderFunction, useLoaderData } from "remix";
import { ArticleList } from "~/components";
import { db, getUserId } from "~/utils";

export const loader: LoaderFunction = async ({ request, params }) => {
  const username = params.username;

  const url = new URL(request.url);

  const offset = url.searchParams.get("offset");

  const userId = await getUserId(request);

  const user = await db.user.findUnique({ where: { username } });

  const articles = await db.article.findMany({
    skip: Number(offset),
    take: 10,
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    where: {
      favorited: {
        some: {
          userId,
        },
      },
    },
    include: {
      author: true,
      tags: true,
      favorited: true,
    },
  });

  const articlesCount = await db.article.count({
    where: {
      favorited: {
        some: {
          userId,
        },
      },
    },
  });

  return json({ user, articles, articlesCount });
};

const ProfileFavorited = () => {
  const { articles, articlesCount, user } = useLoaderData();

  return <ArticleList articles={articles} articlesCount={articlesCount} authUser={user} />;
};

export default ProfileFavorited;
