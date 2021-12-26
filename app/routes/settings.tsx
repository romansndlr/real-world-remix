import * as React from "react";
import { User } from "@prisma/client";
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useTransition,
} from "remix";
import * as Yup from "yup";
import { ErrorMessages } from "~/components";
import { db, getSession } from "~/utils";
import { isNil, omitBy } from "lodash";

interface SettingsLoader {
  user: User;
}

interface SettingsAction {
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

let validationSchema = Yup.object().shape({
  username: Yup.string().min(3).max(25).required(),
  email: Yup.string().email().required(),
  bio: Yup.string(),
  password: Yup.string()
    .min(6)
    .matches(/[a-zA-Z1-9]/),
  image: Yup.string().url().required(),
});

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");

  const user = await db.user.findUnique({ where: { id: userId } });

  return json({ user });
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");

  const form = await request.formData();

  const username = form.get("username") || null;
  const email = form.get("email") || null;
  const password = form.get("password") || null;
  const bio = form.get("bio") || null;
  const image = form.get("image") || null;

  const user = omitBy(
    {
      username,
      email,
      password,
      bio,
      image,
    },
    isNil
  );

  try {
    await validationSchema.validateSync(user);
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return json({
        errors: error.errors,
        values: user,
      });
    }
  }

  await db.user.update({
    where: {
      id: userId,
    },
    data: user,
  });

  return redirect(`/settings`);
};

const Settings: React.FC = () => {
  const { user } = useLoaderData<SettingsLoader>();
  const data = useActionData<SettingsAction>();
  const { submission } = useTransition();

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>
            <ErrorMessages errors={data?.errors} />
            <Form action="/settings" method="put">
              <fieldset>
                <fieldset className="form-group" disabled={!!submission}>
                  <input
                    defaultValue={
                      data?.values.image || user.image || defaultValues.image
                    }
                    name="image"
                    className="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                  />
                </fieldset>
                <fieldset className="form-group" disabled={!!submission}>
                  <input
                    defaultValue={
                      data?.values.username ||
                      user.username ||
                      defaultValues.username
                    }
                    name="username"
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    required
                  />
                </fieldset>
                <fieldset className="form-group" disabled={!!submission}>
                  <textarea
                    defaultValue={
                      data?.values.bio || user.bio || defaultValues.bio
                    }
                    name="bio"
                    className="form-control form-control-lg"
                    rows={8}
                    placeholder="Short bio about you"
                  ></textarea>
                </fieldset>
                <fieldset className="form-group" disabled={!!submission}>
                  <input
                    defaultValue={
                      data?.values.email || user.email || defaultValues.email
                    }
                    name="email"
                    className="form-control form-control-lg"
                    type="email"
                    placeholder="Email"
                    required
                  />
                </fieldset>
                <fieldset className="form-group" disabled={!!submission}>
                  <input
                    name="password"
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                  />
                </fieldset>
                <button
                  disabled={!!submission}
                  type="submit"
                  className="btn btn-lg btn-primary pull-xs-right"
                >
                  Update Settings
                </button>
              </fieldset>
            </Form>
            <hr />
            <Form method="post" action="/logout">
              <button
                type="submit"
                className="btn btn-outline-danger"
                disabled={!!submission}
              >
                Or click here to logout.
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
