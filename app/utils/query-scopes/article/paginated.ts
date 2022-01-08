export default function (url: string) {
  const offset = new URL(url).searchParams.get("offset");

  return {
    skip: Number(offset),
    take: 10,
  };
}
