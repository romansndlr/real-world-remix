import * as React from "react";
import { Form, useLocation, useTransition } from "remix";
import classNames from "classnames";

const FavoriteArticleButton: React.FC<{
  articleId: number;
  isFavorited: boolean;
  favoritesCount: number | string;
}> = ({ articleId, isFavorited, favoritesCount, children, ...props }) => {
  const { submission } = useTransition();
  const location = useLocation();

  return (
    <Form method="post" action="/favorite-article">
      <fieldset disabled={!!submission}>
        <input type="hidden" name="favorited" value={isFavorited ? "1" : ""} />
        <input type="hidden" name="articleId" value={articleId} />
        <input type="hidden" name="redirectTo" value={location.pathname} />
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
