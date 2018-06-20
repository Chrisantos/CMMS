const mongoose   = require('mongoose');

let Schema = mongoose.Schema;
let schema = new Schema({
    logbook_id:         Number,     //auto generated
    equipt:             String,
    fault:              String,
    spares_req:         String,
    cost:               Number,
    failure_date:       String,
    repair_date:        String,
    repair_month:       Number,
    date_created:       String,
    engineer_username:  String,
    operator_username:  String,
    department:         String,
    equipt_loc:         String
});

schema.pre('save', (next) =>{
    next();
});

module.exports = mongoose.model('logbooks', schema);