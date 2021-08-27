var express = require("express");
var router = express.Router();
var subject = require("../models/subject");
var study = require("../models/study");
var site = require("../models/site");
var visit = require("../models/visit");
var phase = require("../models/phase");
var visitfields = require("../models/visitfield");
var visitcat = require("../models/visitcat");
var middleware = require("../middleware"); //index.js is a special name. So you don't have to explicitly mention the filename.

router.get("/adminvisit", middleware.isLoggedin, function(req,res){
    visitfields.find({}).sort('fieldorder').exec(function(err,returnedvisitfields){
        if(err){
            console.log(err);
        } else {
            visitcat.find({}).sort('visitcatorder').exec(function(err,returnedvisitcats){
               if(err){
                   console.log(err);
               } else {
                    res.render("adminvisit", {visitadmin: returnedvisitfields, visitcats : returnedvisitcats });
               }  
            });
        }
    });
});

router.post("/adminvisit", middleware.isLoggedin, function(req, res){
    //console.log(req.body.study); //Shows parameters coming from the form. 
    var visitcatname = req.body.catname;
    var fieldname = req.body.fieldname;
    var fieldinputtype = req.body.fieldinputtype;
    var checkboxvalues = req.body.checkboxvalues;
    var checkboxvaluesarr = checkboxvalues.split(',');
    var radiovalues = req.body.radiovalues;
    var radiovaluesarr = radiovalues.split(','); 
    var fieldorder = req.body.fieldorder;
    var newvisitfield = {fieldname: fieldname, fieldinputtype: fieldinputtype, visitcatname: visitcatname, fieldorder: fieldorder, checkboxvalues: checkboxvaluesarr, radiovalues: radiovaluesarr} // Tablefieldname: Variablename
    //create a new studyfield and save it to the database.
    visitfields.create(newvisitfield, function(err,newlycreated_sf){
        if(err){
            console.log(err);
        } else{
            console.log(newvisitfield);
            console.log(newlycreated_sf);
            res.redirect("/adminvisit"); //redirects to GET route.
        }
    });
});

//Adminvisit EDIT route
router.get("/adminvisit/:id/edit", middleware.isLoggedin, function(req,res){
    visitfields.findById(req.params.id, function(err, returnedvisitfield){
        if(err){
            console.log(err);
            res.redirect("/adminvisit");
        } else {
            //console.log(req.params) //- Only displays ID because only is in the URL request
            //console.log(returnedvisitfield); // returns the JSON of the whole field.
            visitcat.find({},function(err,returnedcats){
                if(err){
                    console.log(err);
                } else {
                    res.render("admvisitfieldedit", {editedvisitfield: returnedvisitfield, visitcats : returnedcats});
                }
            });
        }
    });
});

//Adminvisit UPDATE route
router.put("/adminvisit/:id",middleware.isLoggedin, function(req,res){
    visitfields.findByIdAndUpdate(req.params.id, {fieldorder: req.body.fieldorder, visitcatname: req.body.catname, fieldname: req.body.fieldname, fieldinputtype: req.body.fieldinputtype, checkboxvalues: (req.body.checkboxvalues).split(','), radiovalues: (req.body.radiovalues).split(',')}, function(err, returnedstudyfield){
        if(err){
            console.log(err);
            res.redirect("/adminvisit");
        } else {
            console.log("Success Update");
            console.log(req.params.id);
            console.log(req.body.fieldname);
            console.log(returnedstudyfield);
            res.redirect("/adminvisit");
        }
    });
});

//adminvisit delete route
router.delete("/adminvisit/:id", middleware.isLoggedin, function(req,res){
    visitfields.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/adminvisit");
        } else{
            console.log("Deleted row:" + req.params.id);
            res.redirect("/adminvisit");
        }      
    });
});

//adminvisit category 
router.get("/adminvisitcat", middleware.isLoggedin, function(req,res){
    visitcat.find({}).sort('visitcatorder').exec(function(err,returnedvisitcat){
        if(err){
            console.log(err);
        } else {
            res.render("adminvisitcat", {visitcat: returnedvisitcat})
        }
    });
});

router.post("/adminvisitcat", middleware.isLoggedin, function(req, res){
    var adminvisitcat = req.body.adminvisitcat;
    var visitcatorder = req.body.visitcatorder;
    var visitcatdetail = req.body.visitcatdetail;
    var newadminvisitcat = { visitcatname: adminvisitcat, visitcatorder: visitcatorder, visitcatdetail: visitcatdetail};
    //create a new studycategory and save it to the database.
    visitcat.create(newadminvisitcat, function(err,newlycreated_sc){
        if(err){
            console.log(err);
        } else {
            console.log(newadminvisitcat);
            console.log(newlycreated_sc);
            res.redirect("/adminvisitcat"); //redirects to GET route.
        }
    });
});

