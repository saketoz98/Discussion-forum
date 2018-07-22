const mongoose = require("mongoose");

const DiscussionsSchema = new mongoose.Schema({
    category : String,
    name : String,
    author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
    description: String,
    comments: [
          {
             type: mongoose.Schema.Types.ObjectId,
             ref: "Comment"
          }
       ],
    createdAt: { type: Date, default: Date.now }

});

module.exports = mongoose.model("Discussions",DiscussionsSchema);
