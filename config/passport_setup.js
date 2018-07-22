const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require("./keys");
const User = require("../models/User");

passport.serializeUser((user,done)=>{
  done(null,user.id);
});

passport.deserializeUser((id,done)=>{
  User.findById(id).then((user)=>{
    done(null,user);

  })
});


passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/google/redirect'
    }, (accessToken,refreshToken,profile,done) => {
        // passport callback function
        User.findOne({googleId:profile.id})
            .then((currentUser)=>{
              if(currentUser){
                console.log("user exist");
                done(null,currentUser);
              }else{
                new User({
                  username : profile.displayName,
                  googleId : profile.id,
                  f_name   : profile.name.givenName,
                }).save()
                .then((newUser)=>{
                  console.log("user created "+ newUser);
                  done(null,newUser);
                })
              }
            })
    })
);
