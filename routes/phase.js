var express = require("express");
var router = express.Router();
var phase  = require("../models/phase");
var phasecat = require("../models/phasecat");
var phasefields = require("../models/phasefield");
var middleware = require("../middleware"); //index.js is a special name. So you don't have to explicitly mention the filename.

router.get("/adminphase", middleware.isLoggedin, function(req,res){
    phasefields.find({}).sort('fieldorder').exec(function(err,returnedphasefields){
        if(err){
            console.log(err);
        } else {
            phasecat.find({}).sort('phasecatorder').exec(function(err,returnedphasecats){
               if(err){
                   console.log(err);
               } else {
                     res.render("adminphase", {phasefields: returnedphasefields, phasecats : returnedphasecats });
               }  
            });
        }
    });
});

router.post("/adminphase", middleware.isLoggedin, function(req, res){
    //console.log(req.body.phase); //Shows parameters coming from the form. 
    var phasecatname = req.body.catname;
    var fieldname = req.body.fieldname;
    var fieldinputtype = req.body.fieldinputtype;
    var checkboxvalues = req.body.checkboxvalues;
    var checkboxvaluesarr = checkboxvalues.split(',');
    var radiovalues = req.body.radiovalues;
    var radiovaluesarr = radiovalues.split(','); 
    var fieldorder = req.body.fieldorder;
    var newphasefield = {fieldname: fieldname, fieldinputtype: fieldinputtype, phasecatname: phasecatname, fieldorder: fieldorder, checkboxvalues: checkboxvaluesarr, radiovalues: radiovaluesarr} // Tablefieldname: Variablename
    //create a new phasefield and save it to the database.
    phasefields.create(newphasefield, function(err,newlycreated_sf){
        if(err){
            console.log(err);
        } else{
            res.redirect("/adminphase"); //redirects to GET route.
        }
    });
});

//Adminphase EDIT route
router.get("/adminphase/:id/edit", middleware.isLoggedin, function(req,res){
    phasefields.findById(req.params.id, function(err, returnedphasefield){
        if(err){
            console.log(err);
            res.redirect("/adminphase");
        } else {
            //console.log(req.params) //- Only displays ID because only is in the URL request
            //console.log(returnedphasefield); // returns the JSON of the whole field.
            phasecat.find({},function(err,returnedcats){
                if(err){
                    console.log(err);
                } else {
                    res.render("admphaseedit", {returnedphasefields: returnedphasefield, phasecats : returnedcats});
                }
            });
        }
    });
});

//Adminphase UPDATE route
router.put("/adminphase/:id",middleware.isLoggedin, function(req,res){
    phasefields.findByIdAndUpdate(req.params.id, {fieldorder: req.body.fieldorder, phasecatname: req.body.catname, fieldname: req.body.fieldname, fieldinputtype: req.body.fieldinputtype, checkboxvalues: (req.body.checkboxvalues).split(','), radiovalues: (req.body.radiovalues).split(',')}, function(err, returnedphasefield){
        if(err){
            console.log(err);
            res.redirect("/adminphase");
        } else {
            console.log("Success Update");
            console.log(req.params.id);
            console.log(req.body.fieldname);
            console.log(returnedphasefield);
            res.redirect("/adminPhase");
        }
    });
});


//adminphasefield delete route
router.delete("/adminphase/:id", middleware.isLoggedin, function(req,res){
    phasefields.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/adminphase");
        } else{
            console.log("Deleted row:" + req.params.id);
            res.redirect("/adminphase");
        }      
    });
});

//adminphase category 
router.get("/adminphasecat", middleware.isLoggedin, function(req,res){
    //Get all phase fields from DB
    phasecat.find({}).sort('phasecatorder').exec(function(err,returnedphasecat){
        if(err){
            console.log(err);
        } else {
            res.render("adminphasecat", {phasecat: returnedphasecat})
        }
    });
});

router.post("/adminphasecat", middleware.isLoggedin, function(req, res){
    var adminphasecat = req.body.adminphasecat;
    var phasecatorder = req.body.phasecatorder;
    var phasecatdetail = req.body.phasecatdetail;
    var newadminphasecat = { phasecatname: adminphasecat, phasecatorder: phasecatorder, phasecatdetail: phasecatdetail};
    //create a new studycategory and save it to the database.
    phasecat.create(newadminphasecat, function(err,newlycreated_pt){
        if(err){
            console.log(err);
        } else {
            console.log(newadminphasecat);
            console.log(newlycreated_pt);
            res.redirect("/adminphasecat"); //redirects to GET route.
        }
    });
});

