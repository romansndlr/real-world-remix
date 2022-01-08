import { redirect } from "remix";
import getSession from "./get-session.server";
import cookieSession from "./session.server";

export default async function (request: Request) {
  const session = await getSession(request);

  return redirect("/", {
    headers: { "Set-Cookie": await cookieSession.destroySession(session) },
  });
}
