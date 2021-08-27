var mongoose = require("mongoose");

var subjectcatSchema = new mongoose.Schema({
    subjectcatname:   String,
    subjectcatdetail:  String,
    subjectcatorder:  Number
});

module.exports = mongoose.model("subjectcat", subjectcatSchema);