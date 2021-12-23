import axios from "axios";
import classNames from "classnames";
import {
  useParams,
  json,
  Link,
  LoaderFunction,
  NavLink,
  useLoaderData,
  Outlet,
} from "remix";
import { getSession } from "~/sessions";

interface HomeLoader {
  tags: string[];
  isAuth: boolean;
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);

  const { data } = await axios.get("tags");

  const isAuth = session.get("token");

  return json({ ...data, isAuth });
};

export default function Home() {
  const { tags, isAuth } = useLoaderData<HomeLoader>();
  const { tag } = useParams();

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
                {isAuth && (
                  <li className="nav-item">
                    <NavLink
                      prefetch="intent"
                      to="feed"
                      className={({ isActive }) =>
                        classNames("nav-link", { active: isActive })
                      }
                    >
                      Your Feed
                    </NavLink>
                  </li>
                )}
                <li className="nav-item">
                  <NavLink
                    prefetch="intent"
                    to="global"
                    end
                    className={({ isActive }) =>
                      classNames("nav-link", { active: isActive })
                    }
                  >
                    Global Feed
                  </NavLink>
                </li>
                {tag && (
                  <li className="nav-item">
                    <NavLink
                      prefetch="intent"
                      to={`/global/${tag}`}
                      className={({ isActive }) =>
                        classNames("nav-link", { active: isActive })
                      }
                    >
                      # {tag}
                    </NavLink>
                  </li>
                )}
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
