import { ActionFunction, json, redirect } from "remix";
import { db, getUserId } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (!userId) {
    return redirect("/login");
  }

  const { favorited, articleId } = Object.fromEntries(await request.formData());

  const article = await db.article.update({
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
              userId: Number(userId),
            },
          },
    },
  });

  return json({ article });
};
