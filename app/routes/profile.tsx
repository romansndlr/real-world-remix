import { User } from "@prisma/client";
import {
  json,
  LoaderFunction,
  NavLink,
  Outlet,
  useLoaderData,
  useParams,
} from "remix";
import { db } from "~/utils";

interface ProfileLoader {
  profile: User;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  if (!params.username) {
    return json({ profile: null });
  }

  const profile = await db.user.findUnique({
    where: {
      username: params.username,
    },
  });

  return json({ profile });
};

const Profile = () => {
  const { username } = useParams();
  const { profile } = useLoaderData<ProfileLoader>();

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img src={profile.image || ""} className="user-img" />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>
              <button className="btn btn-sm btn-outline-secondary action-btn">
                <i className="ion-plus-round"></i>
                &nbsp; Follow Eric Simons
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <NavLink to={`/profile/${username}`} className="nav-link" end>
                    My Articles
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to={`/profile/${username}/favorited`}
                    className="nav-link"
                  >
                    Favorited Articles
                  </NavLink>
                </li>
              </ul>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
