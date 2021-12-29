import { Article, Favorites, Tag, User } from "@prisma/client";
import { json, LoaderFunction, useLoaderData } from "remix";
import { ArticleList } from "~/components";
import { db, getSession } from "~/utils";
import { getArticles } from "~/services";

interface MyFeedLoader {
  articles: Array<
    Article & { author: User; tags: Tag[]; favorited: Favorites[] }
  >;
  user: User;
  articlesCount: number;
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");

  const url = new URL(request.url);

  const offset = url.searchParams.get("offset");

  const { articles, articlesCount } = await getArticles({
    offset: Number(offset),
    userId,
  });

  if (!userId) {
    return json({ user: null, articles, articlesCount });
  }

  const user = await db.user.findUnique({ where: { id: userId } });

  return json({ user, articles, articlesCount });
};

export default function MyFeed() {
  const { articles, articlesCount, user } = useLoaderData<MyFeedLoader>();

  return (
    <ArticleList
      articles={articles}
      articlesCount={articlesCount}
      authUser={user}
    />
  );
}
