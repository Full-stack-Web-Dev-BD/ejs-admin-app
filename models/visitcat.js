var mongoose = require("mongoose");

var visitcatSchema = new mongoose.Schema({
    visitcatname:   String,
    visitcatdetail:  String,
    visitcatorder:  Number
});

module.exports = mongoose.model("visitcat", visitcatSchema);