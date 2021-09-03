const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SliderSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  }

});


module.exports = mongoose.model("Slider", SliderSchema);
