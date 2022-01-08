export default function (userId: number) {
  return {
    where: {
      author: {
        id: userId,
      },
    },
  };
}
