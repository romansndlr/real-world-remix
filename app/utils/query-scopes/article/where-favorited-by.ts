export default function (userId: number) {
  return {
    where: {
      favorited: {
        some: {
          userId: userId,
        },
      },
    },
  };
}
