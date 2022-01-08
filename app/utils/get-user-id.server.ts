import getSession from "./get-session.server";

export default async function (request: Request) {
  const session = await getSession(request);

  const userId = session.get("userId");

  if (!userId) return null;

  return userId;
}
