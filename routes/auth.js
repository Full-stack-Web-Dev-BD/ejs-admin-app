var express = require("express");
var router = express.Router();
var passport = require("passport");
var user = require("../models/user");
var roles = require("../models/roles");
let logs = require("../models/logs");
var middleware = require("../middleware"); //index.js is a special name. So you don't have to explicitly mention the filename.

//====== AUTH ROUTES START ========================
router.get("/adminuser", middleware.isLoggedinAdmin, function(req,res){
    roles.find({},function(err, returnedroles){
        if(err){
            console.log(err);
            res.redirect("/adminstudy");
        }else{
                user.find({},function(err, returnedusers){
                if(err){
                    console.log(err);
                } else {
                    res.render("adminuser", {roles: returnedroles, users: returnedusers});
                }
            });
            
        }
    });
});

router.post("/adminuser", middleware.isLoggedinAdmin, function(req,res){
    var newUser = new user({username: req.body.username, role: req.body.role, fullname: req.body.fullname});
    //eval(require("locus"));
    user.register(newUser, req.body.password, function(err,user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/adminuser");
        } else {
            console.log(user);
            console.log(newUser);
            req.flash("success", "New user created: " + user.username);
            res.redirect("/adminuser");
        }
    });
});

router.delete("/adminuser/:id", middleware.isLoggedinAdmin, function(req,res){
    user.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/adminuser");
        } else{
            console.log("Deleted row:" + req.params.id);
            res.redirect("/adminuser");
        }      
    });
});

router.get("/adminuser/:id/edit", middleware.isLoggedinAdmin, function(req,res){
    user.findById(req.params.id, function(err, returneduser){
        if(err){
            console.log(err);
            res.redirect("/adminuser");
        } else {
            res.render("admuseredit", {user: returneduser});
        }
    });
});

router.get("/adminuser/:id/admusrpwreset", middleware.isLoggedinAdmin, function(req,res){
    user.findById(req.params.id, function(err, returneduser){
        if(err){
            console.log(err);
            res.redirect("/adminuser");
        } else {
            console.log(returneduser);
            res.render("admusrpwreset", {user: returneduser});
        }
    });
});

router.post("/admusrpwreset/:id", middleware.isLoggedinAdmin, function(req, res){
    user.findById(req.params.id, function(err,returneduser){
          if(!returneduser){
              console.log("No user exists");
              console.log("Returned user: "+  returneduser);
              res.redirect("/adminuser");
          } else {
            if (req.body.password === req.body.confirm){
                // console.log(returneduser);
                returneduser.setPassword(req.body.password, function(err) {
                    // console.log("inside setpassword");
                    returneduser.save(function(err){
                            // console.log("insideS Save");
                            if (err){
                                console.log(err);
                            } else {
                                req.flash("success", "Password changed for: " + returneduser.username);
                                res.redirect("/adminuser");
                            }
                        });
                    });
              } else {
                 console.log("Passwords do not match")       ;
                 res.redirect("/adminuser");
              }
          }

    });
});
router.put("/adminuser/:id", middleware.isLoggedinAdmin, function(req,res){
    user.findByIdAndUpdate(req.params.id, {fullname: req.body.fullname, role: req.body.role}, function(err, returneduser){
        if(err){
            console.log(err);
            // console.log(req.params.id);
            // console.log(req.body.username);
            // console.log(req.body.fullname);
            // console.log(returneduser);
            res.redirect("/adminuser");
        } else {
            console.log("Updated user");
            // console.log(req.params.id);
            // console.log(req.body.username);
            // console.log(req.body.fullname);
            // console.log(returneduser);
            res.redirect("/adminuser");
        }
    });
});

//======================= Logging for Admin users ================//
// logs.find({},function(err, returnedlogs){

router.get("/AdminLogs", middleware.isLoggedinAdmin, function(req,res){
    logs.find({}).sort({ logDate: 'desc' }).exec(function(err, returnedlogs) {
        if(err){
            console.log(err);
            res.redirect("/AdminLogs");
        }else{
            res.render("adminlogs", {logs: returnedlogs});
        }
    });
});

router.get("/",function(req,res){
    res.render("login");
});

//Keeping the empty callback to remind myself I am using passport middleware
// router.post("/", passport.authenticate("local",{
//     successRedirect: "/adminstudy", 
//     failureRedirect: "/",
//     failureFlash: true,
//     successFlash: "Welcome to Tryals, " + req.body.username + "!"
//     }), function(req,res){
// });

router.post("/", function(req, res, next){
    passport.authenticate("local",
    {
        successRedirect: "/adminstudy", 
        failureRedirect: "/",
        failureFlash: true,
        successFlash: "Welcome to Tryals, " + req.body.username + "!"
    })(req,res);
});

router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "You are logged out!");
    res.redirect("/");
});




//====== AUTH ROUTES END ========================

module.exports = router;