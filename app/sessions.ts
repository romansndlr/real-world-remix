import { createCookieSessionStorage, redirect, Session } from "remix";

const cookieSession = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  },
});

async function getSession(request: Request): Promise<Session> {
  return await cookieSession.getSession(request.headers.get("Cookie"));
}

async function getHeaders(session: Session) {
  return {
    "Set-Cookie": await cookieSession.commitSession(session),
  };
}

async function redirectWithSession(path: string, session: Session) {
  const headers = await getHeaders(session);

  return redirect(path, { headers });
}

export { getSession, getHeaders, redirectWithSession };
