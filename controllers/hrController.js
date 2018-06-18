const engineerModel     = require('./model/engineerSchema');
const adminModel        = require('./model/adminSchema');
const operatoreModel    = require('./model/operatorSchema');
const notifModel        = require('./model/notificationSchema');
const scheduleModel     = require('./model/scheduleSchema');
const departmentModel   = require('./model/departmentSchema');

module.exports = {
    // adminDashBoard: (req, res) =>{
    //     let totalEquipts    = 0;
    //     let totalSpares     = 0;
    //     let totalAccessories= 0;
    //     let totalOperators  = 0;
    //     let totalEngineers  = 0;
    //     let admin           = null;
    //     let chats           = null;
    //     let schedules       = null;
    //     let notifications   = null;
    //     let logbook         = null;
    //     let totalDepartments= null;
    //     let reports         = null;

    //     engineerModel.find().sort({name: 1}).exec((err, engineers) =>{
    //         if(err) throw err;
    //         else{
    //             let no_engineer = 0;
    //             engineers.forEach((engineer) =>{
    //                 no_engineer += 1;
    //             });
    //             totalEngineers = no_engineer;

    //             scheduleModel.find().sort({date: 1}).exec((err, schedules) =>{
    //                 if(err) throw err;

    //                 res.render('admin/admin', {engineers: engineers, schedules: schedules});
    //             });
    //         }
    //     });
    //     operatorModel.find({}, (err, operators) =>{
    //         if(err) throw err;
    //         else{
    //             let no_operator = 0;
    //             operators.forEach((operator) =>{
    //                 no_operator += 1;
    //             });
    //             totalOperators = no_operator;
    //         }
    //     });
    //     equiptModel.find({}, (err, equipts) =>{
    //         if(err) throw err;
    //         else{
    //             let no_equipt = 0;
    //             equipts.forEach((equipt) =>{
    //                 no_equipt += 1;
    //             });
    //             totalEquipts = no_equipt;
    //         }
    //     });
    //     spareModel.find({}, (err, spares) =>{
    //         if(err) throw err;
    //         else{
    //             let no_spares = 0;
    //             spares.forEach((spare) =>{
    //                 no_spares += 1;
    //             });
    //             totalSpares = no_spares;
    //         }
    //     });
    //     accessoryModel.find({}, (err, accessories) =>{
    //         if(err) throw err;
    //         else{
    //             let no_accessories = 0;
    //             accessories.forEach((accessory) =>{
    //                 no_accessories += 1;
    //             });
    //             totalAccessories = no_accessories;
    //         }
    //     });

    // },
    engDashboard: (req, res) =>{
        res.render('hr/engineerDashboard');
    },
    opDashboard: (req, res) =>{
        res.render('hr/operatorDashboard');
    },


    newEng: (req, res) =>{
        res.render('hr/newEngineer');
    },
    newOp: (req, res) =>{
        departmentModel.find().sort({name: 1}).exec((err, departments) =>{
            if(err) throw err;
            res.render('hr/newOperator', {departments: departments});
        });
    },
    editEng: (req, res) =>{
        let username = req.params.username;
        engineerModel.findOne({username: username}, (err, engineer) =>{
            if(err) res.send(err);
            
            res.render("hr/editEngineer", {engineer: engineer});
        });
    },
    editOp: (req, res) =>{
        let username = req.params.username;
        operatoreModel.findOne({username: username}, (err, operator) =>{
            if(err) res.send(err);
            else{
                departmentModel.find().sort({name: 1}).exec((err, departments) =>{
                    if(err) throw err;
                    res.render('hr/editOperator', {operator: operator, departments: departments});
                });
            }
        });
    }, 

    //Post requests
    addEng: (req, res) =>{
        let name        = req.body.name;
        let password    = req.body.password;
        let specialty   = req.body.specialty;
        let phone       = req.body.phone;
        let username      = req.body.username;

        let newEngineer = new engineerModel({
            name,
            password,
            specialty,
            username,
            phone
        });

        newEngineer.save((err) =>{
            if(err)
                res.render('hr/newEngineer', {error: "Error"});
            else
                res.redirect('/hr/engineers');
        });
    },
    addOp: (req, res) =>{
        let name        = req.body.name;
        let password    = req.body.password;
        let department  = req.body.department;
        let phone       = req.body.phone;
        let username    = req.body.username;

        let newOperator = new operatoreModel({
            name,
            password,
            department,
            username,
            phone
        });

        newOperator.save((err) =>{
            if(err)
                res.render('hr/newOperator', {error: err});
            else
                res.redirect('/hr/operators');
        });
    },

    updateEng: (req, res) =>{
        let name        = req.body.name;
        let password    = req.body.password;
        let specialty   = req.body.specialty;
        let username    = req.body.username;    //as fetched from a hidden input box
        let phone       = req.body.phone;

        engineerModel.findOneAndUpdate({username: username},
        {
            name,
            password,
            specialty,
            username,
            phone
        }, (err, engineer) =>{
            if(err)
                res.render('hr/editEngineer', {error: err});
            else
                res.redirect('/hr/engineers')
        });
    },
    updateOp: (req, res) =>{
        let name        = req.body.name;
        let password    = req.body.password;
        let department  = req.body.department;
        let username    = req.body.username;        //as fetched from a hidden input box
        let phone       = req.body.phone;

        operatoreModel.findOneAndUpdate({username: username},
        {
            name,
            password,
            department,
            username,
            phone
        }, (err, operator) =>{
            if(err)
                res.render('hr/editOperator', {error: err});
            else
                res.redirect('/hr/operators')
        });
    },

    engSignin: (req, res) =>{
        res.render('hr/engLogin');
    },
    opSignin: (req, res) =>{
        res.render('hr/opLogin');
    },

    engLogin: (req, res) =>{
        let username    = req.body.username;
        let password    = req.body.password;

        engineerModel.findOne({username: username}, (err, engineer) =>{
            if(err)
                res.render('hr/engLogin', {error: err});
            else if(!engineer)
                res.render('hr/engLogin', {error: `Username is incorrect`});
            else{
                if(password !== engineer.password)
                    res.render('hr/engLogin', {error: `Password is incorrect`});
                else{
                    req.engineersession.user = engineer;
                    res.redirect('/engineer/'+username); 
                }
            }
        });
    },
    opLogin: (req, res) =>{
        let username    = req.body.username;
        let password    = req.body.password;

        operatoreModel.findOne({username: username}, (err, operator) =>{
            if(err)
                res.render('hr/opLogin', {error: err});
            else if(!operator)
                res.render('hr/opLogin', {error: `Username is incorrect`});
            else{
                if(password !== operator.password)
                    res.render('hr/opLogin', {error: `Password is incorrect`});
                else{
                    req.operatorsession.user = operator;
                    console.log(req.operatorsession.user);
                    res.redirect('/operator/'+username);
                }
                  
            }
        });
    },

    engLogout: (req, res) =>{
        req.engineersession.user = null;
        res.redirect('/engineer-signin');
    },
    opLogout: (req, res) =>{
        req.operatorsession.user = null;
        res.redirect('/operator-signin');
    },
    //end
    //Get requests
    allEngs: (req, res) =>{
        engineerModel.find().sort({name: 1}).exec((err, engineers) => {
            if(err)
                res.render('hr/engineers', {error: err});
            else
                res.render('hr/engineers', {engineers: engineers});
        });
    },
    allOps: (req, res) =>{
        operatoreModel.find().sort({name: 1}).exec((err, operators) => {
            if(err)
                res.render('hr/operators', {error: err});
            else
                res.render('hr/operators', {operators: operators});
        });
    },

    removeEng: (req, res) =>{
        let username = req.params.username;
        engineerModel.findOneAndRemove({username: username}, (err, engineer) =>{
            if(err)
                res.render('hr/engineers', {error: err});
            else if(!engineer)
                res.render('hr/engineers', {error: 'No engineer exists with such name'});
            else{
                engineerModel.find().sort({name: 1}).exec((errs, engineers) => {
                    if(errs)
                        res.render('hr/engineers', {error: errs});
                    else
                        res.render('hr/engineers', {success: `${engineer.name} removed successfully`, engineers: engineers});
                });
            }

        });
    },
    removeEngAdmin: (req, res) =>{
        let username = req.params.username;
        engineerModel.findOneAndRemove({username: username}, (err, engineer) =>{
            if(err)
                res.render('hr/engineers', {error: err});
            else if(!engineer)
                res.render('hr/engineers', {error: 'No engineer exists with such name'});
            else{
                engineerModel.find().sort({name: 1}).exec((errs, engineers) => {
                    if(errs)
                        res.render('hr/engineers', {error: errs});
                    else
                    res.redirect('/admin');
                });
            }

        });
    },
    removeOp: (req, res) =>{
        let username = req.params.username;
        operatoreModel.findOneAndRemove({username: username}, (err, operator) =>{
            if(err)
                res.render('hr/operators', {error: err});
            else if(!operator)
                res.render('hr/operators', {error: 'No operator exists with such name'});
            else{
                operatoreModel.find().sort({name: 1}).exec((errs, operators) => {
                    if(errs)
                        res.render('hr/operators', {error: errs});
                    else
                        res.render('hr/operators', {success: `${operator.name} removed successfully`, operators: operators});
                });
            }

        });
    },
    //end
    adminSignin: (req, res) =>{
        res.render('admin/adminLogin');
    },

    adminLogin: (req, res) =>{
        let username = req.body.username;
        let password = req.body.password;

        adminModel.findOne({username: username}, (err, admin) =>{
            if(err)
                res.render('admin/adminLogin', {error: err});
            else if(!admin)
                res.render('admin/adminLogin', {error: `Username is incorrect`});
            else{
                if(password !== admin.password){
                    res.render('admin/adminLogin', {error: `Password is incorrect`});                    
                } else{
                    req.adminsession.user = admin;
                    res.redirect('/admin');
                }

            }
        });
    },

    adminLogout: (req, res) =>{
        req.adminsession.user = null;
        res.redirect('/admin-signin');
    },

    anEngineer: (req, res) =>{
        let username   = req.params.username;
        engineerModel.findOne({username: username}, (err, engineer) =>{
            if(err) throw err;
            res.render('hr/anEngineer', {engineer: engineer});
        });
    },
    anOperator: (req, res) =>{
        let username   = req.params.username;
        operatoreModel.findOne({username: username}, (err, operator) =>{
            if(err) throw err;
            res.render('hr/anOperator', {operator: operator});
        });
    },

    admin: (req, res) =>{
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
                
                engineerModel.find().sort({name: 1}).exec((err, engineers) =>{
                    if(err) throw err;
                    else{
                        let no_engineer = 0;
                        engineers.forEach((engineer) =>{
                            no_engineer += 1;
                        });
                        totalEngineers = no_engineer;
        
                        scheduleModel.find().sort({date: 1}).exec((err, schedules) =>{
                            if(err) throw err;
        
                            res.render('admin/admin', {engineers: engineers, schedules: schedules, notifications: notifs, num: num});
                        });
                    }
                });
            }
        });

    }




}