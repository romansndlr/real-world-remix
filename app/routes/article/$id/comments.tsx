import { Comment, User } from "@prisma/client";
import { orderBy } from "lodash";
import {
  ActionFunction,
  Form,
  json,
  Link,
  LoaderFunction,
  redirect,
  useLoaderData,
  useTransition,
} from "remix";
import { getAuthUser } from "~/services";
import { db } from "~/utils";

interface ArticleCommentsLoader {
  comments: Array<Comment & { author: User }>;
  authUser: User;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const { id } = params;

  const comments = await db.comment.findMany({
    where: {
      articleId: Number(id),
    },
    include: {
      author: true,
    },
  });

  const authUser = await getAuthUser(request);

  return json({ comments, authUser });
};

export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params;

  const { body } = Object.fromEntries(await request.formData());

  const authUser = await getAuthUser(request);

  if (authUser) {
    await db.comment.create({
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
  }

  return redirect(`/article/${id}/comments`);
};

const ArticleComments = () => {
  const { comments, authUser } = useLoaderData<ArticleCommentsLoader>();
  const { submission } = useTransition();

  return (
    <div>
      <Form method="post" className="card comment-form" reloadDocument>
        <fieldset disabled={!!submission}>
          <div className="card-block">
            <textarea
              name="body"
              className="form-control"
              placeholder="Write a comment..."
              rows={3}
            ></textarea>
          </div>
          <div className="card-footer">
            <img src={authUser.image || ""} className="comment-author-img" />
            <button type="submit" className="btn btn-sm btn-primary">
              Post Comment
            </button>
          </div>
        </fieldset>
      </Form>
      {orderBy(comments, ["createdAt"], ["desc"]).map(
        ({ body, author, createdAt }) => (
          <div className="card">
            <div className="card-block">
              <p className="card-text">{body}</p>
            </div>
            <div className="card-footer">
              <Link
                to={`/profile/${author.username}`}
                className="comment-author"
              >
                <img src={author.image || ""} className="comment-author-img" />
              </Link>
              &nbsp;
              <Link
                to={`/profile/${author.username}`}
                className="comment-author"
              >
                {author.username}
              </Link>
              <span className="date-posted">
                {new Date(createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ArticleComments;
