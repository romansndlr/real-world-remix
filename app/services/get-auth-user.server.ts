import { db, getUserId, logout } from "~/utils";

export default async function (request: Request) {
  const userId = await getUserId(request);

  if (!userId) {
    return null;
  }

  try {
    return await db.user.findUnique({ where: { id: userId } });
  } catch {
    throw logout(request);
  }
}
