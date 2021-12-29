import { User } from "@prisma/client";
import classNames from "classnames";
import { compact, map } from "lodash";
import * as React from "react";
import { NavLink, useMatches } from "remix";

const NavLinks: React.FC<{ user?: User }> = ({ user }) => {
  const matches = useMatches();

  const isHome = React.useMemo(
    () =>
      compact(map(matches, "pathname")).some(
        (path) => path.startsWith("/feed") || path.startsWith("/global")
      ),
    [matches]
  );

  return (
    <ul className="nav navbar-nav pull-xs-right">
      <li className="nav-item">
        <NavLink prefetch="intent" className="nav-link" to="/feed">
          Home
        </NavLink>
      </li>
      {user && (
        <>
          <li className="nav-item">
            <NavLink prefetch="intent" className="nav-link" to="editor">
              <i className="ion-compose"></i>&nbsp;New Article
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink prefetch="intent" className="nav-link" to="settings">
              <i className="ion-gear-a"></i>&nbsp;Settings
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={`/profile/${user?.username}`}>
              <img
                style={{
                  width: 24,
                  height: 24,
                  marginRight: 4,
                  borderRadius: "50%",
                }}
                src={user?.image as string}
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
  );
};

export default NavLinks;
