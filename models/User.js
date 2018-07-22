const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username : String,
    googleId: String,
    image : {type:String, default: "https://www.tenforums.com/attachments/tutorials/146359d1501443008-change-default-account-picture-windows-10-a-user.png"},
    f_name : String,
    imageID : String
});

module.exports = mongoose.model("User",UserSchema);
