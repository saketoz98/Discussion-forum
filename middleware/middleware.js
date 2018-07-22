const Discussions = require("../models/Discussions");
      Comment = require("../models/Comment");

// all the middleare goes here
let middlewareObj = {};

middlewareObj.checkDiscussionOwnership = (req,res,next)=>{
  if(req.user){
    Discussions.findById(req.params.id,(err,foundDiscussion)=>{
        if(err){
               req.flash("error", "Discussion not found");
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundDiscussion.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }

      }
    });
  }else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.user){
        Comment.findById(req.params.commentId, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.user.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.authCheck = (req,res,next)=>{
  if(!req.user){
     req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
  }else{
    next();
  }
}

module.exports = middlewareObj;
