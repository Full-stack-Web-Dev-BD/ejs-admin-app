var express = require('express');
var app = express();
var bodyParser = require("body-parser"); //Parse all paramerers in body
var methodOverride = require("method-override"); //override methods with PUT and DELETE.
var mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);
var passport = require("passport");
var LocalStrategy = require("passport-local");
var flash = require("connect-flash");
var user = require("./models/user");
var roles = require("./models/roles");
var studycat = require("./models/studycat");
var studyfields = require("./models/studyfield");
var seedDB = require("./seeds");
var seedrole = seedDB.seedrole;
var seedDBstatus = seedDB.seedDBstatus;
var seedcat = seedDB.seedcat;
var seedstudyfields = seedDB.seedstudyfields;
var seedsitefields = seedDB.seedsitefields;
var seedsubjectfields = seedDB.seedsubjectfields;
var seedphasefields = seedDB.seedphasefields;
let seedUsers = seedDB.seedUsers;

seedDBstatus();
seedrole();
seedcat();
seedstudyfields();
seedsitefields();
seedsubjectfields();
seedphasefields();
seedUsers();

var adminstudyRoutes = require("./routes/adminstudy");
var authRoutes = require("./routes/auth");
var adminsiteRoutes = require("./routes/adminsite");
var adminsubjectRoutes = require("./routes/adminsubject");
var phaseRoutes = require("./routes/phase");
var visitRoutes = require("./routes/visit");
var reportsRoutes = require("./routes/reports");

//============APP CONFIG START======================//
mongoose.connect("mongodb://localhost:27017/Tryals", { useNewUrlParser: true, useFindAndModify: false });
app.set("view engine", "ejs"); // Don't have to add .ejs when a template is called.
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method")); //When it sees "_method" in a form it will override. 
app.use(flash());
//----- Passport config-------------------
app.use(require("express-session")({
    secret: "Tryals is the best 1234!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
//This function passes the currentUser to all templates, you dont have to pass currentUser from each route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use(authRoutes);
app.use(adminstudyRoutes);
app.use(adminsubjectRoutes);
app.use(adminsiteRoutes);
app.use(phaseRoutes);
app.use(visitRoutes);
app.use(reportsRoutes);

//---------------------------------------
//============APP CONFIG END======================//


app.listen(3000, "127.0.0.1", function(){
    console.log("Tryals is running on port 3000")
});