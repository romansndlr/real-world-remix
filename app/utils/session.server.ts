import { createCookieSessionStorage, redirect } from "remix";

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const cookieSession = createCookieSessionStorage({
  cookie: {
    name: "conduit_session",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export function getSession(request: Request) {
  return cookieSession.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getSession(request);

  const userId = session.get("userId");

  if (!userId) return null;

  return userId;
}

export async function logout(request: Request) {
  const session = await getSession(request);

  return redirect("/", {
    headers: { "Set-Cookie": await cookieSession.destroySession(session) },
  });
}

export async function createSession(userId: number) {
  let session = await cookieSession.getSession();

  session.set("userId", userId);

  return redirect("/", {
    headers: { "Set-Cookie": await cookieSession.commitSession(session) },
  });
}
