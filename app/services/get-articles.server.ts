import { Article } from "@prisma/client";
import { db } from "~/utils";

interface GetArticlesArgs {
  offset?: number;
  tag?: string;
  userId?: number;
  favoritedBy?: number;
}

export default async function getArticles({
  offset = 0,
  tag,
  userId,
  favoritedBy,
}: GetArticlesArgs): Promise<{ articles: Article[]; articlesCount: number }> {
  const filter = {
    tags: tag
      ? {
          some: {
            name: tag,
          },
        }
      : undefined,
    favorited: favoritedBy
      ? {
          some: {
            userId: favoritedBy,
          },
        }
      : undefined,
    author: userId
      ? {
          id: userId,
        }
      : undefined,
  };

  const articles = await db.article.findMany({
    skip: offset,
    take: 10,
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    where: filter,
    include: {
      author: true,
      tags: true,
      favorited: true,
    },
  });

  const articlesCount = await db.article.count({
    where: filter,
  });

  return {
    articles,
    articlesCount,
  };
}
