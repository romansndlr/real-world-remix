import { User } from "@prisma/client";
import React from "react";
import { ActionFunction, json, Link, LoaderFunction, useFetcher, useLoaderData } from "remix";
import { getAuthUser } from "~/services";
import { db } from "~/utils";

interface NewCommentLoader {
  authUser: User | null;
}

export const loader: LoaderFunction = async ({ request }) => {
  const authUser = await getAuthUser(request);

  return json({ authUser });
};

export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params;

  const { body } = Object.fromEntries(await request.formData());

  const authUser = await getAuthUser(request);

  if (authUser) {
    const comment = await db.comment.create({
      data: {
        body: String(body),
        author: {
          connect: {
            id: authUser.id,
          },
        },
        article: {
          connect: {
            id: Number(id),
          },
        },
      },
    });

    return json({ comment });
  }
};

const NewComment = () => {
  const { Form, submission, type } = useFetcher();
  const { authUser } = useLoaderData<NewCommentLoader>();
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (type === "done") {
      formRef.current?.reset();
    }
  }, [type]);

  return authUser ? (
    <Form method="post" className="card comment-form" ref={formRef}>
      <fieldset disabled={!!submission}>
        <div className="card-block">
          <textarea name="body" className="form-control" placeholder="Write a comment..." rows={3}></textarea>
        </div>
        <div className="card-footer">
          <img src={authUser?.image || ""} className="comment-author-img" />
          <button type="submit" className="btn btn-sm btn-primary">
            Post{!!submission ? "ing..." : ""} Comment
          </button>
        </div>
      </fieldset>
    </Form>
  ) : (
    <p>
      <Link to="/login">Sign in</Link> or <Link to="/register">sign up</Link> to add comments on this article.
    </p>
  );
};

export default NewComment;
