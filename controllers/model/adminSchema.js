const mongoose   = require('mongoose');

let Schema = mongoose.Schema;
let schema = new Schema({
    username:   String,
    password:   String
});

schema.pre('save', (next) =>{
    next();
});

module.exports = mongoose.model('admin', schema);