import * as React from "react";
import { Comment, User } from "@prisma/client";
import { Form, useTransition } from "remix";

interface CommentFormProps {
  authUser: User;
  comment?: Comment;
}

const CommentForm: React.FunctionComponent<CommentFormProps> = ({
  authUser,
  comment,
}) => {
  const { submission } = useTransition();

  return (
    <Form method="post" className="card comment-form" reloadDocument>
      <fieldset disabled={!!submission}>
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
            {comment ? "Update" : "Post"} Comment
          </button>
        </div>
      </fieldset>
    </Form>
  );
};

export default CommentForm;
