const mongoose   = require('mongoose');

let Schema = mongoose.Schema;
let schema = new Schema({
    report_id:          Number,     //auto generated
    month:              Number,
    date:               Date,
    equipt_name:        String,
    department:         String,
    location:           String,
    fault:              String,
    spares:             String,
    failure_date:       String,
    repair_date:        String,
    engineer_username:  String,
    cost:               String,
    total_cost:         String    
});

schema.pre('save', (next) =>{
    next();
});

module.exports = mongoose.model('reports', schema);