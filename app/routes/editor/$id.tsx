import {
  useActionData,
  redirect,
  json,
  ActionFunction,
  LoaderFunction,
  useLoaderData,
} from "remix";
import * as Yup from "yup";
import { db, getSession } from "~/utils";
import { ArticleForm } from "~/components";
import { omit } from "lodash";

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
  articleId: Yup.number().required(),
});

export const action: ActionFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const articleId = params.id;

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
        articleId,
      },
      {
        abortEarly: false,
      }
    );

    const tagList = validated.tags ? validated.tags.split(",") : [];

    const prevArticle = await db.article.findUnique({
      where: {
        id: validated.articleId,
      },
      include: {
        tags: true,
      },
    });

    const prevTagList = prevArticle?.tags.map(({ name }) => name) || [];

    const tagsToRemove = prevTagList.filter((tag) => !tagList.includes(tag));

    const article = await db.article.update({
      where: {
        id: validated.articleId,
      },
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
          disconnect: tagsToRemove.map((tag) => ({ name: tag })),
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

export const loader: LoaderFunction = async ({ params }) => {
  const articleId = params.id;

  const article = await db.article.findUnique({
    where: {
      id: Number(articleId),
    },
    include: {
      tags: true,
    },
  });

  return json({
    article: {
      ...omit(article, ["tags"]),
      tags: article?.tags.map((tag) => tag.name),
    },
  });
};

const Editor = () => {
  const actionData = useActionData<ActionData>();
  const { article } = useLoaderData();

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ArticleForm
              errors={actionData?.errors}
              defaultValues={actionData?.values || article}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
