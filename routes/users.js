const express = require('express');
      router = express.Router({mergeParams: true});
      mongoose = require("mongoose");
      User = require("../models/User");
      middleware = require("../middleware/middleware");
      multer = require('multer');
      keys  = require("../config/keys");

const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
const imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter})

const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'saket-cloud',
  api_key: keys.multerUploads.CLOUDINARY_API_KEY,
  api_secret: keys.multerUploads.CLOUDINARY_API_SECRET
});

router.put("/uploads", upload.single('image'), (req, res)=>{
    User.findById(req.user._id, async function(err, user){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              console.log(req.file);
              try {
                  if(user.imageId){
                    await cloudinary.v2.uploader.destroy(user.imageId);
                  }
                  const result = await cloudinary.v2.uploader.upload(req.file.path);
                  console.log(result);
                  user.imageId = result.public_id;
                  user.image = result.secure_url;
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
            user.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/users/" + user._id);
        }
    });
});

module.exports = router;
