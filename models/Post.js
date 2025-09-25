import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  }, // Text content of the post
  image: {
    type: String,
    default: null,
  }, // Optional image URL
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  } // Reference to the user who created the post
}, { timestamps: true }); // Adds createdAt and updatedAt

postSchema.pre("validate", function (next) {
  // Ensure at least text or image is provided
  if (!this.content && !this.image) {
    next(new Error("Post must have either text content or an image."));
  } else {
    next();
  }
});

const Post = mongoose.model("Post", postSchema);
export default Post;