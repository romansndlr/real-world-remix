import { ActionFunction, redirect } from "remix";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const favorited = form.get("favorited");

  return redirect("/global");
};
