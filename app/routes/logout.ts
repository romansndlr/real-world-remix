import { ActionFunction } from "remix";
import { logout } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  return await logout(request);
};
