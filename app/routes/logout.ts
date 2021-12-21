import axios from "axios";
import { ActionFunction } from "remix";
import { getSession, redirectAndDestroySession } from "~/sessions";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request);

  delete axios.defaults.headers.common["Authorization"];

  return redirectAndDestroySession("/", session);
};
