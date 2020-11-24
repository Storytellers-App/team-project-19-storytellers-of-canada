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

export function getAllStories() {
  // Replace this with our a call to our API
  const sample = {"stories": [{"id": 14, "user": {"username": "aidan", "name": "Aidan Brasseur"}, "creationTime": "Sun, 22 Nov 2020 03:25:44 -0000", "title": "An Interesting Fish", "description": "This is a story. One of a fish. It is exciting, nice, and great. It is... about a fish.", "recording": "https://nyc3.digitaloceanspaces.com/sccanada/How%20Heart%20Came%20Into%20The%20World%20-%20Dan%20Yashinsky.mp3?AWSAccessKeyId=AUZXKTNZL6MVAGA4TXCK&Signature=0hnb%2BrS2ggNvTdJUGyMZixGrYPE%3D&Expires=2145892124", "parent": 0, "numLikes": 1, "numReplies": 0, "tags": [], "type": "userstory", "isLiked": false, "image": "https://d2j1wkp1bavyfs.cloudfront.net/wp-content/legacy/posts/b365a802-17ee-47b7-a3ca-8c3a6af7ee8d.jpg"}, {"id": 32, "user": {"username": "aidan", "name": "Aidan Brasseur"}, "creationTime": "Sat, 21 Nov 2020 04:00:28 -0000", "title": "I like tags", "description": "This is a new story. This one is very nice except this one is nice AND it has tags!!! Tags will allow us to easily sort out the specific stories that we want.", "recording": "https://nyc3.digitaloceanspaces.com/sccanada/How%20Heart%20Came%20Into%20The%20World%20-%20Dan%20Yashinsky.mp3?AWSAccessKeyId=AUZXKTNZL6MVAGA4TXCK&Signature=0hnb%2BrS2ggNvTdJUGyMZixGrYPE%3D&Expires=2145892124", "parent": 0, "numLikes": 6, "numReplies": 3, "tags": ["Canada", "Chips", "Ontario", "React Native", "test", "Toronto"], "type": "userstory", "isLiked": false, "image": "https://landerapp.com/blog/wp-content/uploads/2018/08/tags.jpg"}, {"id": 31, "user": {"username": "aidan", "name": "Aidan Brasseur"}, "creationTime": "Sat, 21 Nov 2020 04:00:28 -0000", "title": "What is happening", "description": "Aidan seems confused. That is ok. I don't blame him honestly; this is a confusing task.", "recording": "https://nyc3.digitaloceanspaces.com/sccanada/How%20Heart%20Came%20Into%20The%20World%20-%20Dan%20Yashinsky.mp3?AWSAccessKeyId=AUZXKTNZL6MVAGA4TXCK&Signature=0hnb%2BrS2ggNvTdJUGyMZixGrYPE%3D&Expires=2145892124", "parent": 0, "numLikes": 1, "numReplies": 0, "tags": [], "type": "userstory", "isLiked": false, "image":"https://bevisible.co/wp-content/uploads/2017/02/guy-confused-computer.jpg"}, {"id": 81, "user": {"username": "jamcur", "name": "James Currier"}, "creationTime": "Mon, 12 Oct 2020 04:00:28 -0000", "title": "The Icy Horsewoman", "description": "A secret agent and an icy horsewoman become allies to go on a bender. The story is made difficult by a disaster.", "recording": "https://nyc3.digitaloceanspaces.com/sccanada/How%20Heart%20Came%20Into%20The%20World%20-%20Dan%20Yashinsky.mp3?AWSAccessKeyId=AUZXKTNZL6MVAGA4TXCK&Signature=0hnb%2BrS2ggNvTdJUGyMZixGrYPE%3D&Expires=2145892124", "parent": 0, "numLikes": 153, "numReplies": 0, "tags": ["Horses", "Fiction", "Horror"], "type": "userstory", "isLiked": false, "image":"https://picsum.photos/id/13/600/200"}]}
  return sample;
}
