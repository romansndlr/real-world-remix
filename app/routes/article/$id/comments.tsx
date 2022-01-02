import { Comment, User } from "@prisma/client";
import { orderBy } from "lodash";
import { json, Link, LoaderFunction, Outlet, useLoaderData } from "remix";
import { getAuthUser } from "~/services";
import { db } from "~/utils";

interface ArticleCommentsLoader {
  comments: Array<Comment & { author: User }>;
  authUser: User;
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

const ArticleComments = () => {
  const { comments, authUser } = useLoaderData<ArticleCommentsLoader>();

  return (
    <div>
      <Outlet />
      {orderBy(comments, ["createdAt"], ["desc"]).map(
        ({ body, author, createdAt, id }) => (
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
              {authUser.id === author.id && (
                <span className="mod-options">
                  <Link to={String(id)}>
                    <i style={{ color: "#333" }} className="ion-edit"></i>
                  </Link>
                  <i className="ion-trash-a"></i>
                </span>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ArticleComments;
