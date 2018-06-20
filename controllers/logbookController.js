const logBookModel      = require('./model/logBookSchema');
const reportModel       = require('./model/reportSchema');
const departmentModel   = require('./model/departmentSchema');
const engineerModel     = require('./model/engineerSchema');
const operatorModel     = require('./model/operatorSchema');
const equipmentModel    = require('./model/equiptSchema');

module.exports = {
    newLog: (req, res) =>{
        departmentModel.find().sort({name: 1}).exec((err, departments) =>{
            if(err) throw err;
            else{
                equipmentModel.find().sort({name: 1}).exec((err, equipments) =>{
                    if(err) throw err;
                    else{
                        engineerModel.find().sort({username: 1}).exec((err, engineers) =>{
                            if(err) throw err;
                            else{
                                operatorModel.find().sort({username: 1}).exec((err, operators) =>{
                                    if(err) throw err;
                                    else{
                                        res.render('lbnR/newLogbook',
                                        {
                                            departments,
                                            equipments,
                                            engineers,
                                            operators
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    logbook: (req, res) =>{
        logBookModel.find().sort({date_created: 1}).exec((err, logs) =>{
            if(err) throw err;
            else
                res.render('lbnR/logbook', {logs: logs});
        });
    },
    // removeReport: (req, res) =>{
    //     let report_id = req.body.report_id;
    //     reportModel.findOneAndRemove({report_id: report_id}, (err, report) =>{
    //         if(err) res.send(err);
    //         else{
    //             reportModel.find().sort({month: 1}).exec((err, reports) =>{
    //                 if(err) res.send(err);
    //                 else
    //                     res.render('viewReports', {reports: reports, success: `Report successfully deleted!`});
    //             });
    //         }
    //     });
    // },
    
    //clear all - unimplemented

    registerLog: (req, res) =>{
        let date                = new Date();
        let month               = date.getMonth();
        let day                 = date.getDay();
        let year                = date.getFullYear();

        let logbook_id          = month + day + year;    //auto generated
        let equipt              = req.body.equipt;
        let fault               = req.body.fault;
        let spares_req          = req.body.spares_req;
        let accessories_req     = req.body.accessories_req;
        let cost                = req.body.cost;
        let failure_date        = req.body.failure_date;
        let repair_date         = req.body.repair_date;
        let repair_month        = req.body.repair_month;
        let date_created        = `${year}-${month}-${day}`;
        let engineer_username   = req.body.engineer_username;
        let operator_username   = req.body.operator_username;
        let department          = req.body.department;
        let equipt_loc          = req.body.equipt_loc;

        let newLog          = new logBookModel({
            logbook_id,
            equipt,
            fault,
            spares_req,
            cost,
            failure_date,
            repair_date,
            repair_month,
            date_created,
            engineer_username,
            operator_username,
            department,
            equipt_loc
        });
        newLog.save((err) =>{
            if(err) throw err;
            else
                res.redirect('/logbook');
        });
    },
    removeLog: (req, res) =>{
        let logbook_id      = req.params.logbook_id;
        logBookModel.findOneAndRemove({logbook_id: logbook_id}, (err, log) =>{
            if(err) throw err;
            else{
                logBookModel.find().sort({date_created: 1}).exec((err, logs) =>{
                    if(err) throw err;
                    else
                        res.render('lbnR/logbook', {logs: logs, success: 'Log deleted successfully!'});
                });
            }
        });
    },
    editLog: (req, res) =>{
        let logbook_id      = req.params.logbook_id;
        logBookModel.findOne({logbook_id: logbook_id}, (err, log) =>{
            if(err) throw err;
            departmentModel.find().sort({name: 1}).exec((err, departments) =>{
                if(err) throw err;
                else{
                    equipmentModel.find().sort({name: 1}).exec((err, equipments) =>{
                        if(err) throw err;
                        else{
                            engineerModel.find().sort({username: 1}).exec((err, engineers) =>{
                                if(err) throw err;
                                else{
                                    operatorModel.find().sort({username: 1}).exec((err, operators) =>{
                                        if(err) throw err;
                                        else{
                                            res.render('lbnR/editLogbook',
                                            {
                                                departments,
                                                equipments,
                                                engineers,
                                                operators,
                                                log
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    },
    updateLog: (req, res) =>{
        let logbook_id      = req.body.logbook_id;    //As fetched from a hidden input box

        let date                = new Date();
        let month               = date.getMonth();
        let day                 = date.getDay();
        let year                = date.getFullYear();
        
        let equipt          = req.body.equipt;
        let fault           = req.body.fault;
        let spares_req      = req.body.spares_req;
        let cost            = req.body.cost;
        let failure_date    = req.body.failure_date;
        let repair_date     = req.body.repair_date;
        let repair_month    = req.body.repair_month;
        let date_created    = `${year}-${month}-${day}`;
        let engineer_username   = req.body.engineer_username;
        let operator_username   = req.body.operator_username;
        let department      = req.body.department;
        let equipt_loc      = req.body.equipt_loc;

        logBookModel.findOneAndUpdate({logbook_id: logbook_id},
        {
            logbook_id,
            equipt,
            fault,
            spares_req,
            cost,
            failure_date,
            repair_date,
            repair_month,
            date_created,
            engineer_username,
            operator_username,
            department,
            equipt_loc
        }, (err, updatedLog) =>{
            if(err) throw err;
            else{
                res.redirect('/');
            }
        })
    },

    getReport: (req, res) =>{
        let selectedMonth   = req.query.month;    //Report should be displayed based on the month chosen
        let date            = new Date();
        let currentMonth    = date.getMonth() + 1;
        let month           = 0;
        let months  = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September','October', 'November', 'December'];
        let days    = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

        let date_generated  = `${days[date.getDay()]}, ${months[currentMonth - 1]} ${date.getDate()} ${date.getFullYear()}`;

        if(selectedMonth){
            month = selectedMonth;
        }else{
            month = currentMonth;
        }

        logBookModel.find({repair_month: month}, (err, logs) =>{
            if(err) throw err;
            else{
                let reportInfo = [];
                let sum = 0;
                logs.forEach((log, index) =>{   //reportInfo should be an array that contains logs of different equipts previously created
                    reportInfo[index] = log;
                    sum = sum + log.cost;    
                });
                
                res.render('lbnR/report', 
                    { 
                        report_id: month,
                        repair_month: months[month - 1],
                        date: date_generated,
                        total_cost: sum,
                        reportInfo: reportInfo
        
                    });
            }
            
        })
    },
}