import React from "react";
import axios from "axios";
import classNames from "classnames";
import {
  json,
  Link,
  LoaderFunction,
  NavLink,
  useLoaderData,
  Outlet,
} from "remix";

interface HomeLoader {
  tags: string[];
}

export const loader: LoaderFunction = async () => {
  const { data } = await axios.get("https://api.realworld.io/api/tags");

  return json(data);
};

export default function Home() {
  const { tags } = useLoaderData<HomeLoader>();

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>
      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <NavLink
                    to="/feed"
                    className={({ isActive }) =>
                      classNames("nav-link", { active: isActive })
                    }
                  >
                    Your Feed
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      classNames("nav-link", { active: isActive })
                    }
                  >
                    Global Feed
                  </NavLink>
                </li>
              </ul>
            </div>
            <Outlet />
          </div>
          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <div className="tag-list">
                {tags.length === 0 && <p>No tags are here... yet.</p>}
                {tags.map((tag, i) => (
                  <Link to={`/${tag}`} className="tag-pill tag-default" key={i}>
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
