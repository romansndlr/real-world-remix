import * as React from "react";
import { Link } from "remix";
import Alert from "./alert";

const Layout: React.FC<{
  alert?: string;
  navLinks?: JSX.Element | null;
}> = ({ children, alert, navLinks = null }) => {
  return (
    <div>
      <header>
        <nav className="navbar navbar-light">
          <div className="container">
            <Link className="navbar-brand" to="/">
              conduit
            </Link>
            {navLinks}
          </div>
        </nav>
      </header>
      {alert && <Alert>{alert}</Alert>}
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
};

export default Layout;
