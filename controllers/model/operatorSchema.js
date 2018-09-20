const mongoose   = require('mongoose');

let Schema = mongoose.Schema;
let schema = new Schema({
    name:           String,
    password:       String,
    department:     String,
    username:       String,
    phone:          String
});

schema.pre('save', (next) =>{
    next();
});

module.exports = mongoose.model('operators', schema);