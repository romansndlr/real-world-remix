import axios, { AxiosError, HeadersDefaults } from "axios";
import { json, LoaderFunction, ActionFunction, useLoaderData } from "remix";
import { ErrorMessages } from "~/components";
import { getHeaders, getSession, redirectWithSession } from "../sessions";

interface CommonHeaderProperties extends HeadersDefaults {
  Authorization: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);

  const headers = await getHeaders(session);

  const errors = session.get("errors");

  return json({ errors }, { headers });
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request);

  const form = await request.formData();

  const username = form.get("username");
  const email = form.get("email");
  const password = form.get("password");

  try {
    const { data } = await axios.post("https://api.realworld.io/api/users", {
      user: {
        username,
        password,
        email,
      },
    });

    (
      axios.defaults.headers as CommonHeaderProperties
    ).Authorization = `Token ${data.user.token}`;

    session.set("user", data.user);
  } catch (error: unknown | AxiosError) {
    if (!axios.isAxiosError(error)) return;

    const errors = error?.response?.data.errors;

    if (errors) {
      session.flash("errors", errors);
    }

    return redirectWithSession("/register", session);
  }

  return redirectWithSession("/", session);
};

export default function Register() {
  const { errors } = useLoaderData();

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <a href="">Have an account?</a>
            </p>
            <ErrorMessages errors={errors} />
            <form method="post" action="/register">
              <fieldset className="form-group">
                <input
                  name="username"
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  name="email"
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  name="password"
                  className="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button className="btn btn-lg btn-primary pull-xs-right">
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
