import { ActionFunction, redirect } from "remix";
import { db, getSession } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");

  if (!userId) {
    return redirect("/login");
  }

  const form = await request.formData();

  const favorited = form.get("favorited");

  const articleId = form.get("id");

  const referer = form.get("referer") as string;

  await db.article.update({
    where: {
      id: Number(articleId),
    },
    data: {
      favorited: !!favorited
        ? {
            deleteMany: {
              userId: Number(userId),
            },
          }
        : {
            create: {
              userId,
            },
          },
    },
  });

  return redirect(referer);
};
