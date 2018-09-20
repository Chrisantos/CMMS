const mongoose   = require('mongoose');

let Schema = mongoose.Schema;
let schema = new Schema({
    maint_id:           Number,
    equipt:             String,
    procedures:         String,
});

schema.pre('save', (next) =>{
    next();
});

module.exports = mongoose.model('procedures', schema);