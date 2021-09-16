var mongoose = require("mongoose");

var subjectfieldsSchema = new mongoose.Schema({
  subjectcatname: String,
  fieldname: String,
  fieldinputtype: String,
  checkboxvalues: [String],
  radiovalues: [String],
  fieldorder: Number,
});

// var studyfields = mongoose.model("studyfields", studyfieldsSchema);
module.exports = mongoose.model("subjectfields", subjectfieldsSchema);
