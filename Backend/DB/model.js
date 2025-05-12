const mongoose = require("mongoose");
const data = new mongoose.Schema({
  header: {
    type: String,
    default: "hello message",
  },
  content: {
    type: String,
    required: true,
  },
});

const messageModel = mongoose.model("message", data);

module.exports = messageModel;
