import { LoaderFunction, redirect } from "remix";
import { getUserId } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  return redirect(userId ? "/feed/my" : "/feed/global");
};
