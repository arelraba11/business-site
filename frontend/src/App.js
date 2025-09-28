import React, { useEffect, useState } from "react";

function App() {
  // Stores posts fetched from backend
  const [posts, setPosts] = useState([]);

  // Fetch posts from backend on component mount
  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPosts(data.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Business Site – Frontend</h1>
      <h2>Posts:</h2>
      {/* Render posts dynamically */}
      <ul>
        {posts.map((post) => (
          <li key={post._id}>{post.content}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;