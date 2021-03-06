import { Comment, User } from "@prisma/client";
import { orderBy } from "lodash";
import { ActionFunction, json, Link, LoaderFunction, Outlet, useFetcher, useLoaderData } from "remix";
import { getAuthUser } from "~/utils";
import { db } from "~/utils";

interface ArticleCommentsLoader {
  comments: Array<Comment & { author: User }>;
  authUser: User | null;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const { id } = params;

  const authUser = await getAuthUser(request);

  const comments = await db.comment.findMany({
    where: {
      articleId: Number(id),
    },
    include: {
      author: true,
    },
  });

  return json({ comments, authUser });
};

export const action: ActionFunction = async ({ request, params }) => {
  const { commentId } = Object.fromEntries(await request.formData());

  const comment = await db.comment.delete({
    where: {
      id: Number(commentId),
    },
  });

  return json({ comment });
};

const ArticleComments = () => {
  const { comments, authUser } = useLoaderData<ArticleCommentsLoader>();
  const { submission, Form } = useFetcher();

  return (
    <div>
      <Outlet />
      {orderBy(comments, ["createdAt"], ["desc"]).map(({ body, author, createdAt, id }) => (
        <div className="card" key={id}>
          <div className="card-block">
            <p className="card-text">{body}</p>
          </div>
          <div className="card-footer">
            <Link to={`/profile/${author.username}`} className="comment-author">
              <img src={author.image || ""} className="comment-author-img" />
            </Link>
            &nbsp;
            <Link to={`/profile/${author.username}`} className="comment-author">
              {author.username}
            </Link>
            <span className="date-posted">{new Date(createdAt).toLocaleDateString()}</span>
            {authUser?.id === author.id && (
              <span className="mod-options">
                <Form replace method="post">
                  <input type="hidden" name="commentId" value={id} />
                  <button disabled={!!submission} type="submit" style={{ border: "none", background: "none" }}>
                    <i className="ion-trash-a"></i>
                  </button>
                </Form>
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArticleComments;
