var mongoose = require("mongoose");

var formStatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("form_status", formStatusSchema);
