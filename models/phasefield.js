var mongoose = require("mongoose");

var phasefieldsSchema = new mongoose.Schema({
  phasecatname: String,
  fieldname: String,
  fieldinputtype: String,
  checkboxvalues: [String],
  radiovalues: [String],
  fieldorder: Number,
});

module.exports = mongoose.model("phasefields", phasefieldsSchema);
