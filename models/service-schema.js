const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
  serviceValue: {
    type: String,
  },
  serviceLabel: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
  }],
  cityId:{
    type: mongoose.Types.ObjectId,
  }
  ,
  stateId :{
    type: mongoose.Types.ObjectId,
  },
  categoryId :{
    type: String,
  },
  serviceproviders:
  [{ type: mongoose.Types.ObjectId,  ref: 'ServiceProvider'}]
,

});

ServiceSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Service", ServiceSchema);
