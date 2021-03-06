import { Article, Favorites, Tag, User } from "@prisma/client";
import { json, LoaderFunction, useLoaderData } from "remix";
import { ArticleList } from "~/components";
import { db, getUserId } from "~/utils";
import { getAuthUser } from "~/utils";
import { latest, paginated, whereFollowedBy } from "~/utils/query-scopes/article";

interface MyFeedLoader {
  articles: Array<Article & { author: User; tags: Tag[]; favorited: Favorites[] }>;
  user: User;
  articlesCount: number;
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  const articles = await db.article.findMany({
    ...paginated(request.url),
    ...latest(),
    ...(await whereFollowedBy(userId)),
    include: {
      tags: true,
      author: true,
      favorited: true,
    },
  });

  const articlesCount = await db.article.count(await whereFollowedBy(userId));

  const user = await getAuthUser(request);

  return json({ user, articles, articlesCount });
};

export default function MyFeed() {
  const { articles, articlesCount, user } = useLoaderData<MyFeedLoader>();

  return <ArticleList articles={articles} articlesCount={articlesCount} authUser={user} />;
}
