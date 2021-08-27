var mongoose = require("mongoose");

var logsSchema = new mongoose.Schema({
    logDate:  Date,
    logUser:  String,
    logAction:  String
},{ strict: false });

module.exports = mongoose.model("logs", logsSchema);