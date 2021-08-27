var mongoose = require("mongoose");

var visitfieldsSchema = new mongoose.Schema({
    visitcatname: String,
    fieldname:  String,  
    fieldinputtype: String,
    checkboxvalues: [String],
    radiovalues: [String],
    fieldorder:  Number
});

module.exports = mongoose.model("staged_visitfields", visitfieldsSchema);