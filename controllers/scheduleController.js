const preventiveModel   = require('./model/preventiveSchema');
const correctiveModel   = require('./model/correctiveSchema');
const procedureModel    = require('./model/procedureSchema');
const equiptModel       = require('./model/equiptSchema');
const engineerModel     = require('./model/engineerSchema');
const operatorModel     = require('./model/operatorSchema');
const notifModel        = require('./model/notificationSchema');
const departmentModel   = require('./model/departmentSchema');
const dutyRoasterModel  = require('./model/dutyRoasterSchema');

module.exports = {

    procedure: (req, res) =>{
        procedureModel.find().sort({equipt: 1}).exec((err, procedures) =>{
            if(err) throw err;
            else if(procedures === []){
                res.render('schedule/procedure', {message: "No preventive maintenance record set yet!"});
            }else{
                res.render('schedule/procedure', {procedures});
            }
        });
    },
    corrective: (req, res) =>{
        correctiveModel.find().sort({date: 1}).exec((err, correctives) =>{
            if(err) throw err;
            else if(correctives === [])
                res.render('schedule/corrective', {message: "No corrective maintenance schedule added yet!"});
            else
                res.render('schedule/corrective', {correctives});
        });
    },
    preventive: (req, res) =>{
        preventiveModel.find().sort({date: 1}).exec((err, preventives) =>{
            if(err) throw err;
            else if(preventives === [])
                res.render('schedule/preventive', {message: "No preventive maintenance schedule added yet!"});
            else
                res.render('schedule/preventive', {preventives});
        });
    },

    addProcedure: (req, res) =>{
        equiptModel.find().sort({name: 1}).exec((err, equipt) =>{
            if(err) throw err;
            else{
                res.render('schedule/newProcedure', {equipments: equipt});                
            }
        });
    },
    addCorrective: (req, res) =>{
        equiptModel.find().sort({name: 1}).exec((err, equipt) =>{
            if(err) throw err;
            else{
                res.render('schedule/newCorrective', {equipments: equipt});                
            }
        });
    },
    addPreventive: (req, res) =>{
        equiptModel.find().sort({name: 1}).exec((err, equipt) =>{
            if(err) throw err;
            else{
                res.render('schedule/newPreventive', {equipments: equipt});                
            }
        });
    },

    //Post request
    saveProcedure: (req, res) =>{
        let date                = new Date();
        let maint_id            = date.getDay() + date.getSeconds(); // Should print it on a hidden input box
        let equipt              = req.body.equipt;
        let procedures          = req.body.procedures;

        let newProcedure        = new procedureModel({
            maint_id,
            equipt,
            procedures,
        });

        newProcedure.save((err) =>{
            if(err) throw err;
            else
                res.redirect('/maintenance/procedures');
        });
    },

    saveCorrective: (req, res) =>{
        let equipt              = req.body.equipt;
        let model_no            = req.body.model_no;
        let frequency           = req.body.frequency;
        let date                = req.body.date;
        let maint_type          = req.body.maint_type;
        let maint_days          = req.body.maint_days;

        let datee                = new Date();
        let day                 = datee.getDay();
        let schedule_id         = day + datee.getSeconds();

        let newCorrective         = new correctiveModel({
            schedule_id,
            equipt,
            model_no,
            frequency, //drop down
            date,
            maint_type,
            maint_days,
        });

        newCorrective.save((err) =>{
            if(err) throw err;
            else{
                correctiveModel.findOne({equipt: equipt}, (err, maintenance) =>{
                    if(err) throw err;
                    else if(!maintenance){
                        res.render('schedule/newCorrective', {error: 'No corrective maintenance record'});
                    }
                    else{
                        let location  = maintenance.location;
                        let maint_id  = schedule_id;
                        let due_day   = date.substr(8,2);
                        let due_month = date.substr(5,2);
                        let newNotif  = new notifModel({
                            maint_id,
                            equipt,
                            location,
                            due_date: date,
                            due_day,
                            due_month,
                            type: "corrective"
                        });

                        console.log(newNotif);

                        newNotif.save((err) =>{
                            if(err) throw err;
                            res.redirect('/maintenance/corrective-maintenance');
                        });
                    }
                });
            }
                
        });
    },
    
    savePreventive: (req, res) =>{
        let equipt              = req.body.equipt;
        let model_no            = req.body.model_no;
        let frequency           = req.body.frequency;
        let date                = req.body.date;
        let maint_type          = req.body.maint_type;
        let maint_days          = req.body.maint_days;

        let datee                = new Date();
        let day                 = datee.getDay();
        let schedule_id         = day + datee.getSeconds();

        let newPreventive         = new preventiveModel({
            schedule_id,
            equipt,
            model_no,
            frequency, //drop down
            date,
            maint_type,
            maint_days,
        });

        newPreventive.save((err) =>{
            if(err) throw err;
            else{
                preventiveModel.findOne({equipt: equipt}, (err, maintenance) =>{
                    if(err) throw err;
                    else if(!maintenance){
                        res.render('schedule/newPreventive', {error: 'No preventive maintenance record'});
                    }
                    else{
                        let location  = maintenance.location;
                        let maint_id  = schedule_id;
                        let due_day   = date.substr(8,2);
                        let due_month = date.substr(5,2);
                        let newNotif  = new notifModel({
                            maint_id,
                            equipt,
                            location,
                            due_date: date,
                            due_day,
                            due_month,
                            type: "preventive"
                        });

                        console.log(newNotif);

                        newNotif.save((err) =>{
                            if(err) throw err;
                            res.redirect('/maintenance/preventive-maintenance');
                        });
                    }
                });
            }
                
        });
    },

    editProcedure: (req, res) =>{
        let maint_id        = req.params.maint_id;
        procedureModel.findOne({maint_id: maint_id}, (err, procedure) =>{
            if(err) throw err;
            else{
                equiptModel.find().sort({name: 1}).exec((err, equipt) =>{
                    if(err) throw err;
                    else{
                        res.render('schedule/editProcedure', {procedure, equipments: equipt});                
                    }
                });
            }
        });
    },
    editCorrective: (req, res) =>{
        let schedule_id        = req.params.schedule_id;
        correctiveModel.findOne({schedule_id: schedule_id}, (err, corrective) =>{
            if(err) throw err;
            else{
                equiptModel.find().sort({name: 1}).exec((err, equipt) =>{
                    if(err) throw err;
                    else{
                        res.render('schedule/editCorrective', {corrective, equipments: equipt});                
                    }
                });
            }
        });
    },

    editPreventive: (req, res) =>{
        let schedule_id        = req.params.schedule_id;
        preventiveModel.findOne({schedule_id: schedule_id}, (err, preventive) =>{
            if(err) throw err;
            else{
                equiptModel.find().sort({name: 1}).exec((err, equipt) =>{
                    if(err) throw err;
                    else{
                        res.render('schedule/editPreventive', {preventive, equipments: equipt});                
                    }
                });
            }
        });
    },

    updateProcedure: (req, res) =>{
        let maint_id            = req.body.maint_id;     // as  fetched from a hidden input box
        
        let equipt              = req.body.equipt;
        let procedures          = req.body.procedures;

        procedureModel.findOneAndUpdate({maint_id: maint_id},
        {
            maint_id,
            equipt,
            procedures,
        }, (err, prevents) =>{
            if(err) throw err;
            else
                res.redirect('/maintenance/procedures');
        });
    },
    updateCorrective: (req, res) =>{
        let schedule_id         = req.body.schedule_id;   //as fetched from a hidden input box
        let equipt              = req.body.equipt;
        let model_no            = req.body.model_no;
        let frequency           = req.body.frequency;
        let date                = req.body.date;
        let maint_type          = req.body.maint_type;
        let maint_days          = req.body.maint_days;

        correctiveModel.findOneAndUpdate({schedule_id: schedule_id},
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
                            due_month,
                            type: "corrective"

                        }, (err, notif) =>{
                            if(err) throw err;
                            res.redirect('/maintenance/corrective-maintenance');
                        });
                //     }
                // });
            }
        });
    },
    updatePreventive: (req, res) =>{
        let schedule_id         = req.body.schedule_id;   //as fetched from a hidden input box
        let equipt              = req.body.equipt;
        let model_no            = req.body.model_no;
        let frequency           = req.body.frequency;
        let date                = req.body.date;
        let maint_type          = req.body.maint_type;
        let maint_days          = req.body.maint_days;

        preventiveModel.findOneAndUpdate({schedule_id: schedule_id},
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
                            due_month,
                            type: "preventive"
                        }, (err, notif) =>{
                            if(err) throw err;
                            res.redirect('/maintenance/preventive-maintenance');
                        });
                //     }
                // });
            }
        });
    },

    deleteCorrective: (req, res) =>{
        let schedule_id    = req.params.schedule_id;
        correctiveModel.findOneAndRemove({schedule_id: schedule_id}, (err, corrective) =>{
            if(err) throw err;
            else{
                correctiveModel.find().sort({date: 1}).exec((err, correctives) =>{
                    if(err) throw err;
                    else{
                        res.render('schedule/corrective', {correctives, success: 'Schedule was deleted successfully!'});
                    }
                });
            }
        });
    },

    deletePreventive: (req, res) =>{
        let schedule_id    = req.params.schedule_id;
        preventiveModel.findOneAndRemove({schedule_id: schedule_id}, (err, preventive) =>{
            if(err) throw err;
            else{
                preventiveModel.find().sort({date: 1}).exec((err, preventives) =>{
                    if(err) throw err;
                    else{
                        res.render('schedule/preventive', {preventives, success: 'Schedule was deleted successfully!'});
                    }
                });
            }
        });
    },

    deleteCorrectiveAdmin: (req, res) =>{
        let schedule_id    = req.params.schedule_id;
        correctiveModel.findOneAndRemove({schedule_id: schedule_id}, (err, corrective) =>{
            if(err) throw err;
            else{
                correctiveModel.find().sort({date: 1}).exec((err, correctives) =>{
                    if(err) throw err;
                    else{
                        res.redirect('/admin');                    }
                });
            }
        });
    },

    aProcedure: (req, res) =>{
        let maint_id            = req.params.maint_id;     // as  fetched from a hidden input box
        procedureModel.findOne({maint_id: maint_id}, (err, procedure) =>{
            if(err) throw err;
            res.render('schedule/aProcedure', {procedure});
        });
    },

    // aCorrective: (req, res) =>{
    //     let schedule_id     = req.params.schedule_id;
    //     correctiveModel.findOne({schedule_id: schedule_id}, (err, corrective) =>{
    //         if(err) throw err;
    //         res.render('schedule/aCorrective', {corrective: corrective});
    //     });
    // },
    // aPreventive: (req, res) =>{
    //     let schedule_id     = req.params.schedule_id;
    //     preventiveModel.findOne({schedule_id: schedule_id}, (err, preventive) =>{
    //         if(err) throw err;
    //         res.render('schedule/aPreventive', {preventive});
    //     });
    // },

    procedures: (req, res) =>{
        let username  = req.engineersession.user.username;

        let date       = new Date();
        let day        = date.getDate();
        let month      = date.getMonth() + 1;  
        let num        = 0;
        let notifs     = [];
        let tomorrow   = null;
        let today      = null;
        let yesterday  = null;
        notifModel.find({due_month: month}, (err, notifications) =>{
            if(err) throw err;
            else{
                notifications.forEach((notification, index) =>{
                    if((notification.due_day == (day-1)) || (notification.due_day == day) || (notification.due_day == (day + 1)) || (notification.due_day == (day + 2))){
                        
                        if(notification.due_day == (day)){
                            notification.today = "Today";
                            notification.tomorrow = "";
                            notification.yesterday = "";
                            notifs[index] = notification;
                            num += 1;
                        }else if(notification.due_day == (day + 1)){
                            notification.tomorrow = "Tomorrow";
                            notification.today = "";
                            notification.yesterday = "";
                            notifs[index] = notification;
                            num += 1;
                        }else if(notification.due_day == (day - 1)){
                            notification.tomorrow = "";
                            notification.today = "";
                            notification.yesterday = "Yesterday";
                            notifs[index] = notification;
                            num += 1;
                        }else{
                            notification.tomorrow = "";
                            notification.today = "";
                            notification.yesterday = "";
                            notifs[index] = notification;
                            num += 1;
                        }
                    }
                });
                procedureModel.find().sort({equipt: 1}).exec((err, procedures) =>{
                    if(err) throw err;
                    else{
                        res.render('schedule/engineer_procedures', 
                        {
                            username,
                            notifications: notifs, 
                            num,
                            procedures
                        });
                    }
                });

            } 
        });  
                                                                        
    },

    dutyRoaster: (req, res) =>{
        let username  = req.engineersession.user.username;

        let date       = new Date();
        let day        = date.getDate();
        let month      = date.getMonth() + 1;  
        let num        = 0;
        let notifs     = [];
        let tomorrow   = null;
        let today      = null;
        let yesterday  = null;
        notifModel.find({due_month: month}, (err, notifications) =>{
            if(err) throw err;
            else{
                console.log(notifications);
                notifications.forEach((notification, index) =>{
                    if((notification.due_day == (day-1)) || (notification.due_day == day) || (notification.due_day == (day + 1)) || (notification.due_day == (day + 2))){
                        
                        if(notification.due_day == (day)){
                            notification.today = "Today";
                            notification.tomorrow = "";
                            notification.yesterday = "";
                            notifs[index] = notification;
                            num += 1;
                        }else if(notification.due_day == (day + 1)){
                            notification.tomorrow = "Tomorrow";
                            notification.today = "";
                            notification.yesterday = "";
                            notifs[index] = notification;
                            num += 1;
                        }else if(notification.due_day == (day - 1)){
                            notification.tomorrow = "";
                            notification.today = "";
                            notification.yesterday = "Yesterday";
                            notifs[index] = notification;
                            num += 1;
                        }else{
                            notification.tomorrow = "";
                            notification.today = "";
                            notification.yesterday = "";
                            notifs[index] = notification;
                            num += 1;
                        }
                    }
                });
                dutyRoasterModel.find().sort({username: 1}).exec((err, roaster) =>{
                    if(err) throw err;
                    else{
                        res.render('hr/engineer_dutyroaster',{
                            username,
                            notifications: notifs, 
                            num,
                            roaster
                        });
                    }
                });

            } 
        });  
                                                                        
    },

    engPreventive: (req, res) =>{
        let username  = req.engineersession.user.username;

        let date       = new Date();
        let day        = date.getDate();
        let month      = date.getMonth() + 1;  
        let num        = 0;
        let notifs     = [];
        let tomorrow   = null;
        let today      = null;
        let yesterday  = null;
        notifModel.find({due_month: month}, (err, notifications) =>{
            if(err) throw err;
            else{
                notifications.forEach((notification, index) =>{
                    if((notification.due_day == (day-1)) || (notification.due_day == day) || (notification.due_day == (day + 1)) || (notification.due_day == (day + 2))){
                        
                        if(notification.due_day == (day)){
                            notification.today = "Today";
                            notification.tomorrow = "";
                            notification.yesterday = "";
                            notifs[index] = notification;
                            num += 1;
                        }else if(notification.due_day == (day + 1)){
                            notification.tomorrow = "Tomorrow";
                            notification.today = "";
                            notification.yesterday = "";
                            notifs[index] = notification;
                            num += 1;
                        }else if(notification.due_day == (day - 1)){
                            notification.tomorrow = "";
                            notification.today = "";
                            notification.yesterday = "Yesterday";
                            notifs[index] = notification;
                            num += 1;
                        }else{
                            notification.tomorrow = "";
                            notification.today = "";
                            notification.yesterday = "";
                            notifs[index] = notification;
                            num += 1;
                        }
                    }
                });
                preventiveModel.find().exec((err, preventives) =>{
                    if(err) throw err;
                    else{
                        res.render('schedule/engineer_preventive',{
                            username,
                            notifications: notifs, 
                            num,
                            preventives
                        });
                    }
                });

            } 
        });  
                                                                        
    },

    engCorrective: (req, res) =>{
        let username  = req.engineersession.user.username;

        let date       = new Date();
        let day        = date.getDate();
        let month      = date.getMonth() + 1;  
        let num        = 0;
        let notifs     = [];
        let tomorrow   = null;
        let today      = null;
        let yesterday  = null;
        notifModel.find({due_month: month}, (err, notifications) =>{
            if(err) throw err;
            else{
                notifications.forEach((notification, index) =>{
                    if((notification.due_day == (day-1)) || (notification.due_day == day) || (notification.due_day == (day + 1)) || (notification.due_day == (day + 2))){
                        
                        if(notification.due_day == (day)){
                            notification.today = "Today";
                            notification.tomorrow = "";
                            notification.yesterday = "";
                            notifs[index] = notification;
                            num += 1;
                        }else if(notification.due_day == (day + 1)){
                            notification.tomorrow = "Tomorrow";
                            notification.today = "";
                            notification.yesterday = "";
                            notifs[index] = notification;
                            num += 1;
                        }else if(notification.due_day == (day - 1)){
                            notification.tomorrow = "";
                            notification.today = "";
                            notification.yesterday = "Yesterday";
                            notifs[index] = notification;
                            num += 1;
                        }else{
                            notification.tomorrow = "";
                            notification.today = "";
                            notification.yesterday = "";
                            notifs[index] = notification;
                            num += 1;
                        }
                    }
                });
                correctiveModel.find().exec((err, correctives) =>{
                    if(err) throw err;
                    else{
                        res.render('schedule/engineer_corrective',{
                            username,
                            notifications: notifs, 
                            num,
                            correctives
                        });
                    }
                });

            } 
        });  
                                                                        
    },


};