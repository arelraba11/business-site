import Post from "../models/Post.js";

export async function createNewPost({ content, image, author }) {
  if (!content && !image) {
    throw new Error("Content or image is required");
  }
  const post = new Post({ content, image, author });
  await post.save();
  return post;
}

export async function getAllPosts() {
  return await Post.find().sort({ createdAt: -1 });
}

export async function deletePostById(id) {
  const deleted = await Post.findByIdAndDelete(id);
  if (!deleted) throw new Error("Post not found");
  return deleted;
}