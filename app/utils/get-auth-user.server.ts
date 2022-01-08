import db from "./db.server";
import getUserId from "./get-user-id.server";
import logout from "./logout.server";

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
