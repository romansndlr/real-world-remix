import { json, LoaderFunction, Outlet, useLoaderData } from "remix";
import type { LinksFunction } from "remix";
import { NavLinks, Document, Layout } from "./components";
import { commitSession, db, getSession } from "./utils";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: "//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css",
    },
    {
      rel: "stylesheet",
      href: "//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic",
    },
    { rel: "stylesheet", href: "//demo.productionready.io/main.css" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");

  const alert = session.get("alert");

  const init = alert
    ? {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    : undefined;

  if (!userId) {
    return json({ user: null, alert }, init);
  }

  const user = await db.user.findUnique({ where: { id: userId } });

  return json({ user, alert }, init);
};

export default function App() {
  const { user, alert } = useLoaderData();

  return (
    <Document title="Conduit">
      <Layout alert={alert} navLinks={<NavLinks user={user} />}>
        <Outlet />
      </Layout>
    </Document>
  );
}

export { default as CatchBoundary } from "./components/catch-boundary";
export { default as ErrorBoundary } from "./components/error-boundary";
