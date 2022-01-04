import { Article, Favorites, Tag, User } from "@prisma/client";
import { json, LoaderFunction, useLoaderData } from "remix";
import { ArticleList } from "~/components";
import { db, getUserId } from "~/utils";

interface TagFeedLoader {
  articles: Array<Article & { author: User; tags: Tag[]; favorited: Favorites[] }>;
  user: User;
  articlesCount: number;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await getUserId(request);

  const { tag } = params;

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
      tags: {
        some: {
          name: tag,
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
      tags: {
        some: {
          name: tag,
        },
      },
    },
  });

  if (!userId) {
    return json({ user: null, articles, articlesCount });
  }

  const user = await db.user.findUnique({ where: { id: userId } });

  return json({ user, articles, articlesCount });
};

export default function TagFeedLoader() {
  const { articles, user, articlesCount } = useLoaderData<TagFeedLoader>();

  return <ArticleList articles={articles} authUser={user} articlesCount={articlesCount} />;
}
