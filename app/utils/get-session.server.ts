import cookieSession from "./session.server";

export default async function getSession(request: Request) {
  return await cookieSession.getSession(request.headers.get("Cookie"));
}
