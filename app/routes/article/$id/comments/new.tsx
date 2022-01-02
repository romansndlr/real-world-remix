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

export const loader: LoaderFunction = async ({ request }) => {
  const authUser = await getAuthUser(request);

  return json({ authUser });
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

    return redirect(`/article/${id}/comments/new`);
  }
};

const NewComment = () => {
  const { authUser } = useLoaderData();

  return <CommentForm authUser={authUser} />;
};

export default NewComment;
