var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    fullname: String,
    role: String,
    status: String
});

userSchema.plugin(passportLocalMongoose); //now "user" gets methods from passport-local-mongoose

module.exports = mongoose.model("user", userSchema);