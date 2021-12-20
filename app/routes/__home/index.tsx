import { LoaderFunction, redirect } from "remix";
import { getSession } from "~/sessions";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);

  const user = session.get("user");

  return redirect(user ? "/feed" : "/global");
};
