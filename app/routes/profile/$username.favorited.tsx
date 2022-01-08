import { json, LoaderFunction, useLoaderData } from "remix";
import { ArticleList } from "~/components";
import { db } from "~/utils";
import { latest, paginated, whereFavoritedBy } from "~/utils/query-scopes/article";

export const loader: LoaderFunction = async ({ request, params }) => {
  const username = params.username;

  const user = await db.user.findUnique({ where: { username } });

  if (!user) {
    return json(`Can't find a user with the username: ${username}`, 400);
  }

  const articles = await db.article.findMany({
    ...paginated(request.url),
    ...latest(),
    ...whereFavoritedBy(user.id),
    include: {
      author: true,
      tags: true,
      favorited: true,
    },
  });

  const articlesCount = await db.article.count(whereFavoritedBy(user.id));

  return json({ user, articles, articlesCount });
};

const ProfileFavorited = () => {
  const { articles, articlesCount, user } = useLoaderData();

  return <ArticleList articles={articles} articlesCount={articlesCount} authUser={user} />;
};

export default ProfileFavorited;
