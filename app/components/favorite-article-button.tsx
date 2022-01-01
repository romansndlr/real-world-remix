import classNames from "classnames";
import * as React from "react";
import { Form, FormProps, useLocation, useTransition } from "remix";

const ACTION = "/favorite-article";

const FavoriteArticleButton: React.FC<
  {
    articleId: number;
    isFavorited: boolean;
    favoritesCount: number | string;
  } & FormProps
> = ({ articleId, isFavorited, favoritesCount, children, ...props }) => {
  const { submission } = useTransition();
  const location = useLocation();

  const formData = submission?.formData;

  const isSubmitting =
    submission &&
    submission.action === ACTION &&
    Number(formData?.get("id")) === Number(articleId);

  return (
    <Form method="post" action={ACTION} {...props}>
      <input type="hidden" name="favorited" value={isFavorited ? "1" : ""} />
      <input type="hidden" name="articleId" value={articleId} />
      <input type="hidden" name="referer" value={location.pathname} />
      <button
        className={classNames("btn btn-sm pull-xs-right", {
          "btn-outline-primary": !isFavorited,
          "btn-primary": isFavorited,
        })}
        disabled={isSubmitting}
      >
        {children} {favoritesCount}
      </button>
    </Form>
  );
};

export default FavoriteArticleButton;
