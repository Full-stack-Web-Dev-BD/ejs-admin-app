var express = require("express");
var router = express.Router();
var studyfields = require("../models/studyfield");
var studycat = require("../models/studycat");
var study = require("../models/study");
var logs = require("../models/logs");
var middleware = require("../middleware"); //index.js is a special name. So you don't have to explicitly mention the filename.


router.get("/adminstudy", middleware.isLoggedin, function(req,res){
    studyfields.find({}).sort('fieldorder').exec(function(err,returnedstudyfields){
        if(err){
            console.log(err);
        } else {
            studycat.find({}).sort('studycatorder').exec(function(err,returnedcats){
               if(err){
                   console.log(err);
               } else {
                     res.render("adminstudy", {studyadmin: returnedstudyfields, studycats : returnedcats });
                     let datetime = new Date();
                     let logDate = datetime;
                     let logUser = req.user.username;
                     let logAction = `Visited ADMINSTUDY - Checked configured fields for STUDY`
                     let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
                     logs.create(newlog, function(err, newlycreatedlog){
                        if(err) {
                            console.log(err);
                        } 
                     });
               }  
            });
        }
    });
});

router.post("/adminstudy", middleware.isLoggedin, function(req, res){
    //console.log(req.body.study); //Shows parameters coming from the form. 
    var studycatname = req.body.catname;
    var fieldname = req.body.fieldname;
    var fieldinputtype = req.body.fieldinputtype;
    var checkboxvalues = req.body.checkboxvalues;
    var checkboxvaluesarr = checkboxvalues.split(',');
    var radiovalues = req.body.radiovalues;
    var radiovaluesarr = radiovalues.split(','); 
    var dropdownvalues = req.body.dropdownvalues;
    var dropdownvaluesarr = dropdownvalues.split(','); 
    var fieldorder = req.body.fieldorder;
    var newstudyfield = {fieldname: fieldname, fieldinputtype: fieldinputtype, studycatname: studycatname, fieldorder: fieldorder, checkboxvalues: checkboxvaluesarr, radiovalues: radiovaluesarr, dropdownvalues: dropdownvaluesarr} // Tablefieldname: Variablename
    //create a new studyfield and save it to the database.
    studyfields.create(newstudyfield, function(err,newlycreated_sf){
        if(err){
            console.log(err);
        } else{
            res.redirect("/adminstudy"); //redirects to GET route.
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Created a new field for STUDY. Field Name: ${fieldname} `
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }
    });
});

//Adminstudy EDIT route
router.get("/adminstudy/:id/edit", middleware.isLoggedin, function(req,res){
    studyfields.findById(req.params.id, function(err, returnedstudyfield){
        if(err){
            console.log(err);
            res.redirect("/adminstudy");
        } else {
            //console.log(req.params) //- Only displays ID because only is in the URL request
            //console.log(returnedstudyfield); // returns the JSON of the whole field.
            studycat.find({},function(err,returnedcats){
                if(err){
                    console.log(err);
                } else {
                    res.render("admstudyedit", {editedstudyfield: returnedstudyfield, studycats : returnedcats});
                    let datetime = new Date();
                    let logDate = datetime;
                    let logUser = req.user.username;
                    let logAction = `On the page to edit the STUDY FIELD - ${returnedstudyfield.fieldname}. Did not edit yet.`
                    let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
                    logs.create(newlog, function(err, newlycreatedlog){
                       if(err) {
                           console.log(err);
                       } 
                    });
                }
            });
        }
    });
});

//Adminstudy UPDATE route
router.put("/adminstudy/:id",middleware.isLoggedin, function(req,res){
    studyfields.findByIdAndUpdate(req.params.id, {fieldorder: req.body.fieldorder, studycatname: req.body.catname, fieldname: req.body.fieldname, fieldinputtype: req.body.fieldinputtype, checkboxvalues: (req.body.checkboxvalues).split(','), radiovalues: (req.body.radiovalues).split(',')}, function(err, returnedstudyfield){
        if(err){
            console.log(err);
            res.redirect("/adminstudy");
        } else {
            res.redirect("/adminstudy");
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Updated a STUDY FIELD - ${req.params.id}`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }
    });
});

