import { ActionFunction, redirect } from "remix";
import { db, getUserId } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (!userId) {
    return redirect("/login");
  }

  const { favorited, articleId, referer } = Object.fromEntries(
    await request.formData()
  );

  if (!referer) {
    return new Response("Referer must be set", { status: 400 });
  }

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
              userId: Number(userId),
            },
          },
    },
  });

  return redirect(String(referer));
};
