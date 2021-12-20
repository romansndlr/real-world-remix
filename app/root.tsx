import * as React from "react";
import {
  json,
  Link,
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useLocation,
} from "remix";
import type { LinksFunction } from "remix";
import classNames from "classnames";
import { useMatch } from "react-router";
import { getSession } from "./sessions";
import { User } from "./models";

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
  const session = await getSession(request);

  const user = session.get("user");

  return json({ user });
};

export default function App() {
  const { user } = useLoaderData();

  return (
    <Document title="Conduit">
      <Layout user={user}>
        <Outlet />
      </Layout>
    </Document>
  );
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <RouteChangeAnnouncement />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

function Layout({ children, user }: React.PropsWithChildren<{ user: User }>) {
  const matchFeed = useMatch("/feed");
  const matchGlobal = useMatch("/global");
  const matchTag = useMatch("/global/:tag");

  return (
    <div>
      <header>
        <nav className="navbar navbar-light">
          <div className="container">
            <Link className="navbar-brand" to="/">
              conduit
            </Link>
            <ul className="nav navbar-nav pull-xs-right">
              <li className="nav-item">
                <NavLink
                  prefetch="intent"
                  className={classNames("nav-link", {
                    active: matchFeed || matchGlobal || matchTag,
                  })}
                  to="/"
                >
                  Home
                </NavLink>
              </li>
              {user && (
                <>
                  <li className="nav-item">
                    <NavLink
                      prefetch="intent"
                      className={({ isActive }) =>
                        classNames("nav-link", { active: isActive })
                      }
                      to="editor"
                    >
                      <i className="ion-compose"></i>&nbsp;New Article
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      prefetch="intent"
                      className={({ isActive }) =>
                        classNames("nav-link", { active: isActive })
                      }
                      to="settings"
                    >
                      <i className="ion-gear-a"></i>&nbsp;Settings
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to={`/@${user?.username}`}>
                      <img
                        style={{
                          width: 24,
                          height: 24,
                          marginRight: 4,
                          borderRadius: "50%",
                        }}
                        src={user?.image}
                      />
                      {user?.username}
                    </NavLink>
                  </li>
                </>
              )}
              {!user && (
                <>
                  <li className="nav-item">
                    <NavLink
                      prefetch="intent"
                      className={({ isActive }) =>
                        classNames("nav-link", { active: isActive })
                      }
                      to="login"
                    >
                      Sign in
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      prefetch="intent"
                      className={({ isActive }) =>
                        classNames("nav-link", { active: isActive })
                      }
                      to="register"
                    >
                      Sign up
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <div className="container">
          <a href="/" className="logo-font">
            conduit
          </a>
          <span className="attribution">
            An interactive learning project from{" "}
            <a href="https://thinkster.io">Thinkster</a>. Code &amp; design
            licensed under MIT.
          </span>
        </div>
      </footer>
    </div>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Error!">
      <Layout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
        </div>
      </Layout>
    </Document>
  );
}

const RouteChangeAnnouncement = React.memo(() => {
  let [hydrated, setHydrated] = React.useState(false);
  let [innerHtml, setInnerHtml] = React.useState("");
  let location = useLocation();

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  let firstRenderRef = React.useRef(true);
  React.useEffect(() => {
    // Skip the first render because we don't want an announcement on the
    // initial page load.
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    let pageTitle = location.pathname === "/" ? "Home page" : document.title;
    setInnerHtml(`Navigated to ${pageTitle}`);
  }, [location.pathname]);

  // Render nothing on the server. The live region provides no value unless
  // scripts are loaded and the browser takes over normal routing.
  if (!hydrated) {
    return null;
  }

  return (
    <div
      aria-live="assertive"
      aria-atomic
      id="route-change-region"
      style={{
        border: "0",
        clipPath: "inset(100%)",
        clip: "rect(0 0 0 0)",
        height: "1px",
        margin: "-1px",
        overflow: "hidden",
        padding: "0",
        position: "absolute",
        width: "1px",
        whiteSpace: "nowrap",
        wordWrap: "normal",
      }}
    >
      {innerHtml}
    </div>
  );
});
