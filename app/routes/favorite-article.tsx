import axios from "axios";
import { ActionFunction, redirect } from "remix";
import { getSession, redirectWithSession } from "~/sessions";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request);

  const token = session.get("token");

  if (!token) {
    return redirectWithSession("/login", session);
  }

  const form = await request.formData();

  const favorited = form.get("favorited");
  const slug = form.get("slug");

  await axios[!!favorited ? "delete" : "post"](`/articles/${slug}/favorite`);

  return redirect("..");
};
