const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const StatesSchema = new Schema({
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
  },
  cities: [{ type: mongoose.Types.ObjectId,  ref: 'City'}],
  listOfCities  : [
      { type : String }
  ]
});

StatesSchema.plugin(uniqueValidator);

module.exports = mongoose.model("States", StatesSchema);
