import { createCookie, createFileSessionStorage } from "remix";

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const cookie = createCookie("__session", {
  secrets: [sessionSecret],
  sameSite: true,
});

const { getSession, commitSession, destroySession } = createFileSessionStorage({
  dir: "app/sessions",
  cookie,
});

export { getSession, commitSession, destroySession };
