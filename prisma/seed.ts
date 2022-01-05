import { PrismaClient, User } from "@prisma/client";
import { sample } from "lodash";
import sampleSize from "lodash/sampleSize";
import { ArticleFactory, CommentFactory, TagFactory, UserFactory } from "../factories";

const db = new PrismaClient();

async function seed() {
  try {
    await db.user.create({
      data: UserFactory.build({
        email: "romansndlr@gmail.com",
        password: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u", // twixrox
      }),
    });

    for (const user of UserFactory.buildList(10)) {
      await db.user.create({ data: user });
    }

    for (const tag of TagFactory.buildList(10)) {
      await db.tag.create({ data: tag });
    }

    const allUsers = await db.user.findMany();
    const allTags = await db.tag.findMany();

    for (const user of allUsers) {
      for (const articleConstructor of ArticleFactory.buildList(3)) {
        const comments = CommentFactory.buildList(3);
        const commentAuthor = sample(allUsers) as User;

        const article = await db.article.create({
          data: {
            ...articleConstructor,
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

        for (const { body } of comments) {
          await db.article.update({
            where: {
              id: article.id,
            },
            data: {
              comments: {
                create: {
                  body,
                  userId: commentAuthor.id,
                },
              },
            },
          });
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

seed();
