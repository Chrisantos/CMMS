const mongoose   = require('mongoose');

let Schema = mongoose.Schema;
let schema = new Schema({
    name:   String
});

schema.pre('save', (next) =>{
    next();
});

module.exports = mongoose.model('departments', schema);