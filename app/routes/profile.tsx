import { Follows, User } from "@prisma/client";
import { json, Link, LoaderFunction, NavLink, Outlet, useLoaderData, useParams } from "remix";
import { FollowAuthorButton } from "~/components";
import { getAuthUser } from "~/services";
import { db } from "~/utils";

interface ProfileLoader {
  profile: User & { followers: Follows[] };
  authUser: User;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  if (!params.username) {
    return json({ profile: null });
  }

  const authUser = await getAuthUser(request);

  const profile = await db.user.findUnique({
    where: {
      username: params.username,
    },
    include: {
      followers: true,
    },
  });

  return json({ profile, authUser });
};

const Profile = () => {
  const { username } = useParams();
  const { profile, authUser } = useLoaderData<ProfileLoader>();

  const isFollowing = profile.followers.find(({ followerId }) => followerId === authUser?.id);

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img src={profile.image || ""} className="user-img" />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>
              {authUser.id === profile.id ? (
                <Link className="btn btn-sm btn-outline-secondary action-btn" to="/settings">
                  <i className="ion-gear-a"></i> Edit Profile Settings
                </Link>
              ) : (
                <FollowAuthorButton isFollowing={!!isFollowing} className="action-btn" authorId={profile.id}>
                  {profile.username}
                </FollowAuthorButton>
              )}
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
                  <NavLink to={`/profile/${username}/favorited`} className="nav-link">
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
