import { json, LoaderFunction, useLoaderData } from "remix";
import { ArticleList } from "~/components";
import { getArticles } from "~/services";
import { db } from "~/utils";

export const loader: LoaderFunction = async ({ request, params }) => {
  const username = params.username;

  const url = new URL(request.url);

  const offset = url.searchParams.get("offset");

  const user = await db.user.findUnique({ where: { username } });

  if (!user) {
    return json({ user: null, articles: [], articlesCount: 0 });
  }

  const { articles, articlesCount } = await getArticles({
    offset: Number(offset),
    userId: user.id,
  });

  return json({ user, articles, articlesCount });
};

const ProfileIndex = () => {
  const { articles, articlesCount, user } = useLoaderData();

  return (
    <ArticleList
      articles={articles}
      articlesCount={articlesCount}
      authUser={user}
    />
  );
};

export default ProfileIndex;
