import {
  useParams,
  json,
  Link,
  LoaderFunction,
  NavLink,
  useLoaderData,
  Outlet,
} from "remix";
import { Tag } from "@prisma/client";
import { db, getUserId } from "~/utils";

interface HomeLoader {
  tags: Tag[];
  userId: number;
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  const tags = await db.tag.findMany();

  return json({ tags, userId });
};

export default function Home() {
  const { tags, userId } = useLoaderData<HomeLoader>();
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
                {userId && (
                  <li className="nav-item">
                    <NavLink
                      prefetch="intent"
                      to="/feed/my"
                      className="nav-link"
                    >
                      My Feed
                    </NavLink>
                  </li>
                )}
                <li className="nav-item">
                  <NavLink
                    prefetch="intent"
                    to="/feed/global"
                    className="nav-link"
                  >
                    Global Feed
                  </NavLink>
                </li>
                {tag && (
                  <li className="nav-item">
                    <NavLink
                      prefetch="intent"
                      to={`/feed/tag/${tag}`}
                      className="nav-link active"
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
                  <Link
                    to={`/feed/tag/${tag.name}`}
                    className="tag-pill tag-default"
                    key={i}
                  >
                    {tag.name}
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