router.get("/adminphasecat/:id/edit", middleware.isLoggedin, function(req,res){
    phasecat.findById(req.params.id, function(err, returnedcat){
        if(err){
            console.log(err);
            res.redirect("/adminphasetcat");
        } else {
            res.render("admphasecatedit", {editedcat: returnedcat});
        }
    });
});

router.put("/adminphasecat/:id", middleware.isLoggedin, function(req,res){
    phasecat.findByIdAndUpdate(req.params.id, {phasecatname: req.body.catname, phasecatdetail: req.body.phasecatdetail, phasecatorder: req.body.phasecatorder}, function(err, returnedcat){
        if(err){
            console.log(err);
            res.redirect("/adminphasecat");
        } else {
            console.log("Success Update");
            console.log("id" + req.params.id);
            console.log("phasecatdetails is:  " + req.body.phasecatdetail);
            console.log(returnedcat);
            res.redirect("/adminphasecat");
        }
    });
});

router.delete("/adminphasecat/:id", middleware.isLoggedin, function(req,res){
    phasecat.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/adminphasecat");
        } else{
            console.log("Deleted row:" + req.params.id);
            res.redirect("/adminphasecat");
        }      
    });
});

router.get("/adminphaseconfig", middleware.isLoggedin, function(req,res){
    phasefields.find({}).sort('fieldorder').exec(function(err,returnedphasefields){
        if(err){
            console.log(err);
        } else {
            phasecat.find({}).sort('phasecatorder').exec(function(err,returnedphasecats){
                if(err){
                    console.log(err);
                } else {
                    res.render("adminphaseconfig", {phasefields: returnedphasefields, phasecats: returnedphasecats});  
                }
            });
           }
    });
});

function cleansing(phase){
    var newphase = {};
    Object.keys(phase).forEach(function(key){
        if (Array.isArray(phase[key])) {
            var newitem = [];
            phase[key].forEach(function(a){
                if (a !== "" && a !== "on" && a !== "Other") {
                    newitem.push(a);
                }
            });
            delete newphase[key];
            newphase[key] = newitem;
        } else {
            newphase[key] = phase[key];
        }
    });
    return newphase;
}

router.post("/adminphaseconfig", middleware.isLoggedin, function(req, res){
    //create a new phasecategory and save it to the database.
     phase.create(cleansing(req.body.phase), function(err,newphase){
         if(err){
             console.log(err);
             res.redirect("/adminphaseconfig");
         } else {
             console.log(req.body.phase);
             res.redirect("/adminphaseconfig"); //redirects to GET route.
         }
     });
});

router.get("/phase", middleware.isLoggedin, function(req,res){
    phasefields.find({}).sort('fieldorder').exec(function(err,returnedphasefields){
        if(err){
            console.log(err);
        } else {
            phasecat.find({}).sort('phasecatorder').exec(function(err,returnedphasecats){
                if(err){
                    console.log(err);
                } else {
                    phase.find({},function(err,returnedphase){
                        if(err){
                            console.log(err);
                        } else {
                            res.render("phasehome", {phasefields: returnedphasefields, phasecats: returnedphasecats, phases: JSON.parse(JSON.stringify(returnedphase))});  
                        }
                    }); 
                }
            });
        }
    });
});

router.delete("/phase/:id", middleware.isLoggedin, function(req,res){
    phase.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/phase");
        } else{
            console.log("Deleted row:" + req.params.id);
            res.redirect("/phase");
        }      
    });
});


router.get("/phase/:id/edit", middleware.isLoggedin, function(req,res){
    phasefields.find({}).sort('fieldorder').exec(function(err,returnedphasefields){
        if(err){
            console.log(err);
            res.redirect("/phase");
        } else {
            phasecat.find({}).sort('phasecatorder').exec(function(err,returnedphasecats){
                if(err){
                    console.log(err);
                } else {
                    phase.findById(req.params.id, function(err, returnedphase){
                        if(err){
                            console.log(err);
                        } else {
                            res.render("phaseedit", {returnedphasefields: returnedphasefields, returnedphasecats: returnedphasecats, returnedphase: JSON.parse(JSON.stringify(returnedphase))});
                        }
                    });
                }
            });
        }
    });
});

router.put("/phaseedit/:id",middleware.isLoggedin, function(req,res){
    phase.findByIdAndUpdate(req.params.id, req.body.returnedphase, function(err, returnedphase){
        if(err){
            console.log(err);
            res.redirect("/phase");
        } else {
            console.log("Success Update");
            console.log(req.body.phase);
            console.log(returnedphase);
            res.redirect("/phase");
        }
    });
});

module.exports = router;