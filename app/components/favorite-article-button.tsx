import * as React from "react";
import { useFetcher } from "remix";
import classNames from "classnames";

const FavoriteArticleButton: React.FC<{
  articleId: number;
  isFavorited: boolean;
  favoritesCount: number | string;
}> = ({ articleId, isFavorited, favoritesCount, children }) => {
  const { Form, submission } = useFetcher();

  return (
    <Form method="post" action={`/article/${articleId}/favorite`}>
      <fieldset disabled={!!submission}>
        <input type="hidden" name="favorited" value={isFavorited ? "1" : ""} />
        <input type="hidden" name="articleId" value={articleId} />
        <button
          className={classNames("btn btn-sm pull-xs-right", {
            "btn-outline-primary": !isFavorited,
            "btn-primary": isFavorited,
          })}
        >
          {children} {favoritesCount}
        </button>
      </fieldset>
    </Form>
  );
};

export default FavoriteArticleButton;
