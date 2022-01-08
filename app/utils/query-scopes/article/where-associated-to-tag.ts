export default function (tag: string) {
  return {
    where: {
      tags: {
        some: {
          name: tag,
        },
      },
    },
  };
}
