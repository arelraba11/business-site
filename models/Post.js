import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    default: null,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
}, { timestamps: true });

postSchema.pre("validate", function (next) {
  if (!this.content && !this.image) {
    next(new Error("Post must have either text content or an image."));
  } else {
    next();
  }
});

const Post = mongoose.model("Post", postSchema);
export default Post;