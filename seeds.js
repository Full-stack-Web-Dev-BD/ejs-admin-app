var mongoose = require("mongoose");
var Roles = require("./models/roles");
var Status = require("./models/userstatus");
var subjectcat = require("./models/subjectcat");
var studycat = require("./models/studycat");
var sitecat = require("./models/sitecat");
var phasecat = require("./models/phasecat");
var visitcat = require("./models/visitcat");
var studyfield = require("./models/studyfield");
var sitefield = require("./models/sitefield");
var subjectfield = require("./models/subjectfield");
var phasefield = require("./models/phasefield");
let user = require("./models/user");

var roledata = [
    {role: "Admin"},
    {role: "User"}
];
var userstatusdata = [
    {status: "Active"},
    {status: "Inactive"}
];

var subjectcatdata = [
    {subjectcatname: 'General', subjectcatorder: 10}
];

var studycatdata = [
    {studycatname: 'General', studycatorder: 10}
];

var sitecatdata = [
    {sitecatname: 'General', sitecatorder: 10}
];

var visitcatdata = [
    {visitcatname: 'General', visitcatorder: 10}
];

var phasecatdata = [
    {phasecatname: 'General', phasecatorder: 10}
];

var studyfielddata = [
    {studycatname: 'General', fieldname: 'Study_short_name', fieldinputtype: "Text Box", fieldorder: 10},
    {studycatname: 'General', fieldname: 'Study_name', fieldinputtype: "Text Box", fieldorder: 20}
];

var sitefielddata = [
    {sitecatname: 'General', fieldname: 'Site_short_name', fieldinputtype: "Text Box", fieldorder: 10},
    {sitecatname: 'General', fieldname: 'Site_name', fieldinputtype: "Text Box", fieldorder: 20}
];

var subjectfielddata = [
    {subjectcatname: 'General', fieldname: 'Subject_Name',  fieldinputtype: "Text Box", fieldorder: 10},
    {subjectcatname: 'General', fieldname: 'Subject_DOB', fieldinputtype: "Date", fieldorder: 20},
    {subjectcatname: 'General', fieldname: 'Subject_Address', fieldinputtype: "Text Box", fieldorder: 30},
    {subjectcatname: 'General', fieldname: 'Subject_City', fieldinputtype: "Text Box", fieldorder: 40},
    {subjectcatname: 'General', fieldname: 'Subject_Prov', fieldinputtype: "Text Box", fieldorder: 50},
    {subjectcatname: 'General', fieldname: 'Subject_zip', fieldinputtype: "Text Box", fieldorder: 60},
    {subjectcatname: 'General', fieldname: 'Subject_Country', fieldinputtype: "Text Box", fieldorder: 70}
]

var phasefielddata = [
    {phasecatname: 'General', fieldname: 'Phase_number',  fieldinputtype: "Text Box", fieldorder: 10}
];

let userdata = [
    {username: 'root', password: 'root', fullname: 'Tryals Admin', role: 'Admin', status: 'Active'}
]

function seedrole(){
    Roles.deleteMany({}, function(err){
        if(err) {
            console.log(err);
        }
        console.log("Deleted all roles");
            roledata.forEach(function(x){
                //x represent each data in the data array
                Roles.create(x, function(err,roledata){
                    if (err){
                        console.log(err);
                    }else{
                        console.log("Added a role");
                    }
        
                });
            })
    });
}

function seedDBstatus(){
    Status.deleteMany({}, function(err){
        if(err) {
            console.log(err);
        }
        console.log("Deleted all user status");
            userstatusdata.forEach(function(seedstatusdata){
                Status.create(seedstatusdata, function(err,data){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("Added a status");
                    }
                });
            });
    });
}

