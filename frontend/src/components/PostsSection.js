import React from "react";

export default function PostsSection({ posts }) {
  return (
    <div className="home-posts">
      <h2>Our Posts</h2>
      <div className="posts-grid">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              {post.image && <img src={post.image} alt="Post" />}
              <p>{post.content}</p>
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>
    </div>
  );
}