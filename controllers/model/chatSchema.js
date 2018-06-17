const mongoose   = require('mongoose');

let Schema = mongoose.Schema;
let schema = new Schema({
    from:       String,
    to:         String,
    message:    String,
    chat_date:  Date
});

schema.pre('save', (next) =>{
    next();
});

module.exports = mongoose.model('chats', schema);