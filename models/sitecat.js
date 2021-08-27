var mongoose = require("mongoose");

var sitecatSchema = new mongoose.Schema({
    sitecatname:   String,
    sitecatdetail:  String,
    sitecatorder:  Number
});

module.exports = mongoose.model("sitecat", sitecatSchema);