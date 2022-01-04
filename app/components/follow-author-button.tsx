import classNames from "classnames";
import { FC } from "react";
import { Form, useLocation, useTransition } from "remix";

interface FollowAuthorButtonProps {
  authorId: number;
  isFollowing: boolean;
  followersCount: number;
}

const FollowAuthorButton: FC<FollowAuthorButtonProps> = ({ isFollowing, authorId, followersCount, children }) => {
  const { submission } = useTransition();
  const location = useLocation();

  return (
    <Form method="post" action="/follow-author">
      <input type="hidden" name="authorId" value={authorId} />
      <input type="hidden" name="following" value={isFollowing ? "1" : ""} />
      <input type="hidden" name="redirectTo" value={location.pathname} />
      <button
        disabled={!!submission}
        type="submit"
        className={classNames("btn btn-sm", {
          "btn-outline-secondary": !isFollowing,
          "btn-secondary": isFollowing,
        })}
      >
        <i
          className={classNames({
            "ion-plus-round": !isFollowing,
            "ion-minus-round": isFollowing,
          })}
        ></i>
        &nbsp; {isFollowing ? "Unfollow" : "Follow"} {children} <span className="counter">({followersCount})</span>
      </button>
    </Form>
  );
};

export default FollowAuthorButton;
