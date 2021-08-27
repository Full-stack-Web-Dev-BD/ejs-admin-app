var mongoose = require("mongoose");

var userstatusSchema = new mongoose.Schema({
    status:   String
});


module.exports = mongoose.model("userstatus", userstatusSchema);