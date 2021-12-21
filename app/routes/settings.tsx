import axios from "axios";
import * as React from "react";
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  useLoaderData,
  useTransition,
} from "remix";
import { ErrorMessages } from "~/components";
import { User } from "~/models";
import { getSession, jsonWithSession, redirectWithSession } from "~/sessions";

interface SettingsLoader {
  user: User;
  errors: unknown;
  values: {
    username: string;
    email: string;
    password: string;
    bio: string;
    image: string;
  };
}

const defaultValues = {
  username: "",
  email: "",
  password: "",
  bio: "",
  image: "",
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);

  try {
    const { data } = await axios.get("user");

    return jsonWithSession(
      {
        user: data.user,
        errors: session.get("settings-form-errors") || {},
        values: session.get("settings-form-values") || defaultValues,
      },
      session
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      session.flash("alert", error.response?.data);

      return jsonWithSession(
        { user: {}, values: defaultValues, errors: {} },
        session
      );
    }
  }
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request);

  const form = await request.formData();

  const username = form.get("username");
  const email = form.get("email");
  const password = form.get("password");
  const bio = form.get("bio");
  const image = form.get("image");

  const user = {
    username,
    email,
    password,
    bio,
    image,
  };

  try {
    await axios.put("user", { user });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errors = error.response?.data.errors;
      const status = error.response?.status;

      if (errors && status === 403) {
        session.flash("settings-form-errors", errors);
        session.flash("settings-form-values", user);
      } else {
        session.flash("alert", error?.message);
      }
    }

    return redirectWithSession("/settings", session);
  }

  return redirectWithSession(`/settings`, session);
};

const Settings: React.FC = () => {
  const { user, errors, values } = useLoaderData<SettingsLoader>();
  const { state } = useTransition();

  const isSubmitting = React.useMemo(() => state === "submitting", [state]);

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>
            <ErrorMessages errors={errors} />
            <Form action="/settings" method="put">
              <fieldset>
                <fieldset className="form-group" disabled={isSubmitting}>
                  <input
                    defaultValue={values.image || user.image}
                    name="image"
                    className="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                  />
                </fieldset>
                <fieldset className="form-group" disabled={isSubmitting}>
                  <input
                    defaultValue={values.username || user.username}
                    name="username"
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    required
                  />
                </fieldset>
                <fieldset className="form-group" disabled={isSubmitting}>
                  <textarea
                    defaultValue={values.bio || user.bio}
                    name="bio"
                    className="form-control form-control-lg"
                    rows={8}
                    placeholder="Short bio about you"
                  ></textarea>
                </fieldset>
                <fieldset className="form-group" disabled={isSubmitting}>
                  <input
                    defaultValue={values.email || user.email}
                    name="email"
                    className="form-control form-control-lg"
                    type="email"
                    placeholder="Email"
                    required
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
                  disabled={isSubmitting}
                  type="submit"
                  className="btn btn-lg btn-primary pull-xs-right"
                >
                  Update Settings
                </button>
              </fieldset>
            </Form>
            <hr />
            <form method="post" action="/logout">
              <button type="submit" className="btn btn-outline-danger">
                Or click here to logout.
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
