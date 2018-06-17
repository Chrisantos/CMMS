const mongoose   = require('mongoose');

let Schema = mongoose.Schema;
let schema = new Schema({
    name:       String,
    password:   String,
    specialty:  String,
    username:     String,                   //Auto-generated
    phone:      String
});

schema.pre('save', (next) =>{
    next();
});

module.exports = mongoose.model('engineers', schema);