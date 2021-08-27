var mongoose = require("mongoose");

var sitefieldsSchema = new mongoose.Schema({
    sitecatname: String,
    fieldname:  String,  
    fieldinputtype: String,
    checkboxvalues: [String],
    radiovalues: [String],
    dropdownvalues: [String],
    fieldorder:  Number
});

// var studyfields = mongoose.model("studyfields", studyfieldsSchema);
module.exports = mongoose.model("staged_sitefields", sitefieldsSchema);