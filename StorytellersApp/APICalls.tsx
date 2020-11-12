export function getStoryById(id: any) {
  return {
    id: id,
    title: "The Icy Horsewoman",
    author: "James Currier",
    description:
      "A secret agent and an icy horsewoman become allies to go on a bender. The story is made difficult by a disaster.",
    story: "RECORDING HERE SOMEHOW IDK",
    image: "https://picsum.photos/id/" + id + "/400/400",
    date: "Nov 9, 2015",
  };
}

export function getStoriesByCategory(category: string) {
  return [13, 41, 47, 48, 52, 71, 76, 99, 108, 111];
}
