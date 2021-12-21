import * as React from "react";
import { json, LoaderFunction, Outlet, useLoaderData } from "remix";
import type { LinksFunction } from "remix";
import { getSession, jsonWithSession, redirectWithSession } from "./sessions";
import axios from "axios";
import { NavLinks, Document, Layout } from "./components";

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

  const token = session.get("token");

  const alert = session.get("alert");

  axios.defaults.baseURL = "https://api.realworld.io/api/";

  if (!token) {
    return jsonWithSession({ user: null }, session);
  }

  axios.defaults.headers.common["Authorization"] = `Token ${session.get(
    "token"
  )}`;

  try {
    const { data } = await axios.get("user");

    return jsonWithSession({ user: data.user, alert }, session);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      session.flash("alert", error.response?.data);
    }

    return jsonWithSession({ user: null }, session);
  }
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

export { default as CatchBoundary } from "./components/CatchBoundary";
export { default as ErrorBoundary } from "./components/ErrorBoundary";
