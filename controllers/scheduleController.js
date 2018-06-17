const prevMaintModel    = require('./model/prevMaintSchema');
const scheduleModel     = require('./model/scheduleSchema');
const equiptModel       = require('./model/equiptSchema');
const engineerModel     = require('./model/engineerSchema');
const operatorModel     = require('./model/operatorSchema');
const notifModel        = require('./model/notificationSchema');
const departmentModel   = require('./model/departmentSchema');

module.exports = {

    preventiveMaint: (req, res) =>{
        prevMaintModel.find().sort({equipt: 1}).exec((err, prevents) =>{
            if(err) throw err;
            else if(prevents === []){
                res.render('schedule/prevMaint', {message: "No preventive maintenance record set yet!"});
            }else{
                res.render('schedule/prevMaint', {prevents: prevents});
            }
        });
    },
    schedule: (req, res) =>{
        scheduleModel.find().sort({date: 1}).exec((err, schedules) =>{
            if(err) throw err;
            else if(schedules === [])
                res.render('schedule/schedule', {message: "No schedule added yet!"});
            else
                res.render('schedule/schedule', {schedules: schedules});
        });
    },

    addPrevMaint: (req, res) =>{
        equiptModel.find().sort({name: 1}).exec((err, equipt) =>{
            if(err) throw err;
            else{
                res.render('schedule/newPrevMaint', {equipments: equipt});                
            }
        });
    },
    addSchedule: (req, res) =>{
        equiptModel.find().sort({name: 1}).exec((err, equipt) =>{
            if(err) throw err;
            else{
                res.render('schedule/newSchedule', {equipments: equipt});                
            }
        });
    },

    //Post request
    savePrevMaint: (req, res) =>{
        let date                = new Date();
        let maint_id            = date.getDay() + date.getSeconds(); // Should print it on a hidden input box
        let equipt              = req.body.equipt;
        let location            = req.body.location;
        let procedures          = req.body.procedures;

        let newPrevMaint        = new prevMaintModel({
            maint_id,
            equipt,
            location,
            procedures,
        });

        newPrevMaint.save((err) =>{
            if(err) throw err;
            else
                res.redirect('/maintenance/preventive-maintenance');
        });
    },
    
    saveSchedule: (req, res) =>{
        let equipt              = req.body.equipt;
        let model_no            = req.body.model_no;
        let frequency           = req.body.frequency;
        let date                = req.body.date;
        let maint_type          = req.body.maint_type;
        let maint_days          = req.body.maint_days;

        let datee                = new Date();
        let day                 = datee.getDay();
        let schedule_id         = day + datee.getSeconds();

        let newSchedule         = new scheduleModel({
            schedule_id,
            equipt,
            model_no,
            frequency, //drop down
            date,
            maint_type,
            maint_days,
        });

        newSchedule.save((err) =>{
            if(err) throw err;
            else{
                // prevMaintModel.findOne({equipt_id: equipt_id}, (err, maintenance) =>{
                //     if(err) throw err;
                //     else if(!maintenance){
                //         res.render('schedule/newSchedule', {error: 'No preventive maintenance record'});
                //     }
                //     else{
                        let location  = "";
                        let maint_id  = schedule_id;
                        let due_day   = date.substr(3,1);
                        let due_month = date.substr(0,2);
                        let newNotif  = new notifModel({
                            maint_id,
                            equipt,
                            location,
                            due_date: date,
                            due_day,
                            due_month
                        });

                        newNotif.save((err) =>{
                            if(err) throw err;
                            res.redirect('/maintenance/schedule');
                        });
                //     }
                // });
            }
                
        });
    },

    editPrevMaint: (req, res) =>{
        let maint_id        = req.params.maint_id;
        prevMaintModel.findOne({maint_id: maint_id}, (err, prevent) =>{
            if(err) throw err;
            else{
                equiptModel.find().sort({name: 1}).exec((err, equipt) =>{
                    if(err) throw err;
                    else{
                        res.render('schedule/editPrevMaint', {prevent, prevent, equipments: equipt});                
                    }
                });
            }
        });
    },
    editSchedule: (req, res) =>{
        let schedule_id        = req.params.schedule_id;
        scheduleModel.findOne({schedule_id: schedule_id}, (err, schedule) =>{
            if(err) throw err;
            else{
                equiptModel.find().sort({name: 1}).exec((err, equipt) =>{
                    if(err) throw err;
                    else{
                        res.render('schedule/editSchedule', {schedule, schedule, equipments: equipt});                
                    }
                });
            }
        });
    },

    updatePrevMaint: (req, res) =>{
        let maint_id            = req.body.maint_id;     // as  fetched from a hidden input box
        
        let equipt              = req.body.equipt;
        let location            = req.body.location;
        let procedures          = req.body.procedures;

        prevMaintModel.findOneAndUpdate({maint_id: maint_id},
        {
            maint_id,
            equipt,
            location,
            procedures,
        }, (err, prevents) =>{
            if(err) throw err;
            else
                res.redirect('/maintenance/preventive-maintenance');
        });
    },
    updateSchedule: (req, res) =>{
        let schedule_id         = req.body.schedule_id;   //as fetched from a hidden input box
        let equipt              = req.body.equipt;
        let model_no            = req.body.model_no;
        let frequency           = req.body.frequency;
        let date                = req.body.date;
        let maint_type          = req.body.maint_type;
        let maint_days          = req.body.maint_days;

        scheduleModel.findOneAndUpdate({schedule_id: schedule_id},
        {
            schedule_id,
            equipt,
            model_no,
            frequency, //drop down
            date,
            maint_type,
            maint_days,
        }, (err, schedule) =>{
            if(err) throw err;
            else{
                // prevMaintModel.findOne({equipt_id: equipt_id}, (err, maintenance) =>{
                //     if(err) throw err;
                //     else{
                        let location  = "";// maintenance.location;
                        let maint_id  = schedule_id;
                        let due_day   = date.substr(3,1);
                        let due_month = date.substr(0,2);
                        notifModel.findOneAndUpdate({maint_id: maint_id},
                        {
                            maint_id,
                            equipt,
                            location,
                            due_date: date,
                            due_day,
                            due_month
                        }, (err, notif) =>{
                            if(err) throw err;
                            res.redirect('/maintenance/schedule');
                        });
                //     }
                // });
            }
        });
    },

    deleteSchedule: (req, res) =>{
        let schedule_id    = req.params.schedule_id;
        scheduleModel.findOneAndRemove({schedule_id: schedule_id}, (err, schedule) =>{
            if(err) throw err;
            else{
                scheduleModel.find().sort({date: 1}).exec((err, schedules) =>{
                    if(err) throw err;
                    else{
                        res.render('schedule/schedule', {schedules: schedules, success: 'Schedule was deleted successfully!'});
                    }
                });
            }
        });
    },

    deleteScheduleAdmin: (req, res) =>{
        let schedule_id    = req.params.schedule_id;
        scheduleModel.findOneAndRemove({schedule_id: schedule_id}, (err, schedule) =>{
            if(err) throw err;
            else{
                scheduleModel.find().sort({date: 1}).exec((err, schedules) =>{
                    if(err) throw err;
                    else{
                        res.redirect('/admin');                    }
                });
            }
        });
    },

    aPrevMaint: (req, res) =>{
        let maint_id            = req.params.maint_id;     // as  fetched from a hidden input box
        prevMaintModel.findOne({maint_id: maint_id}, (err, maintenance) =>{
            if(err) throw err;
            res.render('schedule/aPrevMaint', {maintenance: maintenance});
        });
    },
    aSchedule: (req, res) =>{
        let schedule_id     = req.params.schedule_id;
        scheduleModel.findOne({schedule_id: schedule_id}, (err, schedule) =>{
            if(err) throw err;
            res.render('schedule/aschedule', {schedule: schedule});
        });
    },

    notif: (req, res) =>{
        let date       = new Date();
        let day        = date.getDay();
        let month      = date.getMonth();  

        notifs.find().sort({due_date: 1}).exec((err, notifications) =>{
            if(err) throw err;
            else{
                let notification = null;
                notifications.forEach((index, notif) =>{
                    if(month == notif.due_month){
                        if(day == notif.due_day){
                            notification[index] = notif;
                        }else if((day-1) == notif.due_day){
                            notification[index] = notif;
                        }else if((day-2) == notif.due_day){
                            notification[index] = notif;
                        }else{

                        }
                    }
                });

                // res.render();
            }
        })

    },

};