function seedcat(){
    subjectcat.deleteOne({subjectcatname: 'General'}, function(err){
        if(err) {
            console.log(err);
        }
        console.log("Deleted SUBJECT cat General");
            subjectcatdata.forEach(function(seedsubjectcatdata){
                subjectcat.create(seedsubjectcatdata, function(err,data){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("Added SUBJECT cat General");
                    }
                });
            });
    });
    studycat.deleteOne({studycatname: 'General'}, function(err){
        if(err) {
            console.log(err);
        }
        console.log("Deleted STUDY cat General");
            studycatdata.forEach(function(seedstudycatdata){
                studycat.create(seedstudycatdata, function(err,data){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("Added STUDY cat General");
                    }
                });
            });
    });
    sitecat.deleteOne({sitecatname: 'General'}, function(err){
        if(err) {
            console.log(err);
        }
        console.log("Deleted SITE cat General");
            sitecatdata.forEach(function(seedsitecatdata){
                sitecat.create(seedsitecatdata, function(err,data){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("Added SITE cat General");
                    }
                });
            });
    });
    visitcat.deleteOne({visitcatname: 'General'}, function(err){
        if(err) {
            console.log(err);
        }
        console.log("Deleted VISIT cat General");
            visitcatdata.forEach(function(seedvisitcatdata){
                visitcat.create(seedvisitcatdata, function(err,data){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("Added VISIT cat General");
                    }
                });
            });
    });
    phasecat.deleteOne({phasecatname: 'General'}, function(err){
        if(err) {
            console.log(err);
        }
        console.log("Deleted PHASE cat General");
            phasecatdata.forEach(function(seedphasecatdata){
                phasecat.create(seedphasecatdata, function(err,data){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("Added PHASE cat General");
                    }
                });
            });
    });
}

function seedstudyfields(){
    studyfield.countDocuments(function(err, count){
        if (!err && count === 0){
            studyfield.deleteMany({}, function(err){
                if(err) {
                    console.log(err);
                }
                console.log("Deleted the default STUDY fields");
                    studyfielddata.forEach(function(seedstudyfielddata){
                        studyfield.create(seedstudyfielddata, function(err,data){
                            if(err){
                                console.log(err);
                            }else{
                                console.log("Added the default STUDY fields");
                            }
                        });
                    });
            });
        }
    });
}

function seedsitefields(){
    sitefield.countDocuments(function(err, count){
        if (!err && count === 0){
            sitefield.deleteMany({}, function(err){
                if(err) {
                    console.log(err);
                }
                console.log("Deleted the default SITE fields");
                    sitefielddata.forEach(function(seedsitefielddata){
                        sitefield.create(seedsitefielddata, function(err,data){
                            if(err){
                                console.log(err);
                            }else{
                                console.log("Added the default SITE fields");
                            }
                        });
                    });
            });
        }
    });
}

function seedsubjectfields(){
    subjectfield.countDocuments(function(err, count){
        if (!err && count === 0){
            subjectfield.deleteMany({}, function(err){
                if(err) {
                    console.log(err);
                }
                console.log("Deleted the default SUBJECT fields");
                    subjectfielddata.forEach(function(seedsubjectfielddata){
                        subjectfield.create(seedsubjectfielddata, function(err,data){
                            if(err){
                                console.log(err);
                            }else{
                                console.log("Added the default SUBJECT fields");
                            }
                        });
                    });
            });
        }
    });
}

function seedphasefields(){
    phasefield.countDocuments(function(err, count){
        if (!err && count === 0){
            phasefield.deleteMany({}, function(err){
                if(err) {
                    console.log(err);
                }
                console.log("Deleted the default PHASE fields");
                    phasefielddata.forEach(function(seedphasefielddata){
                        phasefield.create(seedphasefielddata, function(err,data){
                            if(err){
                                console.log(err);
                            }else{
                                console.log("Added the default PHASE fields");
                            }
                        });
                    });
            });
        }
    });
}

function seedUsers(){
    user.countDocuments(function(err,count){
        if (count === 0){
            userdata.forEach(function(x){
                let newUser = new user({username: x.username, role: x.role, fullname: x.fullname})
                user.register(newUser, x.password, function(err,user){
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Created the root Admin user")
                    }
                });
            });
        } else {
            console.log (`There are ${count} users in the system`)
        }
    })
}

module.exports = {
    seedDBstatus,
    seedrole,
    seedcat,
    seedstudyfields,
    seedsitefields,
    seedsubjectfields,
    seedphasefields,
    seedUsers
}
