import { Article, Favorites, Tag, User } from "@prisma/client";
import { json, LoaderFunction, useLoaderData } from "remix";
import { ArticleList } from "~/components";
import { db, getUserId } from "~/utils";
import { getAuthUser } from "~/services";

interface MyFeedLoader {
  articles: Array<Article & { author: User; tags: Tag[]; favorited: Favorites[] }>;
  user: User;
  articlesCount: number;
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  const url = new URL(request.url);

  const offset = url.searchParams.get("offset");

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
        followers: {
          some: {
            followerId: userId,
          },
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
      author: {
        followers: {
          some: {
            followerId: userId,
          },
        },
      },
    },
  });

  const user = await getAuthUser(request);

  return json({ user, articles, articlesCount });
};

export default function MyFeed() {
  const { articles, articlesCount, user } = useLoaderData<MyFeedLoader>();

  return <ArticleList articles={articles} articlesCount={articlesCount} authUser={user} />;
}
