const mongoose   = require('mongoose');

let Schema = mongoose.Schema;
let schema = new Schema({
    equipt:             String,
    department:         String,
    location:           String,
    fail_date:          String,
    statement:          String,
    operator_username:  String,
    time:               Date
});

schema.pre('save', (next) =>{
    next();
});

module.exports = mongoose.model('cmrequests', schema);