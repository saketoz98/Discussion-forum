const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  user: {
      id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      username: String
  },
  description: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment",CommentSchema);
