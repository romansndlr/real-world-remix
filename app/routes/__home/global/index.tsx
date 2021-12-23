import axios from "axios";
import { json, LoaderFunction, useLoaderData } from "remix";
import { ArticleList } from "~/components";
import { Article } from "~/models";

interface HomeGlobalLoader {
  articles: Array<Article>;
}

export const loader: LoaderFunction = async () => {
  const { data } = await axios.get("https://api.realworld.io/api/articles");

  return json(data);
};

export default function HomeGlobal() {
  const { articles } = useLoaderData<HomeGlobalLoader>();

  return <ArticleList articles={articles} />;
}
