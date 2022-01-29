import { ActionFunction, json, redirect } from "remix";
import { db, getUserId } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (!userId) {
    return redirect("/login");
  }

  const { following, authorId } = Object.fromEntries(await request.formData());

  const user = await db.user.update({
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

  return json({ user });
};