//adminstudy delete route
router.delete("/adminstudy/:id", middleware.isLoggedin, function(req,res){
    studyfields.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/adminstudy");
        } else{
            console.log("Deleted row:" + req.params.id);
            res.redirect("/adminstudy");
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Deleted a STUDY FIELD - ${req.params.id}`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }      
    });
});

router.get("/adminstudyconfig", middleware.isLoggedin, function(req,res){
    //console.log(req.user); - This get the user information from the DB. Not from the login form. 
    //Get all study fields from DB
    //studyfields.find({},function(err,returnedstudyfields){
    studyfields.find({}).sort('fieldorder').exec(function(err,returnedstudyfields){
        if(err){
            console.log(err);
        } else {
            //studycat.find({}, function(err,returnedstudycats){
            studycat.find({}).sort('studycatorder').exec(function(err,returnedstudycats){
                if(err){
                    console.log(err);
                } else {
                    res.render("adminstudyconfig", {studyadmin: returnedstudyfields, studycats: returnedstudycats});  
                    let datetime = new Date();
                    let logDate = datetime;
                    let logUser = req.user.username;
                    let logAction = `Visited the STUDY CREATION page`
                    let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
                    logs.create(newlog, function(err, newlycreatedlog){
                       if(err) {
                           console.log(err);
                       } 
                    });
                }
            });
           }
    });
});

function cleansing(study){
    var newstudy = {};
    Object.keys(study).forEach(function(key){
        if (Array.isArray(study[key])) {
            var newitem = [];
            study[key].forEach(function(a){
                console.log(study[key]);
                console.log(a);
                if (a !== "" && a !== "on" && a !== "Other") {
                    newitem.push(a);
                }
            });
            delete newstudy[key];
            newstudy[key] = newitem;
        } else {
            newstudy[key] = study[key];
        }
    });
    return newstudy;
}

router.post("/adminstudyconfig", middleware.isLoggedin, function(req, res){
    //create a new studycategory and save it to the database.
     study.create(cleansing(req.body.study,), function(err,newstudy){
         if(err){
             console.log(err);
             res.redirect("/adminstudyconfig");
         } else {
             console.log(req.body.study);
             res.redirect("/adminstudyconfig"); //redirects to GET route.
             let datetime = new Date();
             let logDate = datetime;
             let logUser = req.user.username;
             let logAction = `Created a STUDY - ${newstudy.Study_name}`
             let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
             logs.create(newlog, function(err, newlycreatedlog){
                if(err) {
                    console.log(err);
                } 
             });
         }
     });
 });

//adminstudy category 
router.get("/adminstudycat", middleware.isLoggedin, function(req,res){
    //Get all study fields from DB
    studycat.find({}).sort('studycatorder').exec(function(err,returnedstudycat){
        if(err){
            console.log(err);
        } else {
            res.render("adminstudycat", {studycat: returnedstudycat})
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Visited the CREATE STUDY CATEGORY page`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }
    });
});

router.post("/adminstudycat", middleware.isLoggedin, function(req, res){
    var adminstudycat = req.body.adminstudycat;
    var studycatorder = req.body.studycatorder;
    var studycatdetail = req.body.studycatdetail;
    var newadminstudycat = { studycatname: adminstudycat, studycatorder: studycatorder, studycatdetail: studycatdetail} 
    //create a new studycategory and save it to the database.
    studycat.create(newadminstudycat, function(err,newlycreated_sc){
        if(err){
            console.log(err);
        } else {
            console.log(newadminstudycat);
            console.log(newlycreated_sc);
            res.redirect("/adminstudycat"); //redirects to GET route.
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Created a STUDY CATEGORY - ${newadminstudycat.studycatname}`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }
    });
});

router.get("/adminstudycat/:id/edit", middleware.isLoggedin, function(req,res){
    studycat.findById(req.params.id, function(err, returnedcat){
        if(err){
            console.log(err);
            res.redirect("/adminstudycat");
        } else {
            res.render("admstudycatedit", {editedcat: returnedcat});
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Visited the page to edit the STUDY CATEGORY - ${returnedcat.studycatname}. Did not edit yet.`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }
    });
});

