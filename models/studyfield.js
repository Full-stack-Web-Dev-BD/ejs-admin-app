var mongoose = require("mongoose");

var studyfieldsSchema = new mongoose.Schema({
    studycatname: String,
    fieldname:  String,  
    fieldinputtype: String,
    checkboxvalues: [String],
    radiovalues: [String],
    dropdownvalues: [String],
    fieldorder:  Number
});

// var studyfields = mongoose.model("studyfields", studyfieldsSchema);
module.exports = mongoose.model("staged_studyfields", studyfieldsSchema);