import { Article, Favorites, Tag, User } from "@prisma/client";
import { json, LoaderFunction, useLoaderData } from "remix";
import { ArticleList } from "~/components";
import { db } from "~/utils";

interface ProfileIndexLoader {
  user: User;
  articles: Array<Article & { author: User; tags: Tag[]; favorited: Favorites[] }>;
  articlesCount: number;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const username = params.username;

  const url = new URL(request.url);

  const offset = url.searchParams.get("offset");

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
      author: {
        id: user?.id,
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
      author: {
        id: user?.id,
      },
    },
  });

  return json({ user, articles, articlesCount });
};

const ProfileIndex = () => {
  const { articles, articlesCount, user } = useLoaderData<ProfileIndexLoader>();

  return <ArticleList articles={articles} articlesCount={articlesCount} authUser={user} />;
};

export default ProfileIndex;
