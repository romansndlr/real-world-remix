import { Article, Favorites, Tag, User } from "@prisma/client";
import { json, LoaderFunction, useLoaderData } from "remix";
import { ArticleList } from "~/components";
import { db, getUserId } from "~/utils";
import { latest, paginated, whereAssociatedToTag } from "~/utils/query-scopes/article";

interface TagFeedLoader {
  articles: Array<Article & { author: User; tags: Tag[]; favorited: Favorites[] }>;
  user: User;
  articlesCount: number;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await getUserId(request);

  const { tag } = params;

  if (!tag) {
    return json("Something went wrong, please try again", 500);
  }

  const articles = await db.article.findMany({
    ...paginated(request.url),
    ...latest(),
    ...whereAssociatedToTag(tag),
    include: {
      author: true,
      tags: true,
      favorited: true,
    },
  });

  const articlesCount = await db.article.count(whereAssociatedToTag(tag));

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
