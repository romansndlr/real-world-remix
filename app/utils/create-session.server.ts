import { redirect } from "remix";
import cookieSession from "./session.server";

export default async function (userId: number) {
  let session = await cookieSession.getSession();

  session.set("userId", userId);

  return redirect("/", {
    headers: { "Set-Cookie": await cookieSession.commitSession(session) },
  });
}
