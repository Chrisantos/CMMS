const mongoose   = require('mongoose');

let Schema = mongoose.Schema;
let schema = new Schema({
    wo_id:              Number,
    equipt:             String,
    equipt_loc:         String,
    department:         String,
    spares:             String,
    accessories:        String,
    fault:              String,
    engineer_username:  String,
});

schema.pre('save', (next) =>{
    next();
});

module.exports = mongoose.model('workorders', schema);