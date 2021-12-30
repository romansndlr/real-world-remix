import { db, getSession } from "~/utils";

export default async function(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");

  return  await db.user.findUnique({
    where: {
      id: userId,
    },
  });
}
