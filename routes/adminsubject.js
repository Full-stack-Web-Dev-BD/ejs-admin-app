var express = require("express");
var router = express.Router();
var subjectfields = require("../models/subjectfield");
var subjectcat = require("../models/subjectcat");
var subject = require("../models/subject");
var study = require("../models/study");
var site = require("../models/site");
var phase = require("../models/phase");
var visit = require("../models/visit");
var visitcat = require("../models/visitcat");
var visitfields = require("../models/visitfield");
var logs = require("../models/logs");
var middleware = require("../middleware");

router.get("/Adminsubject", middleware.isLoggedin, function(req,res){
    subjectfields.find({}).sort('fieldorder').exec(function(err,returnedsubjectfields){
        if(err){
            console.log(err);
        } else {
            subjectcat.find({}).sort('subjectcatorder').exec(function(err,returnedcats){
               if(err){
                   console.log(err);
               } else {
                     res.render("adminsubject", {subjectadmin: returnedsubjectfields, subjectcats : returnedcats });
                     let datetime = new Date();
                     let logDate = datetime;
                     let logUser = req.user.username;
                     let logAction = `Visited ADMINSUBJECT - Checked configured fields for SUBJECT`
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

router.post("/Adminsubject", middleware.isLoggedin, function(req, res){
    //console.log(req.body.study); //Shows parameters coming from the form. 
    var subjectcatname = req.body.catname;
    var fieldname = req.body.fieldname;
    var fieldinputtype = req.body.fieldinputtype;
    var checkboxvalues = req.body.checkboxvalues;
    var checkboxvaluesarr = checkboxvalues.split(',');
    var radiovalues = req.body.radiovalues;
    var radiovaluesarr = radiovalues.split(','); 
    var fieldorder = req.body.fieldorder;
    var newsubjectfield = {fieldname: fieldname, fieldinputtype: fieldinputtype, subjectcatname: subjectcatname, fieldorder: fieldorder, checkboxvalues: checkboxvaluesarr, radiovalues: radiovaluesarr} // Tablefieldname: Variablename
    //create a new studyfield and save it to the database.
    subjectfields.create(newsubjectfield, function(err,newlycreated_sf){
        if(err){
            console.log(err);
        } else{
            console.log(newsubjectfield);
            console.log(newlycreated_sf);
            res.redirect("/adminsubject"); //redirects to GET route.
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Created a new field for SUBJECT. Field Name: ${fieldname} `
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }
    });
});

//adminsubject category 
router.get("/adminsubjectcat", middleware.isLoggedin, function(req,res){
    //Get all subject fields from DB
    subjectcat.find({}).sort('subjectcatorder').exec(function(err,returnedsubjectcat){
        if(err){
            console.log(err);
        } else {
            res.render("adminsubjectcat", {subjectcat: returnedsubjectcat})
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Visited the CREATE SUBJECT CATEGORY page`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }
    });
});

router.post("/adminsubjectcat", middleware.isLoggedin, function(req, res){
    var adminsubjectcat = req.body.adminsubjectcat;
    var subjectcatdetail = req.body.subjectcatdetail;
    var subjectcatorder = req.body.subjectcatorder;
    var newadminsubjectcat = { subjectcatname: adminsubjectcat, subjectcatdetail: subjectcatdetail, subjectcatorder: subjectcatorder} 
    //create a new studycategory and save it to the database.
    subjectcat.create(newadminsubjectcat, function(err,newlycreated_sc){
        if(err){
            console.log(err);
        } else {
            res.redirect("/adminsubjectcat"); //redirects to GET route.
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Created a SUBJECT CATEGORY - ${newadminsubjectcat.subjectcatname}`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }
    });
});

//Adminsubject EDIT route
router.get("/adminsubject/:id/edit", middleware.isLoggedin, function(req,res){
    subjectfields.findById(req.params.id, function(err, returnedsubjectfield){
        if(err){
            console.log(err);
            res.redirect("/adminsubject");
        } else {
            //console.log(req.params) //- Only displays ID because only is in the URL request
            //console.log(returnedstudyfield); // returns the JSON of the whole field.
            subjectcat.find({},function(err,returnedcats){
                if(err){
                    console.log(err);
                } else {
                    res.render("admsubjectfieldedit", {editedsubjectfield: returnedsubjectfield, subjectcats : returnedcats});
                    let datetime = new Date();
                    let logDate = datetime;
                    let logUser = req.user.username;
                    let logAction = `On the page to edit the SUBJECT  FIELD - ${returnedsubjectfield.fieldname}. Did not edit yet.`
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

//Adminsubject UPDATE route
router.put("/adminsubject/:id",middleware.isLoggedin, function(req,res){
    subjectfields.findByIdAndUpdate(req.params.id, {fieldorder: req.body.fieldorder, subjectcatname: req.body.catname, fieldname: req.body.fieldname, fieldinputtype: req.body.fieldinputtype, checkboxvalues: (req.body.checkboxvalues).split(','), radiovalues: (req.body.radiovalues).split(',')}, function(err, returnedstudyfield){
        if(err){
            console.log(err);
            res.redirect("/adminsubject");
        } else {
            console.log("Success Update");
            res.redirect("/adminsubject");
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Updated a SUBJECT FIELD - ${req.params.id}`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }
    });
});

//adminsubject delete route
router.delete("/adminsubject/:id", middleware.isLoggedin, function(req,res){
    subjectfields.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/adminsubject");
        } else{
            res.redirect("/adminsubject");
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Deleted a SUBJECT FIELD - ${req.params.id}`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }      
    });
});

router.get("/adminsubjectcat/:id/edit", middleware.isLoggedin, function(req,res){
    subjectcat.findById(req.params.id, function(err, returnedcat){
        if(err){
            console.log(err);
            res.redirect("/adminsubjecttcat");
        } else {
            //console.log(req.params) //- Only displays ID because only is in the URL request
            //console.log(returnedstudyfield); // returns the JSON of the whole field.  
            res.render("admsubjectcatedit", {editedcat: returnedcat});
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Visited the page to edit the SUBJECT CATEGORY - ${returnedcat.subjectcatname}. Did not edit yet.`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }
    });
});

router.put("/adminsubjectcat/:id", middleware.isLoggedin, function(req,res){
    subjectcat.findByIdAndUpdate(req.params.id, {subjectcatname: req.body.catname, subjectcatdetail: req.body.subjectcatdetail, subjectcatorder: req.body.subjectcatorder}, function(err, returnedcat){
        if(err){
            console.log(err);
            res.redirect("/adminsubjectcat");
        } else {
            res.redirect("/adminsubjectcat");
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Updated (Edited) a SUBJECT CATEGORY - ${returnedcat.subjectcatname}.`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }
    });
});

router.delete("/adminsubjectcat/:id", middleware.isLoggedin, function(req,res){
    subjectcat.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/adminsubjectcat");
        } else{
            console.log("Deleted row:" + req.params.id);
            res.redirect("/adminsubjectcat");
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Deleted a SUBJECT CATEGORY - ${req.params.id}.`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }      
    });
});

router.get("/adminsubjectconfig", middleware.isLoggedin, function(req,res){
    subjectfields.find({}).sort('fieldorder').exec(function(err,returnedsubjectfields){
        if(err){
            console.log(err);
        } else {
            //studycat.find({}, function(err,returnedstudycats){
            subjectcat.find({}).sort('subjectcatorder').exec(function(err,returnedsubjectcats){
                if(err){
                    console.log(err);
                } else {
                    res.render("adminsubjectconfig", {subjectadmin: returnedsubjectfields, subjectcats: returnedsubjectcats});  
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


function cleansing(subject){
    var newsubject = {};
    Object.keys(subject).forEach(function(key){
        if (Array.isArray(subject[key])) {
            var newitem = [];
            subject[key].forEach(function(a){
                if (a !== "" && a !== "on" && a !== "Other") {
                    newitem.push(a);
                }
            });
            delete newsubject[key];
            newsubject[key] = newitem;
        } else {
            newsubject[key] = subject[key];
        }
    });
    return newsubject;
}

router.post("/adminsubjectconfig", middleware.isLoggedin, function(req, res){
   //create a new studycategory and save it to the database.
   subject.create(cleansing(req.body.subject), function(err,newsubject){
        if(err){
            console.log(err);
            res.redirect("/adminsubjectconfig");
        } else {
            console.log(req.body.subject);
            res.redirect("/adminsubjectconfig"); //redirects to GET route.
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Created a Subject - ${newsubject.Subject_Name}`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }
    });
});


router.get("/adminsubjecthome", middleware.isLoggedin, function(req,res){
    subjectfields.find({}).sort('fieldorder').exec(function(err,returnedsubjectfields){
        if(err){
            console.log(err);
        } else {
            //studycat.find({}, function(err,returnedstudycats){
            subjectcat.find({}).sort('subjectcatorder').exec(function(err,returnedsubjectcats){
                if(err){
                    console.log(err);
                } else {
                    subject.find({},function(err,returnedsubject){
                        if(err){
                            console.log(err);
                        } else {
                            res.render("adminsubjecthome", {subjectfields: returnedsubjectfields, subjectcats: returnedsubjectcats, subjects: JSON.parse(JSON.stringify(returnedsubject))});  
                            let datetime = new Date();
                            let logDate = datetime;
                            let logUser = req.user.username;
                            let logAction = `Visited the SUBJECT listing page (SUBJECT HOME)`
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

//adminsubject delete route
router.delete("/adminsubjecthome/:id", middleware.isLoggedin, function(req,res){
    subject.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/adminsubjecthome");
        } else{
            console.log("Deleted row:" + req.params.id);
            res.redirect("/adminsubjecthome");
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Deleted a SUBJECT - ${req.params.id}`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }      
    });
});


router.get("/adminsubjecthome/:id/edit", middleware.isLoggedin, function(req,res){
    subjectfields.find({}).sort('fieldorder').exec(function(err,returnedsubjectfields){
        if(err){
            console.log(err);
            res.redirect("/adminsubjecthome");
        } else {
            subjectcat.find({}).sort('subjectcatorder').exec(function(err,returnedsubjectcats){
                if(err){
                    console.log(err);
                } else {
                    subject.findById(req.params.id, function(err, returnedsubject){
                        if(err){
                            console.log(err);
                        } else {
                            res.render("adminsubjecthomeedit", {returnedsubjectfields: returnedsubjectfields, returnedsubjectcats: returnedsubjectcats, returnedsubject: JSON.parse(JSON.stringify(returnedsubject))});
                            let datetime = new Date();
                            let logDate = datetime;
                            let logUser = req.user.username;
                            let logAction = `Visited the SUBJECT EDIT PAGE to edit - ${returnedsubject.Subject_Name}. Did not edit yet.`
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

router.put("/adminsubjecthomeedit/:id",middleware.isLoggedin, function(req,res){
    subject.findByIdAndUpdate(req.params.id, req.body.returnedsubject, function(err, returnedsubject){
        if(err){
            console.log(err);
            res.redirect("/adminsubjecthome");
        } else {
            res.redirect("/adminsubjecthome");
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Updated the SUBJECT - ${returnedsubject.Subject_Name}.`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }
    });
});

//=====================================
// VISIT ROUTES
//=====================================

router.get("/Adminsubjecthome/:id/visit/new", function(req,res){
    subject.findById(req.params.id, function(err, subject){
        if(err){
            console.log(err);
        } else {
            study.find({}).sort('Study_short_name').exec(function(err,returnedstudy){
                if(err){
                    console.log(err);
                }else{
                    site.find({}).sort('Site_short_name').exec(function(err,returnedsite){
                        if(err){
                            console.log(err);
                        } else {
                            phase.find({}).sort('Phase_number').exec(function(err,returnedphase){
                                if(err){
                                    console.log(err);
                                } else {
                                    visitfields.find({}).sort('fieldorder').exec(function(err,returnedvisitfields){
                                        if(err){
                                            console.log(err);
                                        } else {
                                            visitcat.find({}).sort('fieldorder').exec(function(err,returnedvisitcats){
                                                if(err){
                                                    console.log(err);
                                                } else {
                                                    res.render("visits/visit", {visitcats: returnedvisitcats, visitfields: returnedvisitfields, subject: subject, returnedstudy: returnedstudy, returnedsite: returnedsite, returnedphase: returnedphase});
                                                    console.log(returnedsite);
                                                    let datetime = new Date();
                                                    let logDate = datetime;
                                                    let logUser = req.user.username;
                                                    let logAction = `Visited the page to enter the VISIT for - ${subject.Subject_Name}.`
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
                        }
                    });
                }
            });
        }
    });
});

function cleansing(visit){
    var newvisit = {};
    Object.keys(visit).forEach(function(key){
        if (Array.isArray(visit[key])) {
            var newitem = [];
            visit[key].forEach(function(a){
                if (a !== "" && a !== "on" && a !== "Other") {
                    newitem.push(a);
                }
            });
            delete newvisit[key];
            newvisit[key] = newitem;
        } else {
            newvisit[key] = visit[key];
        }
    });
    return newvisit;
}

router.post("/Adminsubjecthome/:id/visit", middleware.isLoggedin, function(req, res){
     visit.create(cleansing(req.body.visit), function(err,newvisit){
         if(err){
             console.log(err);
             res.redirect("/Adminsubjecthome");
         } else {
             res.redirect("/Adminsubjecthome"); //redirects to GET route.
             console.log(newvisit)
             let datetime = new Date();
             let logDate = datetime;
             let logUser = req.user.username;
             let logAction = `Created a VISIT for subject id: ${newvisit.Subject}`
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