const engineerModel     = require('./model/engineerSchema');
const adminModel        = require('./model/adminSchema');
const operatorModel    = require('./model/operatorSchema');
const equiptModel       = require('./model/equiptSchema');
const spareModel        = require('./model/spareSchema');
const accessoryModel    = require('./model/accessorySchema'); 
const logBookModel      = require('./model/logBookSchema');
const workOrderModel    = require('./model/workOrderSchema');
const reportModel       = require('./model/reportSchema');
const departmentModel   = require('./model/departmentSchema');
const chatModel         = require('./model/chatSchema');

module.exports = {
    department: (req, res) =>{
        departmentModel.find().sort({name: 1}).exec((err, departments) =>{
            if(err) throw err;
            
            res.render('others/departments', {departments: departments});
        });
    },
    newDepartment: (req, res) =>{
        res.render('others/newDepartment');
    },

    addDepartment: (req, res) =>{
        let name            = req.body.name;
        let newDepartment   = new departmentModel({
            name
        }).save((err) =>{
            if(err) throw err;
            res.redirect('/departments');
        });
    },

    dutyRoaster: (req, res) =>{

    },
    editWorkOrder: (req, res) =>{
        res.render('other/editWorkOrder');
    },
    
    updateWorkOrder: (req, res) =>{
        let equipt_id       = req.body.equipt_id;
        let equipt_name     = req.body.equipt_name;
        let equipt_loc      = req.body.equipt_loc;
        let department      = req.body.department;
        let spares          = req.body.spares;
        let accessories     = req.body.accessories;
        let fault           = req.body.fault;
        let engineer_username     = req.body.engineer_username;
        let engineer_name   = req.body.engineer_name;

        let wo_id           = req.body.wo_id; //As fetched from a hidden input box

        workOrderModel.findOneAndUpdate({wo_id: wo_id},
        {
            wo_id,
            equipt_id,
            equipt_loc,
            equipt_name,
            spares,
            department,
            accessories,
            fault,
            engineer_username,
            engineer_name
        }, (err, wo) =>{
            if(err) throw err;
            else{
                res.render('other/editWorkOrder', {success: 'Work order updated successfully!'});
            }
        });
    },

}