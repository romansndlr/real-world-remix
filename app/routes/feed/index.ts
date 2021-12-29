import { LoaderFunction, redirect } from "remix";
import { getSession } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");

  return redirect(userId ? "/feed/my" : "/feed/global");
};
