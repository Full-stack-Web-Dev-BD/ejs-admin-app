var mongoose = require("mongoose");

var subjectschema = new mongoose.Schema({
    Subject_Name: String,
    Subject_DOB: Date,
    Subject_Address: String,
    Subject_City: String,
    Subject_Prov: String,
    Subject_zip: String,
    Subject_Country: String
},{ strict: false });

subjectschema.index({ Subject_Name: "text" })

module.exports = mongoose.model("subject", subjectschema);