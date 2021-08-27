var mongoose = require("mongoose");

var phasecatSchema = new mongoose.Schema({
    phasecatname:   String,
    phasecatdetail:  String,
    phasecatorder:  Number
});


module.exports = mongoose.model("phasecat", phasecatSchema);