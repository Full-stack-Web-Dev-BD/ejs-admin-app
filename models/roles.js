var mongoose = require("mongoose");

var roleSchema = new mongoose.Schema({
    role:   String
});


module.exports = mongoose.model("roles", roleSchema);