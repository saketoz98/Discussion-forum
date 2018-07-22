const express = require('express');
      router = express.Router();
      mongoose = require("mongoose");
      Discussions = require("../models/Discussions");
      Comment = require("../models/Comment");
      passport = require("passport");
      middleware = require("../middleware/middleware");


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  res.render('index', { title: 'Express' });
});

router.get("/discussions",(req,res)=>{
  console.log(req.user);
  Discussions.find({},(err,allDiscussions)=>{
    if(err){
      res.render("error");
    }
    res.render("discussions/latestDiscussions",{allDiscussions:allDiscussions});
  });
});

router.post("/discussions",middleware.authCheck,(req,res)=>{
  let author = {
       id: req.user._id,
       username: req.user.f_name
   }
  let discussion = {
    category: req.body.topicList,
    name : req.body.name,
    author : author,
    description : req.body.description
  }
  console.log(req.body);
  Discussions.create(discussion,(err,new_discussion)=>{
    if(err){
      res.render("error",{error:err});
    }
    console.log("discussion created");
    console.log(new_discussion);
    res.redirect("/discussions");
  });
})

router.get("/discussions/new",middleware.authCheck,(req,res)=>{
  res.render("discussions/new_discussion");
});

router.get("/discussions/:id",(req,res)=>{
  Discussions.findById(req.params.id).populate("comments").exec((err,foundDiscussion)=>{

    if(err){
      res.render("error");
    }
    res.render("discussions/individualDiscussion",{discussion:foundDiscussion});
  })
});

router.get("/discussions/:id/edit",middleware.checkDiscussionOwnership,(req,res)=>{
  Discussions.findById(req.params.id,(err,foundDiscussion)=>{
    if(err){
      res.render("error");
    }
    res.render("discussions/editDiscussion",{discussion:foundDiscussion});
  });
})

router.put("/discussions/:id",middleware.checkDiscussionOwnership, (req,res)=>{
  Discussions.findByIdAndUpdate(req.params.id,{$set: { description : req.body.description }},(err)=>{
    if(err){
      res.render("error");
    }
    res.redirect("/discussions/"+req.params.id);
  })
});

// category routes

router.get("/discussions/topics/:topicName",(req,res)=>{
  Discussions.find({category:req.params.topicName},(err,foundDiscussion)=>{
    if(err){
      res.redirect("/discussions");
    }
    console.log(foundDiscussion);
    res.render("discussions/latestDiscussions",{allDiscussions:foundDiscussion});
  })
})

//middleware

module.exports = router;
