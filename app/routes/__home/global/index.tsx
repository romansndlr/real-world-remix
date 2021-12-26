import { Article, Favorites, Tag, User } from "@prisma/client";
import { json, LoaderFunction, useLoaderData } from "remix";
import { ArticleList } from "~/components";
import { getArticles } from "~/services";
import { db, getSession } from "~/utils";

interface HomeGlobalLoader {
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
  });

  if (!userId) {
    return json({ user: null, articles, articlesCount });
  }

  const user = await db.user.findUnique({ where: { id: userId } });

  return json({ user, articles, articlesCount });
};

export default function HomeGlobal() {
  const { articles, user, articlesCount } = useLoaderData<HomeGlobalLoader>();

  return (
    <ArticleList
      articles={articles}
      authUser={user}
      articlesCount={articlesCount}
    />
  );
}
