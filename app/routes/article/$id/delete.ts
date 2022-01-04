import { ActionFunction, redirect } from "remix";
import { getAuthUser } from "~/services";
import { db } from "~/utils";

export const action: ActionFunction = async ({ params, request }) => {
  const user = await getAuthUser(request);

  const { id } = params;

  try {
    await db.article.delete({
      where: {
        id: Number(id),
      },
    });
  } catch (error) {
    console.error(error);
  }

  return redirect(`/profile/${user?.username}`);
};
