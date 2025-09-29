import React from "react";

export default function PostsSection({
  posts,
  postContent,
  setPostContent,
  postImage,
  setPostImage,
  handlePostSubmit,
  handleDeletePost,
}) {
  return (
    <div className="dashboard-section posts">
      <h3 className="section-title">Posts</h3>
      <form onSubmit={handlePostSubmit} className="post-form">
        <textarea
          placeholder="Write your post content..."
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          rows={3}
          required
        />
        <input
          type="text"
          placeholder="Image URL (optional)"
          value={postImage}
          onChange={(e) => setPostImage(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Create Post
        </button>
      </form>

      <ul className="posts-list">
        {posts.map((post) => (
          <li key={post._id || post.content} className="post-item">
            <div className="post-content">{post.content}</div>
            {post.image && (
              <div className="post-image">
                <img src={post.image} alt="Post" />
              </div>
            )}
            <button
              className="btn btn-danger"
              onClick={() => handleDeletePost(post._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}