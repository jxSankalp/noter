const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
  },
  { timestamps: true}  
);

module.exports = mongoose.model("Note", noteSchema);
