var express = require("express");
var router = express.Router();
var sitefields = require("../models/sitefield");
var sitecat = require("../models/sitecat");
var site = require("../models/site");
var logs = require("../models/logs");
var middleware = require("../middleware"); //index.js is a special name. So you don't have to explicitly mention the filename.

router.get("/adminsite", middleware.isLoggedin, function(req,res){
    sitefields.find({}).sort('fieldorder').exec(function(err,returnedsitefields){
        if(err){
            console.log(err);
            res.redirect("/adminsite");
        } else {
            sitecat.find({}).sort('sitecatorder').exec(function(err,returnedsitecats){
               if(err){
                   console.log(err);
               } else {
                    res.render("adminsite", {siteadmin: returnedsitefields, sitecats : returnedsitecats });  
                     let datetime = new Date();
                     let logDate = datetime;
                     let logUser = req.user.username;
                     let logAction = "Visited ADMINSITE - Checked configured fields for SITES"
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

router.post("/adminsite", middleware.isLoggedin, function(req, res){
    //console.log(req.body.study); //Shows parameters coming from the form. 
    var sitecatname = req.body.catname;
    var fieldname = req.body.fieldname;
    var fieldinputtype = req.body.fieldinputtype;
    var checkboxvalues = req.body.checkboxvalues;
    var checkboxvaluesarr = checkboxvalues.split(',');
    var radiovalues = req.body.radiovalues;
    var radiovaluesarr = radiovalues.split(','); 
    var dropdownvalues = req.body.dropdownvalues;
    var dropdownvaluesarr = dropdownvalues.split(','); 
    var fieldorder = req.body.fieldorder;
    var newsitefield = {fieldname: fieldname, fieldinputtype: fieldinputtype, sitecatname: sitecatname, fieldorder: fieldorder, checkboxvalues: checkboxvaluesarr, radiovalues: radiovaluesarr, dropdownvalues: dropdownvaluesarr} // Tablefieldname: Variablename
    //create a new studyfield and save it to the database.
    sitefields.create(newsitefield, function(err,newlycreated_sf){
        if(err){
            console.log(err);
            res.redirect("/adminsite");
        } else{
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Created a new field for SITE - ${newlycreated_sf.fieldname}.`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
            res.redirect("/adminsite"); //redirects to GET route.
        }
    });
});

//Adminsite EDIT route
router.get("/adminsite/:id/edit", middleware.isLoggedin, function(req,res){
    sitefields.findById(req.params.id, function(err, returnedsitefield){
        if(err){
            console.log(err);
            res.redirect("/adminsite");
        } else {
            sitecat.find({},function(err,returnedcats){
                if(err){
                    console.log(err);
                } else {
                    res.render("admsitefieldedit", {editedsitefield: returnedsitefield, sitecats : returnedcats});
                    let datetime = new Date();
                    let logDate = datetime;
                    let logUser = req.user.username;
                    let logAction = `On the page to edit the SITE FIELD - ${returnedsitefield.fieldname}. Did not edit yet.`
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

//Adminsite UPDATE route
router.put("/adminsite/:id",middleware.isLoggedin, function(req,res){
    sitefields.findByIdAndUpdate(req.params.id, {fieldorder: req.body.fieldorder, sitecatname: req.body.catname, fieldname: req.body.fieldname, fieldinputtype: req.body.fieldinputtype, checkboxvalues: (req.body.checkboxvalues).split(','), radiovalues: (req.body.radiovalues).split(',')}, function(err, returnedstudyfield){
        if(err){
            console.log(err);
            res.redirect("/adminsite");
        } else {
            console.log("Success Update");
            res.redirect("/adminsite");
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Updated a SITE FIELD - ${req.params.id}`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }
    });
});

//adminsite delete route
router.delete("/adminsite/:id", middleware.isLoggedin, function(req,res){
    sitefields.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/adminsite");
        } else{
            console.log("Deleted row:" + req.params.id);
            res.redirect("/adminsite");
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Deleted a SITE FIELD - ${req.params.id}`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }      
    });
});

//adminsite category 
router.get("/adminsitecat", middleware.isLoggedin, function(req,res){
    //Get all site fields from DB
    sitecat.find({}).sort('sitecatorder').exec(function(err,returnedsitecat){
        if(err){
            console.log(err);
        } else {
            res.render("adminsitecat", {sitecat: returnedsitecat})
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Visited the SITE CATEGORIES page`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }
    });
});

router.post("/adminsitecat", middleware.isLoggedin, function(req, res){
    var adminsitecat = req.body.adminsitecat;
    var sitecatorder = req.body.sitecatorder;
    var sitecatdetail = req.body.sitecatdetail;
    var newadminsitecat = { sitecatname: adminsitecat, sitecatorder: sitecatorder, sitecatdetail: sitecatdetail};
    //create a new studycategory and save it to the database.
    sitecat.create(newadminsitecat, function(err,newlycreated_sc){
        if(err){
            console.log(err);
        } else {
            res.redirect("/adminsitecat"); //redirects to GET route.
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Created a SITE CATOGORY - ${newlycreated_sc.sitecatname}`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }
    });
});

router.get("/adminsitecat/:id/edit", middleware.isLoggedin, function(req,res){
    sitecat.findById(req.params.id, function(err, returnedcat){
        if(err){
            console.log(err);
            res.redirect("/adminsitetcat");
        } else {
            res.render("admsitecatedit", {editedcat: returnedcat});
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Visited the page to edit the SITE CATEGORY - ${returnedcat.sitecatname}. Did not edit yet.`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }
    });
});

router.put("/adminsitecat/:id", middleware.isLoggedin, function(req,res){
    sitecat.findByIdAndUpdate(req.params.id, {sitecatname: req.body.catname, sitecatdetail: req.body.sitecatdetail, sitecatorder: req.body.sitecatorder}, function(err, returnedcat){
        if(err){
            console.log(err);
            res.redirect("/adminsitecat");
        } else {
            res.redirect("/adminsitecat");
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Updated (Edited) a SITE CATEGORY - ${returnedcat.sitecatname}.`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }
    });
});

router.delete("/adminsitecat/:id", middleware.isLoggedin, function(req,res){
    sitecat.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/adminsitecat");
        } else{
            console.log("Deleted row:" + req.params.id);
            res.redirect("/adminsitecat");
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Deleted a SITE CATEGORY - ${req.params.id}.`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }      
    });
});

router.get("/adminsiteconfig", middleware.isLoggedin, function(req,res){
    sitefields.find({}).sort('fieldorder').exec(function(err,returnedsitefields){
        if(err){
            console.log(err);
        } else {
            //studycat.find({}, function(err,returnedstudycats){
            sitecat.find({}).sort('sitecatorder').exec(function(err,returnedsitecats){
                if(err){
                    console.log(err);
                } else {
                    res.render("adminsiteconfig", {siteadmin: returnedsitefields, sitecats: returnedsitecats});
                    let datetime = new Date();
                    let logDate = datetime;
                    let logUser = req.user.username;
                    let logAction = `Visited SITE CREATION page.`
                    let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
                    logs.create(newlog, function(err, newlycreatedlog){
                       if(err) {
                           console.log(err);
                       } 
                    });
                    console.log(returnedsitefields);
                }
            });
           }
    });
});

function cleansing(site){
    var newsite = {};
    Object.keys(site).forEach(function(key){
        if (Array.isArray(site[key])) {
            var newitem = [];
            site[key].forEach(function(a){
                if (a !== "" && a !== "on" && a !== "Other") {
                    newitem.push(a);
                }
            });
            delete newsite[key];
            newsite[key] = newitem;
        } else {
            newsite[key] = site[key];
        }
    });
    return newsite;
}

router.post("/adminsiteconfig", middleware.isLoggedin, function(req, res){
   //create a new studycategory and save it to the database.
    site.create(cleansing(req.body.site), function(err,newsite){
        if(err){
            console.log(err);
            res.redirect("/adminsiteconfig");
        } else {
            res.redirect("/adminsiteconfig"); //redirects to GET route.
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Created a new SITE - ${newsite.Site_name}.`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }
    });
});

router.get("/adminsitehome", middleware.isLoggedin, function(req,res){
    sitefields.find({}).sort('fieldorder').exec(function(err,returnedsitefields){
        if(err){
            console.log(err);
        } else {
            //studycat.find({}, function(err,returnedstudycats){
            sitecat.find({}).sort('sitecatorder').exec(function(err,returnedsitecats){
                if(err){
                    console.log(err);
                } else {
                    site.find({},function(err,returnedsite){
                        if(err){
                            console.log(err);
                        } else {
                            res.render("adminsitehome", {sitefields: returnedsitefields, sitecats: returnedsitecats, sites: JSON.parse(JSON.stringify(returnedsite))});  
                            let datetime = new Date();
                            let logDate = datetime;
                            let logUser = req.user.username;
                            let logAction = `Visited SITES listing page (SITE HOME)`
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

//adminsite delete route
router.delete("/adminsitehome/:id", middleware.isLoggedin, function(req,res){
    site.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/adminsitehome");
        } else{
            console.log("Deleted row:" + req.params.id);
            res.redirect("/adminsitehome");
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Deleted a site - ${req.params.id}`
            let newlog = {logDate: logDate, logUser: logUser, logAction: logAction}
            logs.create(newlog, function(err, newlycreatedlog){
               if(err) {
                   console.log(err);
               } 
            });
        }      
    });
});

router.get("/adminsitehome/:id/edit", middleware.isLoggedin, function(req,res){
    sitefields.find({}).sort('fieldorder').exec(function(err,returnedsitefields){
        if(err){
            console.log(err);
            res.redirect("/adminsitehome");
        } else {
            sitecat.find({}).sort('sitecatorder').exec(function(err,returnedsitecats){
                if(err){
                    console.log(err);
                } else {
                    site.findById(req.params.id, function(err, returnedsite){
                        if(err){
                            console.log(err);
                        } else {
                            res.render("adminsitehomeedit", {returnedsitefields: returnedsitefields, returnedsitecats: returnedsitecats, returnedsite: JSON.parse(JSON.stringify(returnedsite))});
                            let datetime = new Date();
                            let logDate = datetime;
                            let logUser = req.user.username;
                            let logAction = `Visited the SITE EDIT PAGE to edit - ${returnedsite.Site_name}. Did not edit yet.`
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

router.put("/adminsitehomeedit/:id",middleware.isLoggedin, function(req,res){
    site.findByIdAndUpdate(req.params.id, req.body.returnedsite, function(err, returnedsite){
        if(err){
            console.log(err);
            res.redirect("/adminsitehome");
        } else {
            console.log("Success Update");
            console.log(req.body.site);
            console.log(returnedsite);
            res.redirect("/adminsitehome");
            let datetime = new Date();
            let logDate = datetime;
            let logUser = req.user.username;
            let logAction = `Updated the SITE - ${returnedsite.Site_name}.`
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