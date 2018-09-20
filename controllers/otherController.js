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
const dutyRoasterModel  = require('./model/dutyRoasterSchema');

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

    workOrder: (req, res) =>{
        workOrderModel.find().sort({equipt_name: 1}).exec((err, wos) =>{
            if(err) throw err;
            else{
                res.render('others/workOrders', {workOrders: wos});
            }
        })
    },

    editWorkOrder: (req, res) =>{
        let id = req.params.id;
        workOrderModel.findById(id).exec((err, wo) =>{
            if(err) throw err;
            else{
                equiptModel.find().sort({name: 1}).exec((err, equipments) =>{
                    if(err) throw err;
                    else{
                        departmentModel.find().sort({name: 1}).exec((err, departments) =>{
                            if(err) throw err;
                            else{
                                engineerModel.find().sort({name: 1}).exec((err, engineers) =>{
                                    if(err) throw err;
                                    else{
                                        res.render('others/editWorkOrder',
                                        {
                                            equipments,
                                            departments,
                                            engineers,
                                            workorder: wo
                                        });
                                    }
                                })
                            }
                        })
                    }
                })
            }
        });
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
                res.redirect('/work-order');
            }
        });
    },

    deleteWorkOrder: (req, res) =>{
        let id = req.params.id;
        workOrderModel.findByIdAndRemove(id).exec((err, wo) =>{
            if(err) throw err;
            else if(!wo)
                res.render('others/workOrders', {error: 'No such work order exists'});
            else{
                res.redirect('/work-order');
                
            }
        })
    },

    shuffle: (array)=> {
        let counter = array.length;
    
        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            let index = Math.floor(Math.random() * counter);
    
            // Decrease counter by 1
            counter--;
    
            // And swap the last element with it
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
    
        return array;
    },

    dutyRoaster: (req, res) =>{
        let date  = new Date();
        let currentDay   = date.getDate();
        let currentMonth = date.getMonth() + 1;

        let departments = [];
        let usernames   = [];
        let newDay      = [];
        let newMonth    = [];

        let newRoaster = null;

        let day;
        let month;
        let incrementedDay;

        dutyRoasterModel.find().exec((err, roaster) =>{
            if(err) throw err;
            else{
                // day = roaster[0].day;
                // month = roaster[0].month;
                console.log(roaster);
                day = 18;
                month = 8;
                incrementedDay = day + 14;

                switch(month){
                    case '1': 
                        if(incrementedDay > 31){
                            incrementedDay = incrementedDay - 31;
                            month++;
                        }
                        break;
                    case '2': 
                        if(incrementedDay > 28){
                            incrementedDay = incrementedDay - 28;
                            month++;
                        }
                        break;
                    case '3': 
                        if(incrementedDay > 31){
                            incrementedDay = incrementedDay - 31;
                            month++;
                        }
                        break;
                    case '4': 
                        if(incrementedDay > 30){
                            incrementedDay = incrementedDay - 30;
                            month++;
                        }
                        break;
                    case '5': 
                        if(incrementedDay > 31){
                            incrementedDay = incrementedDay - 31;
                            month++;
                        }
                        break;
                    case '6': 
                        if(incrementedDay > 30){
                            incrementedDay = incrementedDay - 30;
                            month++;
                        }
                        break;
                    case '7': 
                        if(incrementedDay > 31){
                            incrementedDay = incrementedDay - 31;
                            month++;
                        }
                        break;
                    case '8': 
                        if(incrementedDay > 31){
                            incrementedDay = incrementedDay - 31;
                            month++;
                        }
                        break;
                    case '9': 
                        if(incrementedDay > 30){
                            incrementedDay = incrementedDay - 30;
                            month++;
                        }
                        break;
                    case '10': 
                        if(incrementedDay > 31){
                            incrementedDay = incrementedDay - 31;
                            month++;
                        }
                        break;
                    case '11': 
                        if(incrementedDay > 30){
                            incrementedDay = incrementedDay - 30;
                            month++;
                        }
                        break;
                    case '12': 
                        if(incrementedDay > 31){
                            incrementedDay = incrementedDay - 31;
                            month++;
                        }
                        break;
                }

                roaster.forEach((entry, index) =>{
                    departments[index] = entry.department;
                    usernames[index]   = entry.usernames;
                    newDay[index]      = currentDay;
                    newMonth[index]    = currentMonth;
                })

                if(incrementedDay == currentDay){
                    departments = shuffle(departments);
                    usernames = shuffle(usernames);

                    for(let i = 0; i < departments.length; i++){
                        newRoaster = new dutyRoasterModel({
                            username: usernames[i],
                            department: departments[i],
                            day: newDay[i],
                            month: newMonth
                        }).save((err) =>{
                            if(err) throw err;
                            else{
                                
                            }

                        })
                    }
                    dutyRoasterModel.find().sort({username: 1}).exec((err, newEntry) =>{
                        if(err) throw err;

                        res.render('others/dutyRoaster', {roaster: newEntry});
                    });
                }
                else{
                    dutyRoasterModel.find().sort({username: 1}).exec((err, newEntry) =>{
                        if(err) throw err;

                        res.render('others/dutyRoaster', {roaster});
                    });
                }

            }
        })
    },

    newDutyRoaster: (req, res) =>{
        engineerModel.find().exec((err, engineers) =>{
            if(err) throw err;
            else{
                departmentModel.find().exec((errr, departments) =>{
                    if(err) throw err;
                    else{
                        res.render('others/addDutyRoaster', {engineers, departments});
                    }
                })
            }
        })
        
    },

    addDutyRoaster: (req, res) =>{
        let username    = req.body.username;
        let department  = req.body.department;
        let date  = new Date();
        let day   = date.getDate();
        let month = date.getMonth() + 1;

        dutyRoasterModel.findOne({username}).exec((err, engineeer) =>{
            if(err) throw err;
            else if(!engineeer){
                const dutyRoaster = new dutyRoasterModel({
                    username,
                    department,
                    day,
                    month

                }).save((err) =>{
                    if(err) throw err;
                    res.redirect('/duty-roaster');
                });
            }
            else{
                res.render('others/addDutyRoaster', {error: "Engineer already exists!"});
            }
        });
    }

}