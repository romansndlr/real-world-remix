import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  useLoaderData,
} from "remix";
import { CommentForm } from "~/components";
import { getAuthUser } from "~/services";
import { db } from "~/utils";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { commentId } = params;

  const authUser = await getAuthUser(request);

  if (!commentId) {
    return json({ authUser, comment: null });
  }

  const comment = await db.comment.findUnique({
    where: {
      id: Number(commentId),
    },
  });

  return json({ authUser, comment });
};

export const action: ActionFunction = async ({ request, params }) => {
  const { commentId, id } = params;

  const { body } = Object.fromEntries(await request.formData());

  const authUser = await getAuthUser(request);

  if (authUser) {
    await db.comment.update({
      where: {
        id: Number(commentId),
      },
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

  return redirect(`/article/${id}/comments/new`);
};

const EditComment = () => {
  const { authUser, comment } = useLoaderData();

  return <CommentForm authUser={authUser} comment={comment} />;
};

export default EditComment;
