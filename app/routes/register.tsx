import axios, { AxiosError } from "axios";
import React from "react";
import {
  LoaderFunction,
  ActionFunction,
  useLoaderData,
  Form,
  useTransition,
} from "remix";
import { ErrorMessages } from "~/components";
import { getSession, jsonWithSession, redirectWithSession } from "../sessions";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);

  const errors = session.get("register-form-errors");

  return jsonWithSession({ errors }, session);
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request);

  const form = await request.formData();

  const username = form.get("username");
  const email = form.get("email");
  const password = form.get("password");

  try {
    const { data } = await axios.post("users", {
      user: {
        username,
        password,
        email,
      },
    });

    const token = data.user.token;

    session.set("token", token);
  } catch (error: unknown | AxiosError) {
    if (!axios.isAxiosError(error)) return;

    const errors = error?.response?.data.errors;

    if (errors) {
      session.flash("register-form-errors", errors);
    }

    return redirectWithSession("/register", session);
  }

  return redirectWithSession("/", session);
};

export default function Register() {
  const { errors } = useLoaderData();
  const { state } = useTransition();
  const isSubmitting = React.useMemo(() => state === "submitting", [state]);

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
            <Form method="post" action="/register" reloadDocument>
              <fieldset className="form-group" disabled={isSubmitting}>
                <input
                  name="username"
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                />
              </fieldset>
              <fieldset className="form-group" disabled={isSubmitting}>
                <input
                  name="email"
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset className="form-group" disabled={isSubmitting}>
                <input
                  name="password"
                  className="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button
                className="btn btn-lg btn-primary pull-xs-right"
                disabled={isSubmitting}
              >
                Sign up
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
