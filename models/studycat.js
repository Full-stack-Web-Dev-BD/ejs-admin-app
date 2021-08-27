var mongoose = require("mongoose");

var studycatSchema = new mongoose.Schema({
    studycatname:   String,
    studycatdetail:  String,
    studycatorder:  Number
});


module.exports = mongoose.model("studycat", studycatSchema);