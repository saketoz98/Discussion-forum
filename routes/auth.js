const router = require('express').Router();
const passport = require('passport');
const passport_setup = require("../config/passport_setup");
const User = require("../models/User");
// auth login
router.get('/login', (req, res) => {
    res.render('login');
});

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/");
});

// auth with google+
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

// callback route for google to redirect to
router.get('/google/redirect',passport.authenticate("google"), (req, res) => {
  req.flash("success", "Welcome to SKForum " + req.user.f_name);
  res.redirect("/discussions");
});

router.get("/users/:id", (req, res)=>{
  User.findById(req.params.id, (err, foundUser)=> {
    if(err) {
      req.flash("error", "Something went wrong.");
      return res.redirect("/");
    }
    Discussions.find().where('author.id').equals(foundUser._id).exec(function(err, foundDiscussion) {
      if(err) {
        req.flash("error", "Something went wrong.");
        return res.redirect("/");
      }
      res.render("users/show", {user: foundUser, discussions: foundDiscussion});
    })
  });
});

module.exports = router;
