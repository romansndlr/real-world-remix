import { ActionFunction, redirect } from "remix";
import { db, getUserId } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (!userId) {
    return redirect("/login");
  }

  const { following, authorId, redirectTo } = Object.fromEntries(await request.formData());

  if (!redirectTo) {
    return new Response("redirectTo must be set", { status: 400 });
  }

  await db.user.update({
    where: {
      id: Number(authorId),
    },
    data: {
      followers: following
        ? {
            delete: {
              authorId_followerId: {
                authorId: Number(authorId),
                followerId: userId,
              },
            },
          }
        : {
            create: {
              followerId: userId,
            },
          },
    },
  });

  return redirect(String(redirectTo));
};
