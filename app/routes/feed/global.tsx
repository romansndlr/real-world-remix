import { Article, Favorites, Tag, User } from "@prisma/client";
import { json, LoaderFunction, useLoaderData } from "remix";
import { ArticleList } from "~/components";
import { db, getUserId } from "~/utils";
import { latest, paginated } from "~/utils/query-scopes/article";

interface GlobalFeedLoader {
  articles: Array<Article & { author: User; tags: Tag[]; favorited: Favorites[] }>;
  user: User;
  articlesCount: number;
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  const articles = await db.article.findMany({
    ...paginated(request.url),
    ...latest(),
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
