import { LoaderFunction, redirect } from "remix";
import { getSession, redirectWithSession } from "~/sessions";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);

  const isAuth = session.get("token");

  return redirectWithSession(isAuth ? "/feed" : "/global", session);
};
