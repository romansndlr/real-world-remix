import { createCookieSessionStorage, json, redirect, Session } from "remix";

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

async function redirectWithSession(path: string, session: Session) {
  return redirect(path, {
    headers: {
      "Set-Cookie": await cookieSession.commitSession(session),
    },
  });
}

async function jsonWithSession(data: any, session: Session) {
  return json(data, {
    headers: {
      "Set-Cookie": await cookieSession.commitSession(session),
    },
  });
}

async function redirectAndDestroySession(path: string, session: Session) {
  return redirect("/", {
    headers: { "Set-Cookie": await cookieSession.destroySession(session) },
  });
}

export {
  getSession,
  redirectWithSession,
  redirectAndDestroySession,
  jsonWithSession,
};