router.put("/adminstudycat/:id", middleware.isLoggedin, function(req,res){
    studycat.findByIdAndUpdate(req.params.id, {studycatname: req.body.catname, studycatdetail: req.body.studycatdetail, studycatorder: req.body.studycatorder}, function(err, returnedcat){
        if(err){
            console.log(err);
            res.redirect("/adminstudycat");
        } else {
            res.redirect("/adminstudycat");
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Updated (Edited) a STUDY CATEGORY - ${returnedcat.studycatname}.`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }
    });
});

router.delete("/adminstudycat/:id", middleware.isLoggedin, function(req,res){
    studycat.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/adminstudycat");
        } else{
            console.log("Deleted row:" + req.params.id);
            res.redirect("/adminstudycat");
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Deleted a STUDY CATEGORY - ${req.params.id}.`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }      
    });
});

router.get("/adminstudyhome", middleware.isLoggedin, function(req,res){
    studyfields.find({}).sort('fieldorder').exec(function(err,returnedstudyfields){
        if(err){
            console.log(err);
        } else {
            //studycat.find({}, function(err,returnedstudycats){
            studycat.find({}).sort('studycatorder').exec(function(err,returnedstudycats){
                if(err){
                    console.log(err);
                } else {
                    study.find({},function(err,returnedstudy){
                        if(err){
                            console.log(err);
                        } else {
                            res.render("adminstudyhome", {studyfields: returnedstudyfields, studycats: returnedstudycats, study: JSON.parse(JSON.stringify(returnedstudy))});  
                            let datetime = new Date();
                            let logDate = datetime;
                            let logUser = req.user.username;
                            let logAction = `Visited the STUDY listing page (STUDY HOME)`
                            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
                            logs.create(newlog, function(err, newlycreatedlog){
                               if(err) {
                                   console.log(err);
                               } 
                            });
                        }
                    }); 
                }
            });
        }
    });
});

//adminstudy delete route
router.delete("/adminstudyhome/:id", middleware.isLoggedin, function(req,res){
    study.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/adminstudyhome");
        } else{
            console.log("Deleted row:" + req.params.id);
            res.redirect("/adminstudyhome");
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Deleted a STUDY - ${req.params.id}`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }      
    });
});

router.get("/adminstudyhome/:id/edit", middleware.isLoggedin, function(req,res){
    studyfields.find({}).sort('fieldorder').exec(function(err,returnedstudyfields){
        if(err){
            console.log(err);
            res.redirect("/adminstudyhome");
        } else {
            studycat.find({}).sort('studycatorder').exec(function(err,returnedstudycats){
                if(err){
                    console.log(err);
                } else {
                    study.findById(req.params.id, function(err, returnedstudy){
                        if(err){
                            console.log(err);
                        } else {
                            res.render("adminstudyhomeedit", {returnedstudyfields: returnedstudyfields, returnedstudycats: returnedstudycats, returnedstudy: JSON.parse(JSON.stringify(returnedstudy))});
                            let datetime = new Date();
                            let logDate = datetime;
                            let logUser = req.user.username;
                            let logAction = `Visited the STUDY EDIT PAGE to edit - ${returnedstudy.Study_name}. Did not edit yet.`
                            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
                            logs.create(newlog, function(err, newlycreatedlog){
                               if(err) {
                                   console.log(err);
                               } 
                            });
                        }
                    });
                }
            });
        }
    });
});

router.put("/adminstudyhomeedit/:id",middleware.isLoggedin, function(req,res){
    study.findByIdAndUpdate(req.params.id, req.body.returnedstudy, function(err, returnedstudy){
        if(err){
            console.log(err);
            res.redirect("/adminstudyhome");
        } else {
            res.redirect("/adminstudyhome");
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Updated the STUDY - ${returnedstudy.Study_name}.`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }
    });
});

module.exports = router;