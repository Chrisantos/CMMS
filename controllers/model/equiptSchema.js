const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let schema = new Schema({
    name:               String,
    inv_id:             String,         //Auto-generated
    model:              String,
    serial_num:         Number,
    country_origin:     String,
    manuf_date:         String,
    order_num:          Number,
    manufacturer:       String,
    warr_exp_date:      String,
    cost:               String,
    received_date:      String,
    supplier_name:      String,
    supplier_phnum:     String,
    install_date:       String,
    power_req:          String,
    current_state:      String,
    spare_avail:        String,         //?
    manual_avail:       String,         //?
    operator_username:  String,
    department:         String,
    location:           String,
    notes:              String
});

schema.pre('save', (next) =>{
    next();
});

module.exports = mongoose.model('equipments', schema);
