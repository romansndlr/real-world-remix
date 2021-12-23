import classNames from "classnames";
import * as React from "react";
import { NavLink } from "remix";
import { User } from "~/models";

const NavLinks: React.FC<{ user?: User }> = ({ user }) => {
  const matchFeed = true;
  const matchGlobal = true;
  const matchTag = true;

  return (
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
  );
};

export default NavLinks;
