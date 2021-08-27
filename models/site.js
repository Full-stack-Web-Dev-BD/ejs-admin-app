var mongoose = require("mongoose");

var siteSchema = new mongoose.Schema({
    Site_short_name: String,
    Site_name:  String
},{ strict: false });

// var studyfields = mongoose.model("studyfields", studyfieldsSchema);
module.exports = mongoose.model("site", siteSchema);