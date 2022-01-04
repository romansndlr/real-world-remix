import { PrismaClient, User } from "@prisma/client";
import { sample } from "lodash";
import sampleSize from "lodash/sampleSize";
import { ArticleFactory, CommentFactory, TagFactory, UserFactory } from "../factories";

const db = new PrismaClient();

async function seed() {
  await db.user.create({
    data: UserFactory.build({
      email: "romansndlr@gmail.com",
      password: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u", // twixrox
    }),
  });

  await db.user.createMany({ data: UserFactory.buildList(10) });

  await db.tag.createMany({ data: TagFactory.buildList(10) });

  const allUsers = await db.user.findMany();
  const allTags = await db.tag.findMany();

  for (const user of allUsers) {
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        following: {
          createMany: {
            data: sampleSize(allUsers, 3).map((user) => ({
              authorId: user.id,
            })),
          },
        },
      },
    });

    for (const article of ArticleFactory.buildList(3)) {
      const comments = CommentFactory.buildList(3);
      const commentAuthor = sample(allUsers) as User;

      try {
        await db.article.create({
          data: {
            ...article,
            author: {
              connect: {
                id: user.id,
              },
            },
            tags: {
              connect: sampleSize(allTags, 3).map((tag) => ({
                id: tag.id,
              })),
            },
            comments: {
              createMany: {
                data: comments.map(({ body }) => ({
                  body,
                  userId: commentAuthor.id,
                })),
              },
            },
            favorited: {
              create: sampleSize(allUsers, 3).map((user) => ({
                user: {
                  connect: {
                    id: user.id,
                  },
                },
              })),
            },
          },
        });
      } catch (error) {
        console.error("🚀 ~ file: seed.ts ~ line 62 ~ seed ~ error", error);
      }
    }
  }
}

seed();
