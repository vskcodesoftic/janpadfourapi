const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const CitySchema = new Schema({
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
  services:
    [{ type: mongoose.Types.ObjectId,  ref: 'Service'}]
  ,
  stateId :{
    type: mongoose.Types.ObjectId,
  }

});

CitySchema.plugin(uniqueValidator);

module.exports = mongoose.model("City", CitySchema);
