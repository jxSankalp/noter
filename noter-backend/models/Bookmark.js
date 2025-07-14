const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^https?:\/\/.+/.test(v),
        message: "Invalid URL format",
      },
    },
    title: String,
    description: String,
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bookmark", bookmarkSchema);
