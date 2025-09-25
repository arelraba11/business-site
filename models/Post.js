import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false
  },
  content: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

postSchema.pre("validate", function (next) {
  if (!this.content && !this.imageUrl) {
    next(new Error("Post must have either text content or an image."));
  } else {
    next();
  }
});

const Post = mongoose.model("Post", postSchema);
export default Post;