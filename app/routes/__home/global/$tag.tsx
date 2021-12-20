import axios from "axios";
import { json, LoaderFunction, useLoaderData } from "remix";
import { ArticleList } from "~/components";
import { Article } from "~/models";

interface HomeTagLoader {
  articles: Array<Article>;
}

export const loader: LoaderFunction = async ({ params }) => {
  try {
    const { data } = await axios.get("https://api.realworld.io/api/articles", {
      params: {
        tag: params.tag,
      },
    });

    return json(data);
  } catch (error) {
    //
  }

  return json({ articles: [] });
};

export default function HomeTag() {
  const { articles } = useLoaderData<HomeTagLoader>();

  return <ArticleList articles={articles} />;
}
