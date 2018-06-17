const mongoose   = require('mongoose');

let Schema = mongoose.Schema;
let schema = new Schema({
    equipt:             String,
    equipt_loc:         String,
    accessory_name:     String,
    accessory_loc:      String,
    quantity:           Number,
    cost:               Number,
    description:        String,
    manuf_date:         String,
    expiry_date:        String,
    sn:                 String
});

schema.pre('save', (next) =>{
    next();
});

module.exports = mongoose.model('accessories', schema);