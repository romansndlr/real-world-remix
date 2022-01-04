import * as React from "react";
import { Comment, User } from "@prisma/client";
import { useFetcher } from "remix";
import { isNil } from "lodash";

interface CommentFormProps {
  authUser: User;
  comment?: Comment;
}

const CommentForm: React.FunctionComponent<CommentFormProps> = ({ authUser, comment }) => {
  const { Form, submission, state, type } = useFetcher();
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (type === "done" && isNil(comment)) {
      formRef.current?.reset();
    }
  }, [type]);

  const buttonText = React.useMemo(() => {
    if (state === "loading" || state === "submitting") {
      return "Submitting...";
    }

    return `${comment ? "Update" : "Post"} comment`;
  }, [state]);

  return (
    <Form method="post" className="card comment-form" ref={formRef}>
      <fieldset disabled={!!submission}>
        <input type="hidden" name="id" value={comment?.id} />
        <div className="card-block">
          <textarea
            defaultValue={comment?.body}
            name="body"
            className="form-control"
            placeholder="Write a comment..."
            rows={3}
          ></textarea>
        </div>
        <div className="card-footer">
          <img src={authUser.image || ""} className="comment-author-img" />
          <button type="submit" className="btn btn-sm btn-primary">
            {buttonText}
          </button>
        </div>
      </fieldset>
    </Form>
  );
};

export default CommentForm;
