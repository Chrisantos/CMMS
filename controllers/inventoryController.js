const cloudinary       = require('cloudinary');
const equiptModel      = require('./model/equiptSchema');
const spareModel       = require('./model/spareSchema');
const accessoryModel   = require('./model/accessorySchema');
const operatorModel    = require('./model/operatorSchema');
const departmentModel  = require('./model/departmentSchema');

cloudinary.config({
    cloud_name: 'cernetics',
    api_key: '276336719369831',
    api_secret: 'CoPW3VJsVSTg8w3z-qsLLs4UX_4'
});

module.exports = {

    newEquipt: (req, res) =>{
        operatorModel.find().sort({name: 1}).exec((err, operators) =>{
            if(err) throw err;
            else{
                departmentModel.find().sort({name: 1}).exec((err, departments) =>{
                    if(err) throw err;
                    res.render('inventory/newEquipt', {operators: operators, departments: departments});
                });
            }
        });
    },
    newSpare: (req, res) =>{
        equiptModel.find().sort({name: 1}).exec((err, equipt) =>{
            if(err) throw err;
            res.render('inventory/newSpare', {equipments: equipt});
        });
    },
    newAccessory: (req, res) =>{
        equiptModel.find().sort({name: 1}).exec((err, equipt) =>{
            if(err) throw err;
            res.render('inventory/newAccessory', {equipments: equipt});
        });
    },

    editEquipt: (req, res) =>{
        let inv_id = req.params.inv_id;
        equiptModel.findOne({inv_id: inv_id}, (err, equipt) =>{
            if(err) res.send(err);
            else{
                operatorModel.find().sort({name: 1}).exec((err, operators) =>{
                    if(err) throw err;
                    else{
                        departmentModel.find().sort({name: 1}).exec((err, departments) =>{
                            if(err) throw err;
                            res.render('inventory/editEquipt', {operators: operators, departments: departments, equipment: equipt,});
                        })
                    }
                });
            }
        });
    },
    editSpare: (req, res) =>{
        let sn = req.params.sn;
        spareModel.findOne({sn: sn}, (err, spare) =>{
            if(err) res.send(err);
            
            res.render("inventory/editSpare", {spare: spare});
        });
    },
    editAccessory: (req, res) =>{
        let sn = req.params.sn;
        accessoryModel.findOne({sn: sn}, (err, accessory) =>{
            if(err) res.send(err);
            
            res.render("inventory/editAccessory", {accessory: accessory});
        });
    },

    addEquipt: (req, res) =>{
        let name            = req.body.name;
        let model           = req.body.model;
        let serial_num      = req.body.serial_num;
        let country_origin  = req.body.country_origin;
        let manuf_date      = req.body.manuf_date;
        let order_num       = req.body.order_num;
        let manufacturer    = req.body.manufacturer;
        let warr_exp_date   = req.body.warr_exp_date;
        let cost            = req.body.cost;
        let received_date   = req.body.received_date;
        let supplier_name   = req.body.supplier_name;
        let supplier_phnum  = req.body.supplier_phnum;
        let install_date    = req.body.install_date;
        let power_req       = req.body.power_req;
        let current_state   = req.body.current_state;
        let spare_avail     = req.body.spare_avail;
        let manual_avail    = req.body.manual_avail;
        let operator_username   = req.body.operator_username;
        let department      = req.body.department;
        let location        = req.body.location;
        let notes           = req.body.notes;

        let date            = new Date();
        let inv_id          = date.getSeconds() + date.getDay(); // Should print it on a hidden input box


        // let wps = /^\s*$/;      //This should be done at the client-side
        // if(wps.test(name)||wps.test(type)||wps.test(model)||wps.test(serial_num)||wps.test(country_origin)||
        // wps.test(manuf_date)||wps.test(order_num)||wps.test(manufacturer)||wps.test(warr_exp_date)||
        // wps.test(cost)||wps.test(received_date)||wps.test(supplier_name)||wps.test(supplier_phnum)||
        // wps.test(install_date)||wps.test(power_req)||wps.test(current_state)||wps.test(spare_avail)||
        // wps.test(manual_avail)||wps.test(operator_type)||wps.test(operator_name)||wps.test(operator_phnum)||
        // wps.test(department)||wps.test(current_loc)||wps.test(notes)){
        //     alert('All fields must be filled');
        //     return false;
        // }
        let newEquipment = new equiptModel({
            name,
            inv_id: `equipt${inv_id}`, 
            model,
            serial_num,
            country_origin,
            manuf_date,
            order_num,
            manufacturer,
            warr_exp_date,
            cost,
            received_date,
            supplier_name,
            supplier_phnum,
            install_date,
            power_req,
            current_state,
            spare_avail,        
            manual_avail,     
            operator_username,
            department,
            location,
            notes
        });

        newEquipment.save((err) =>{
            if(err)
                res.render('inventory/newEquipt', {error: err});
            else
                // res.render('inventory/newEquipt', {success: `${name} added successfully`});
                res.redirect('/inventory/equipment');
        });

    },
    addSpare: (req, res) =>{
        let equipt_name        = req.body.equipt_name;
        let equipt_loc         = req.body.equipt_loc;
        let spare_name         = req.body.spare_name;
        let quantity           = req.body.quantity;
        let description        = req.body.description;
        let cost               = req.body.cost;
        let date               = new Date();
        let sn                 = date.getSeconds() + date.getDay();
        let spare_loc          = req.body.spare_loc;

        let newSpare = new spareModel({
            equipt_name,
            equipt_loc,
            spare_name,
            quantity,
            description,
            sn: `spare${sn}`,
            cost,
            spare_loc
        });

        newSpare.save((err) =>{
            if(err)
                res.render('inventory/newSpare', {error: err});
            else
                // res.render('inventory/newSpare', {success: `${spare_name} added successfully`});
                res.redirect('/inventory/spare');
        });
    },
    addAccessory: (req, res) =>{
        let equipt_name        = req.body.equipt_name;
        let equipt_loc         = req.body.equipt_loc;
        let accessory_name     = req.body.accessory_name;
        let accessory_loc      = req.body.accessory_loc;
        let quantity           = req.body.quantity;
        let description        = req.body.description;
        let manuf_date         = req.body.manuf_date;
        let expiry_date        = req.body.expiry_date;

        let date               = new Date();
        let sn                 = date.getSeconds() + date.getDay();

        let newAccessory = new accessoryModel({
            equipt_name,
            equipt_loc,
            accessory_name,
            accessory_loc,
            quantity,
            description,
            manuf_date,
            expiry_date,
            sn: `access${sn}`
        });

        newAccessory.save((err) =>{
            if(err)
                res.render('inventory/newAccessory', {error: err});
            else
                // res.render('inventory/newAccessory', {success: `${accessory_name} added successfully`});
                res.redirect('/inventory/accessory');
        });
    },

    allEquipts: (req, res) =>{
        equiptModel.find().sort({name: 1}).exec((err, equipts) => {
            if(err)
                res.render('inventory/equipments', {error: err});
            else
                res.render('inventory/equipments', {equipments: equipts});
        });
    },
    allSpares: (req, res) =>{
        spareModel.find().sort({name: 1}).exec((err, spares) => {
            if(err)
                res.render('inventory/spares', {error: err});
            else
                res.render('inventory/spares', {spares: spares});
        });
    },
    allAccessories: (req, res) =>{
        accessoryModel.find().sort({name: 1}).exec((err, accessories) => {
            if(err)
                res.render('inventory/accessories', {error: err});
            else
                res.render('inventory/accessories', {accessories: accessories});
        });
    },

    updateEquipt: (req, res) =>{
        let name            = req.body.name;
        let model           = req.body.model;
        let serial_num      = req.body.serial_num;
        let country_origin  = req.body.country_origin;
        let manuf_date      = req.body.manuf_date;
        let order_num       = req.body.order_num;
        let manufacturer    = req.body.manufacturer;
        let warr_exp_date   = req.body.warr_exp_date;
        let cost            = req.body.cost;
        let received_date   = req.body.received_date;
        let supplier_name   = req.body.supplier_name;
        let supplier_phnum  = req.body.supplier_phnum;
        let install_date    = req.body.install_date;
        let power_req       = req.body.power_req;
        let current_state   = req.body.current_state;
        let spare_avail     = req.body.spare_avail;
        let manual_avail    = req.body.manual_avail;
        let operator_username   = req.body.operator_username;
        let department      = req.body.department;
        let location        = req.body.location;
        let notes           = req.body.notes;

        let inv_id          = req.body.inv_id;     // as  fetched from a hidden input box

        equiptModel.findOneAndUpdate({inv_id: inv_id},
            {
                name,
                inv_id, 
                model,
                serial_num,
                country_origin,
                manuf_date,
                order_num,
                manufacturer,
                warr_exp_date,
                cost,
                received_date,
                supplier_name,
                supplier_phnum,
                install_date,
                power_req,
                current_state,
                spare_avail,        
                manual_avail,     
                operator_username,
                department,
                location,
                notes 
            }, (err, updatedEquipt) =>{
                if(err)
                    res.render('inventory/editEquipt', {error: err});
                else
                    res.redirect('/inventory/equipment');
            
            });
    },
    updateSpare: (req, res) =>{
        let equipt_name        = req.body.equipt_name;
        let equipt_loc         = req.body.equipt_loc;
        let spare_name         = req.body.spare_name;
        let quantity           = req.body.quantity;
        let description        = req.body.description;
        let cost               = req.body.cost;
        let spare_loc          = req.body.spare_loc;

        let sn                 = req.body.sn; // As fetched from a hidden input box

        spareModel.findOneAndUpdate({sn: sn},
        {
            equipt_name,
            equipt_loc,
            spare_name,
            quantity,
            description,
            sn,
            cost,
            spare_loc
        }, (err, updatedSpare) =>{
            if(err)
                res.render('inventory/editSpare', {error: err});
            else
                res.redirect('/inventory/spare');
        });
    },
    updateAccessory: (req, res) =>{
        let equipt_name        = req.body.equipt_name;
        let equipt_loc         = req.body.equipt_loc;
        let accessory_name     = req.body.accessory_name;
        let accessory_loc      = req.body.accessory_loc;
        let quantity           = req.body.quantity;
        let description        = req.body.description;
        let manuf_date         = req.body.manuf_date;
        let expiry_date        = req.body.expiry_date;

        let sn                 = req.body.sn; // as fetched from a hidden input box

        accessoryModel.findOneAndUpdate({accessory_name: accessory_name},
        {
            equipt_name,
            equipt_loc,
            accessory_name,
            accessory_loc,
            quantity,
            description,
            manuf_date,
            expiry_date,
            sn
        }, (err, updatedAccessory) =>{
            if(err)
                res.render('inventory/editAccessory', {error: err});
            else
                res.redirect('/inventory/accessory');
        });
    },

    removeEquipt: (req, res) =>{
        let inv_id  = req.params.inv_id;
        equiptModel.findOneAndRemove({inv_id: inv_id}, (err, equipt) =>{
            if(err)
                res.render('inventory/equipments', {error: err});
            else if(!equipt)
                res.render('inventory/equipments', {error: 'No such equipment exists'});
            else{
                equiptModel.find().sort({name: 1}).exec((errs, equipts) => {
                    if(errs)
                        res.render('inventory/equipments', {error: errs});
                    
                    res.redirect('/inventory/equipment');
                });
                
            }
        });
    },
    removeSpare: (req, res) =>{
        let sn  = req.params.sn;
        spareModel.findOneAndRemove({sn: sn}, (err, spare) =>{
            if(err)
                res.render('inventory/spares', {error: err});
            else if(!spare)
                res.render('inventory/spares', {error: 'No such spare exists'});
            else{
                spareModel.find().sort({spare_name: 1}).exec((errs, spares) => {
                    if(errs)
                        res.render('inventory/spares', {error: errs});
                    
                    res.redirect('/inventory/spare');
                });
                
            }
        });
    },
    removeAccessory: (req, res) =>{
        let sn  = req.params.sn;
        accessoryModel.findOneAndRemove({sn: sn}, (err, accessory) =>{
            if(err)
                res.render('inventory/accessories', {error: err});
            else if(!accessory)
                res.render('inventory/accessories', {error: 'No such spare exists'});
            else{
                accessoryModel.find().sort({accessory_name: 1}).exec((errs, accessories) => {
                    if(errs)
                        res.render('inventory/accessories', {error: errs});
                    
                    res.redirect('/inventory/accessory');
                });
                
            }
        });
    },
    
    anEquipt: (req, res) =>{
        let inv_id      = req.params.inv_id;
        equiptModel.findOne({inv_id: inv_id}, (err, equipt) =>{
            if(err) throw err;
            res.render('inventory/anEquipt', {equipment: equipt});
        });
    },
    aSpare: (req, res) =>{
        let sn        = req.params.sn;
        spareModel.findOne({sn: sn}, (err, spare) =>{
            if(err) throw err;
            res.render('inventory/aSpare', {spare: spare});
        });
    },
    anAccessory: (req, res) =>{
        let sn        = req.params.sn;
        accessoryModel.findOne({sn: sn}, (err, accessory) =>{
            if(err) throw err;
            res.render('inventory/anAccessory', {accessory: accessory});
        });
    },



};