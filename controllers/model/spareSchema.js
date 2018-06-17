const mongoose   = require('mongoose');

let Schema = mongoose.Schema;
let schema = new Schema({
    equipt:             String,
    equipt_loc:         String,
    spare_name:         String,
    quantity:           Number,
    description:        String,
    cost:               Number,
    sn:                 String,
    spare_loc:          String
});

schema.pre('save', (next) =>{
    next();
});

module.exports = mongoose.model('spares', schema);