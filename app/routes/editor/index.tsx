import { useActionData, redirect, json, ActionFunction } from "remix";
import * as Yup from "yup";
import { db, getSession } from "~/utils";
import { ArticleForm } from "~/components";

interface ActionData {
  errors?: Record<string, string[]>;
  values?: {
    title: string;
    description: string;
    body: string;
    tags: string;
  };
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required(),
  description: Yup.string().required(),
  body: Yup.string().required(),
  tags: Yup.string(),
  userId: Yup.number().required(),
});

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");

  const formData = await request.formData();

  const title = formData.get("title");
  const description = formData.get("description");
  const body = formData.get("body");
  const tags = formData.get("tags");

  const values = {
    title,
    description,
    body,
    tags,
  };

  try {
    const validated = await validationSchema.validateSync(
      {
        ...values,
        userId,
      },
      {
        abortEarly: false,
      }
    );

    const tagList = validated.tags ? validated.tags.split(",") : [];

    const article = await db.article.create({
      data: {
        title: validated.title,
        description: validated.description,
        body: validated.body,
        author: {
          connect: {
            id: validated.userId,
          },
        },
        tags: {
          connectOrCreate: tagList.map((tag) => ({
            create: {
              name: tag,
            },
            where: {
              name: tag,
            },
          })),
        },
      },
    });

    return redirect(`/article/${article.id}`);
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return json({ values, errors: error.errors });
    }

    console.error(error);
  }
};

const Editor = () => {
  const actionData = useActionData<ActionData>();

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ArticleForm
              errors={actionData?.errors}
              defaultValues={actionData?.values}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
