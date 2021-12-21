import { LoaderFunction, redirect } from "remix";
import { getSession } from "~/sessions";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);

  const isAuth = session.get("token");

  return redirect(isAuth ? "/feed" : "/global");
};
