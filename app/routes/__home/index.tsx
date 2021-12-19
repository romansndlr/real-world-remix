import axios from "axios";
import { json, LoaderFunction, useLoaderData } from "remix";
import ArticleList from "~/components";
import { Article } from "~/models";
import { getSession, redirectWithSession } from "~/sessions";

interface HomeIndexLoader {
  articles: Array<Article>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);

  const user = session.get("user");

  if (user) {
    return redirectWithSession("/feed", session);
  }

  const { data } = await axios.get("https://api.realworld.io/api/articles");

  return json(data);
};

export default function HomeIndex() {
  const { articles } = useLoaderData<HomeIndexLoader>();

  return <ArticleList articles={articles} />;
}
