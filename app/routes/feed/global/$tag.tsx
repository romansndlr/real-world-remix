import { Article, Favorites, Tag, User } from "@prisma/client";
import { json, LoaderFunction, useLoaderData } from "remix";
import { ArticleList } from "~/components";
import { getArticles } from "~/services";
import { db, getUserId } from "~/utils";

interface TagFeedLoader {
  articles: Array<
    Article & { author: User; tags: Tag[]; favorited: Favorites[] }
  >;
  user: User;
  articlesCount: number;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await getUserId(request);

  const url = new URL(request.url);

  const offset = url.searchParams.get("offset");

  const { articles, articlesCount } = await getArticles({
    offset: Number(offset),
    tag: params.tag as string,
  });

  if (!userId) {
    return json({ user: null, articles, articlesCount });
  }

  const user = await db.user.findUnique({ where: { id: userId } });

  return json({ user, articles, articlesCount });
};

export default function TagFeedLoader() {
  const { articles, user, articlesCount } = useLoaderData<TagFeedLoader>();

  return (
    <ArticleList
      articles={articles}
      authUser={user}
      articlesCount={articlesCount}
    />
  );
}
