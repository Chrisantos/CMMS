const mongoose   = require('mongoose');

let Schema = mongoose.Schema;
let schema = new Schema({
    schedule_id:        Number,
    equipt:             String,
    model_no:           String,
    frequency:          String, //drop down
    date:               String,
    maint_type:         String,
    maint_days:         String,
});

schema.pre('save', (next) =>{
    next();
});

module.exports = mongoose.model('schedules', schema);