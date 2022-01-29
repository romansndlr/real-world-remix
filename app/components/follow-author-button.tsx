import classNames from "classnames";
import { FC } from "react";
import { Form, useFetcher } from "remix";

interface FollowAuthorButtonProps {
  authorId: number;
  isFollowing?: boolean;
  followersCount?: number;
  className?: string;
}

const FollowAuthorButton: FC<FollowAuthorButtonProps> = ({
  isFollowing,
  authorId,
  followersCount,
  children,
  className,
}) => {
  const { Form, submission } = useFetcher();

  return (
    <Form method="post" action={`/profile/${authorId}/follow`}>
      <input type="hidden" name="authorId" value={authorId} />
      <input type="hidden" name="following" value={isFollowing ? "1" : ""} />
      <button
        disabled={!!submission}
        type="submit"
        className={classNames(
          "btn btn-sm",
          {
            "btn-outline-secondary": !isFollowing,
            "btn-secondary": isFollowing,
          },
          className
        )}
      >
        <i
          className={classNames({
            "ion-plus-round": !isFollowing,
            "ion-minus-round": isFollowing,
          })}
        ></i>
        &nbsp; {isFollowing ? "Unfollow" : "Follow"} {children}{" "}
        {!!followersCount && followersCount > 0 && <span className="counter">({followersCount})</span>}
      </button>
    </Form>
  );
};

export default FollowAuthorButton;
