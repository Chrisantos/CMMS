const mongoose   = require('mongoose');

let Schema = mongoose.Schema;
let schema = new Schema({
    maint_id:           Number,
    equipt:             String,
    location:           String,
    due_date:           String,
    due_day:            Number,
    due_month:          Number,
    type:               String
});

schema.pre('save', (next) =>{
    next();
});

module.exports = mongoose.model('notifs', schema);