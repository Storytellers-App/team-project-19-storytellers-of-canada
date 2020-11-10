export function getStoryById(id) {
  return {
    id: id,
    title: 'The Icy Horsewoman',
    author: 'James Currier',
    Description:
      'A secret agent and an icy horsewoman become allies to go on a bender. The story is made difficult by a disaster.',
    story: 'RECORDING HERE SOMEHOW IDK',
    image: null,
  };
}

export function getStoriesByCategory(category) {
  return [3, 13, 41, 47];
}
