const express = require('express');
      router = express.Router({mergeParams: true});
      mongoose = require("mongoose");
      Discussions = require("../models/Discussions");
      Comment = require("../models/Comment");
      middleware = require("../middleware/middleware");

router.get("/new",middleware.authCheck,(req,res)=>{
  Discussions.findById(req.params.id,(err,foundDiscussion)=>{
    if(err){
      res.render("error");
    }
    res.render("comments/newComment",{discussion:foundDiscussion});
  });
});

router.post("/", middleware.authCheck,(req,res)=>{
  console.log(req.body);
  let comment = {
    description : req.body.description
  }
  Discussions.findById(req.params.id,(err,foundDiscussion)=>{
    if(err){
      res.render("error");
    }
    Comment.create(comment,(err,comment)=>{
      if(err){
        console.log(err);
        res.redirect("/Discussions");
      }
      comment.user.id = req.user._id;
      comment.user.username = req.user.username;
      comment.save();
      console.log(comment);
      foundDiscussion.comments.push(comment);
      foundDiscussion.save();
      res.redirect("/discussions/"+req.params.id);
    });
  });
});

router.get("/:commentId/edit", middleware.checkCommentOwnership, (req,res)=>{
  Discussions.findById(req.params.id,(err,foundDiscussion)=>{
    if(err){
      console.log(err);
      res.render("error");
    }
    Comment.findById(req.params.commentId,(err,foundComment)=>{
      if(err){
        res.redirect("/discussions/"+ req.params.id);
      }
      res.render("comments/editComment",{comment:foundComment,discussion:foundDiscussion});
    });
  });
});

router.put("/:commentId",(req,res)=>{
  Comment.findByIdAndUpdate(req.params.commentId,{$set: { description : req.body.description }},(err)=>{
    if(err){
      res.render("error");
    }
    res.redirect("/discussions/"+req.params.id);
  })
})

router.delete("/:commentId",middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndRemove(req.params.commentId, (err)=>{
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/discussions/" + req.params.id);
       }
    });
});
module.exports = router;
