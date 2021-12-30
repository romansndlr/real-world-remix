import * as React from "react";
import { User } from "@prisma/client";
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  useActionData,
  useLoaderData,
  useTransition,
} from "remix";
import * as Yup from "yup";
import { ErrorMessages } from "~/components";
import { db, getUserId } from "~/utils";
import { getAuthUser } from "~/services";
import { isEmpty } from "lodash";

interface SettingsLoader {
  user: User;
}

interface FormValues {
  username: string;
  email: string;
  password?: string;
  bio: string;
  image: string;
}

interface SettingsAction {
  errors: unknown;
  values: FormValues;
}

const validationSchema = Yup.object().shape({
  username: Yup.string().min(3).max(25).required(),
  email: Yup.string().email().required(),
  bio: Yup.string(),
  password: Yup.string()
    .min(6)
    .matches(/[a-zA-Z1-9]/),
  image: Yup.string().url().required(),
});

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getAuthUser(request);

  return json({ user });
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await getUserId(request);

  const { username, email, password, bio, image } = Object.fromEntries(
    await request.formData()
  );

  const values = { username, email, bio, image };

  try {
    const validated = await validationSchema.validateSync(
      password ? { ...values, password } : values
    );

    await db.user.update({
      where: {
        id: userId,
      },
      data: validated,
    });

    return json({
      values: validated,
      errors: {},
    });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return json({
        errors: error.errors,
        values,
      });
    }

    console.error(error);
  }
};

const Settings: React.FC = () => {
  const { user } = useLoaderData<SettingsLoader>();
  const actionData = useActionData<SettingsAction>();
  const { submission } = useTransition();

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>
            <ErrorMessages errors={actionData?.errors} />
            <Form action="/settings" method="put">
              <fieldset>
                <fieldset className="form-group" disabled={!!submission}>
                  <input
                    defaultValue={actionData?.values.image || user.image || ""}
                    name="image"
                    className="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                  />
                </fieldset>
                <fieldset className="form-group" disabled={!!submission}>
                  <input
                    defaultValue={
                      actionData?.values.username || user.username || ""
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
                    defaultValue={actionData?.values.bio || user.bio || ""}
                    name="bio"
                    className="form-control form-control-lg"
                    rows={8}
                    placeholder="Short bio about you"
                  ></textarea>
                </fieldset>
                <fieldset className="form-group" disabled={!!submission}>
                  <input
                    defaultValue={actionData?.values.email || user.email || ""}
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
            <Form method="post" action="/logout" reloadDocument>
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
