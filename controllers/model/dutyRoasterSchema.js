const mongoose   = require('mongoose');

let Schema = mongoose.Schema;
let schema = new Schema({
    username:   String,
    department: String,
    day:        String,
    month:      String
});

schema.pre('save', (next) =>{
    next();
});

module.exports = mongoose.model('dutyroasters', schema);