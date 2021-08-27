
//Created our own middlewares to use on any route

var middlewareObj = {};

middlewareObj.isLoggedin = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first");
    console.log("No loggedin user");
    res.redirect("/");
}

middlewareObj.isLoggedinAdmin = function(req, res, next){
    if (req.isAuthenticated())  {
       if (req.user.role === "Admin") {
            return next();
       }
       req.flash("error", "You should be an ADMIN to access that page");
       console.log("inside isLoggedinAdmin. Authernticated but not an admin");
       res.redirect("/adminstudy");
    } else {
        req.flash("error", "Please login first");
        console.log("inside isLoggedinAdmin but after the IF admin statement");
        res.redirect("/");
    }
}

module.exports = middlewareObj;