router.get("/adminvisitcat/:id/edit", middleware.isLoggedin, function(req,res){
    visitcat.findById(req.params.id, function(err, returnedcat){
        if(err){
            console.log(err);
            res.redirect("/adminvisittcat");
        } else {
            //console.log(req.params) //- Only displays ID because only is in the URL request
            //console.log(returnedstudyfield); // returns the JSON of the whole field.  
            res.render("admvisitcatedit", {editedcat: returnedcat});
        }
    });
});

router.put("/adminvisitcat/:id", middleware.isLoggedin, function(req,res){
    visitcat.findByIdAndUpdate(req.params.id, {visitcatname: req.body.catname, visitcatdetail: req.body.visitcatdetail, visitcatorder: req.body.visitcatorder}, function(err, returnedcat){
        if(err){
            console.log(err);
            res.redirect("/adminvisitcat");
        } else {
            console.log("Success Update");
            console.log("id" + req.params.id);
            console.log("visitcatdetails is:  " + req.body.visitcatdetail);
            console.log(returnedcat);
            res.redirect("/adminvisitcat");
        }
    });
});

router.delete("/adminvisitcat/:id", middleware.isLoggedin, function(req,res){
    visitcat.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/adminvisitcat");
        } else{
            console.log("Deleted row:" + req.params.id);
            res.redirect("/adminvisitcat");
        }      
    });
});

router.get("/visit", middleware.isLoggedin, function(req,res){
        var returnedsubjects = [];
        var returnedvisits = [];
        res.render("visit",{returnedsubjects: returnedsubjects, visits: returnedvisits});
});

router.post("/visit", middleware.isLoggedin, function(req,res){
    var text = req.body.user;
    subject.find({ $text:{$search: text}}).sort('Visit_date').exec(function(err,returnedsubjects){
    //subject.find({Subject_Name: new RegExp('^'+text+'$', "i")}).sort('Visit_date').exec(function(err,returnedsubjects){        
        var returnedvisits = [];
        if(err){
            console.log(err);
        } else {
            if((!returnedsubjects || !returnedsubjects.length)){
                console.log(returnedsubjects);
                console.log("Array is empty");
                req.flash("error", "There is no SUBJECT matching the search criteria");
                res.redirect("/visit");
            } else {
                res.render("visit",{returnedsubjects: returnedsubjects, visits: returnedvisits});
            }            
        }
    });
});

router.get("/visit/subject/:id", middleware.isLoggedin, function(req,res){
    visit.find({ Subject: req.params.id }).populate("Study").populate("Site").populate("Phase").populate("Subject").sort('Visit_date').exec(function(err,returnedvisits){
        var returnedsubjects = [];
        if(err){
            console.log(err);
        } else {
            visitcat.find({}).sort('visitcatorder').exec(function(err,returnedvisitcats){
                if(err){
                    console.log(err);
                } else {
                    visitfields.find({}).sort('fieldorder').exec(function(err,returnedvisitfields){
                        if(err){
                            console.log(err);
                        } else {
                            res.render("visit", {visitfields: returnedvisitfields, visitcats: returnedvisitcats, visits: JSON.parse(JSON.stringify(returnedvisits)), returnedsubjects: returnedsubjects});
                        }
                    });
                }
            });
        }
    });
});

//visit delete route
router.delete("/visit/subject/:id", middleware.isLoggedin, function(req,res){
    visit.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/visit");
        } else{
            console.log("Deleted row:" + req.params.id);
            res.redirect("/visit");
        }      
    });
});

//visit EDIT route
router.get("/visit/subject/:id/edit", middleware.isLoggedin, function(req,res){
    visitfields.find({}).sort('fieldorder').exec(function(err,returnedvisitfields){
        if(err){
            console.log(err);
            res.redirect("/visit");
        } else {
            visitcat.find({}).sort('visitcatorder').exec(function(err,returnedvisitcats){
                if(err){
                    console.log(err);
                } else {
                    visit.findById(req.params.id).populate("Study").populate("Site").populate("Phase").populate("Subject").sort('Visit_date').exec(function(err,returnedvisit){
                        if(err){
                            console.log(err);
                        } else {
                            phase.find({}).sort('Phase_number').exec(function(err,returnedphase){
                                if(err){
                                    console.log(err);
                                } else {
                                    site.find({}).sort('Site_short_name').exec(function(err,returnedsite){
                                        if(err){
                                            console.log(err);
                                        } else {
                                            study.find({}).sort('Study_short_name').exec(function(err,returnedstudy){
                                                if(err){
                                                    console.log(err);
                                                } else {
                                                    res.render("adminvisitedit", {returnedstudy: returnedstudy, returnedsite: returnedsite, returnedphase: returnedphase, returnedvisitfields: returnedvisitfields, returnedvisitcats: returnedvisitcats, returnedvisit: JSON.parse(JSON.stringify(returnedvisit))});                                            
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

router.put("/visit/subject/:id",middleware.isLoggedin, function(req,res){
    visit.findByIdAndUpdate(req.params.id, req.body.returnedvisit, function(err, returnedvisit){
        if(err){
            console.log(err);
            res.redirect("/visit");
        } else {
            console.log("Success Update");
            res.redirect("/visit");
        }
    });
});


module.exports = router;