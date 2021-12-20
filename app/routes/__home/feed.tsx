import axios from "axios";
import { json, LoaderFunction, useLoaderData } from "remix";
import { ArticleList } from "~/components";
import { Article } from "~/models";

interface HomeFeedLoader {
  articles: Array<Article>;
}

export const loader: LoaderFunction = async () => {
  try {
    const { data } = await axios.get(
      "https://api.realworld.io/api/articles/feed"
    );

    return json(data);
  } catch (error) {
    //
  }

  return json({ articles: [] });
};

export default function HomeFeed() {
  const { articles } = useLoaderData<HomeFeedLoader>();

  return <ArticleList articles={articles} />;
}
