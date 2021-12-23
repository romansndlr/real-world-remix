import axios from "axios";
import { json, LoaderFunction, useLoaderData } from "remix";
import { ArticleList } from "~/components";
import { Article } from "~/models";

interface HomeFeedLoader {
  articles: Array<Article>;
}

export const loader: LoaderFunction = async () => {
  const { data } = await axios.get("articles/feed");

  return json(data);
};

export default function HomeFeed() {
  const { articles } = useLoaderData<HomeFeedLoader>();

  return <ArticleList articles={articles} />;
}
