import { PrismaClient } from "@prisma/client";
import sampleSize from "lodash/sampleSize";
import { ArticleFactory, TagFactory, UserFactory } from "../factories";

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
    for (const article of ArticleFactory.buildList(3)) {
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
    }
  }
}

seed();
