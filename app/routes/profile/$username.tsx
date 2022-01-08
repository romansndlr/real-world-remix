import { Article, Favorites, Tag, User } from "@prisma/client";
import { json, LoaderFunction, useLoaderData } from "remix";
import { ArticleList } from "~/components";
import { db } from "~/utils";
import { latest, paginated, whereAuthorIs } from "~/utils/query-scopes/article";

interface ProfileIndexLoader {
  user: User;
  articles: Array<Article & { author: User; tags: Tag[]; favorited: Favorites[] }>;
  articlesCount: number;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const username = params.username;

  const user = await db.user.findUnique({ where: { username } });

  if (!user) {
    return json(`Can't find a user with the username: ${username}`, 400);
  }

  const articles = await db.article.findMany({
    ...paginated(request.url),
    ...latest(),
    ...whereAuthorIs(user.id),
    include: {
      author: true,
      tags: true,
      favorited: true,
    },
  });

  const articlesCount = await db.article.count(whereAuthorIs(user.id));

  return json({ user, articles, articlesCount });
};

const ProfileIndex = () => {
  const { articles, articlesCount, user } = useLoaderData<ProfileIndexLoader>();

  return <ArticleList articles={articles} articlesCount={articlesCount} authUser={user} />;
};

export default ProfileIndex;
