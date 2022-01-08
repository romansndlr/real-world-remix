export default async function (userId: number) {
  return {
    where: {
      author: {
        followers: {
          some: {
            followerId: userId,
          },
        },
      },
    },
  };
}
