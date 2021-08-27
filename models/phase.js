var mongoose = require("mongoose");

var phaseSchema = new mongoose.Schema({
    Phase_number:  Number
},{ strict: false });

module.exports = mongoose.model("phase", phaseSchema);