const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;


const serviceProviderSchema = new Schema({
    name: { type: String, required: true },
    gmailId: { type: String },
    profession: { type: String, required: true },
    contactNumber: { type: Number , required: true},
    whatsAppNumber: { type: Number , required: true},
    facebookId:{ type:String },
    instagramId:{ type:String },
    serviceId :{ type: mongoose.Types.ObjectId },
    address:{ type:String },
    state:{ type:String },
    city:{ type:String },
    pincode:{ type:String },
    image:{type:String},
    categoryId: {type: String},

}, { versionKey: false });

serviceProviderSchema.plugin(uniqueValidator)


module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);