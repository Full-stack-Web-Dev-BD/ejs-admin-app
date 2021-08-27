var mongoose = require("mongoose");

var visitSchema = new mongoose.Schema({
    Study: {type: mongoose.Schema.Types.ObjectId, ref: "study"},
    Site:  {type: mongoose.Schema.Types.ObjectId, ref: "site"},
    Subject: {type: mongoose.Schema.Types.ObjectId, ref: "subject"},
    Phase: {type: mongoose.Schema.Types.ObjectId, ref: "phase"},
    Visit_date: Date
},{ strict: false });

module.exports = mongoose.model("visit", visitSchema);