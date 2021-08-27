var mongoose = require("mongoose");

var studySchema = new mongoose.Schema({
    Study_short_name: String,
    Study_name:  String
},{ strict: false });

// var studyfields = mongoose.model("studyfields", studyfieldsSchema);
module.exports = mongoose.model("study", studySchema);