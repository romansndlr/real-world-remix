import { Article, Favorites, Tag, User } from "@prisma/client";
import { json, LoaderFunction, useLoaderData } from "remix";
import { ArticleList } from "~/components";
import { db, getUserId } from "~/utils";

interface GlobalFeedLoader {
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
    include: {
      author: true,
      tags: true,
      favorited: true,
    },
  });

  const articlesCount = await db.article.count();

  if (!userId) {
    return json({ user: null, articles, articlesCount });
  }

  const user = await db.user.findUnique({ where: { id: userId } });

  return json({ user, articles, articlesCount });
};

export default function GlobalFeed() {
  const { articles, user, articlesCount } = useLoaderData<GlobalFeedLoader>();

  return <ArticleList articles={articles} authUser={user} articlesCount={articlesCount} />;
}
