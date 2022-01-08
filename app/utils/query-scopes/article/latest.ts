import { Prisma } from "@prisma/client";

export default function (): Partial<Prisma.ArticleFindManyArgs> {
  return {
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  };
}
