import axios from "axios";
import React from "react";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  useLoaderData,
  useTransition,
} from "remix";
import { ErrorMessages } from "~/components";
import { getSession, jsonWithSession, redirectWithSession } from "~/sessions";

interface LoginLoader {
  errors: unknown;
  values: {
    email: string;
    password: string;
  };
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);

  return jsonWithSession(
    {
      errors: session.get("login-form-errors") || {},
      values: session.get("login-form-values") || { email: "", password: "" },
    },
    session
  );
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request);

  const form = await request.formData();

  const email = form.get("email");

  const password = form.get("password");

  try {
    const { data } = await axios.post("users/login", {
      user: { email, password },
    });

    session.set("token", data.user.token);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errors = error.response?.data.errors;
      const status = error.response?.status;

      if (errors && status === 403) {
        session.flash("login-form-errors", errors);
        session.flash("login-form-values", { email, password });
      }
    }

    return redirectWithSession("/login", session);
  }

  return redirectWithSession("/", session);
};

export default function Login() {
  const { errors, values } = useLoaderData<LoginLoader>();
  const { state } = useTransition();

  const isSubmitting = React.useMemo(() => state === "submitting", [state]);

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <a href="">Need an account?</a>
            </p>
            <ErrorMessages errors={errors} />
            <Form method="post" action="/login" reloadDocument>
              <fieldset className="form-group" disabled={isSubmitting}>
                <input
                  defaultValue={values.email}
                  name="email"
                  className="form-control form-control-lg"
                  type="email"
                  placeholder="Email"
                  required
                />
              </fieldset>
              <fieldset className="form-group" disabled={isSubmitting}>
                <input
                  defaultValue={values.password}
                  name="password"
                  className="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  required
                />
              </fieldset>
              <button
                disabled={isSubmitting}
                type="submit"
                className="btn btn-lg btn-primary pull-xs-right"
              >
                Sign in
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
