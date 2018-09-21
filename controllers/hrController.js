const engineerModel     = require('./model/engineerSchema');
const adminModel        = require('./model/adminSchema');
const operatorModel    = require('./model/operatorSchema');
const notifModel        = require('./model/notificationSchema');
const scheduleModel     = require('./model/correctiveSchema');
const departmentModel   = require('./model/departmentSchema');
// const bcrypt            = require('bcrypt');

module.exports = {
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
        operatorModel.findOne({username: username}, (err, operator) =>{
            if(err) res.send(err);
            else{
                departmentModel.find().sort({name: 1}).exec((err, departments) =>{
                    if(err) throw err;
                    res.render('hr/editOperator', {operator: operator, departments: departments});
                });
            }
        });
    }, 

    addEng: (req, res) =>{
        let name        = req.body.name;
        let password    = req.body.password;
        let specialty   = req.body.specialty;
        let phone       = req.body.phone;
        let username    = req.body.username;

        // bcrypt.hash(password, 10, function(err, hash) {
        //     let newEngineer = new engineerModel({
        //         name,
        //         password: hash,
        //         specialty,
        //         username,
        //         phone
        //     });
    
        //     newEngineer.save((err) =>{
        //         if(err)
        //             res.render('hr/newEngineer', {error: "Error"});
        //         else
        //             res.redirect('/hr/engineers');
        //     });
        // });
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

        // bcrypt.hash(password, 10, function(err, hash) {
        //     let newOperator = new operatorModel({
        //         name,
        //         password: hash,
        //         department,
        //         username,
        //         phone
        //     });
    
        //     newOperator.save((err) =>{
        //         if(err)
        //             res.render('hr/newOperator', {error: err});
        //         else
        //             res.redirect('/hr/operators');
        //     });
        // });
        let newOperator = new operatorModel({
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
        
        // bcrypt.hash(password, 10, function(err, hash) {
        //     engineerModel.findOneAndUpdate({username: username},
        //     {
        //         name,
        //         password: hash,
        //         specialty,
        //         username,
        //         phone
        //     }, (err, engineer) =>{
        //         if(err)
        //             res.render('hr/editEngineer', {error: err});
        //         else
        //             res.redirect('/hr/engineers')
        //     });
        // });
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

        // bcrypt.hash(password, 10, function(err, hash) {
        //     operatoreModel.findOneAndUpdate({username: username},
        //     {
        //         name,
        //         password: hash,
        //         department,
        //         username,
        //         phone
        //     }, (err, operator) =>{
        //         if(err)
        //             res.render('hr/editOperator', {error: err});
        //         else
        //             res.redirect('/hr/operators');
        //     });
        // });
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
                    res.redirect('/hr/operators');
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
                // bcrypt.compare(password, engineer.password, function(err, resp) {
                //     if(err)
                //         res.render('hr/engLogin', {error: `Password is incorrect`});
                //     else{
                //         req.engineersession.user = engineer;
                //         res.redirect('/engineer/:'+username); 
                //     }
                // });
                req.engineersession.user = engineer;
                res.redirect('/engineer/:'+username);                    
                
            }
        });
    },
    opLogin: (req, res) =>{
        let username    = req.body.username;
        let password    = req.body.password;

        operatorModel.findOne({username: username}, (err, operator) =>{
            if(err)
                res.render('hr/opLogin', {error: err});
            else if(!operator)
                res.render('hr/opLogin', {error: `Username is incorrect`});
            else{
                // bcrypt.compare(password, operator.password, function(err, resp) {
                //     if(err)
                //     res.render('hr/opLogin', {error: `Password is incorrect`});
                //     else{
                //         req.operatorsession.user = operator;
                //         res.redirect('/operator/:'+username); 
                //     }
                // });
                req.operatorsession.user = operator;
                res.redirect('/operator/:'+username);
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
        operatorModel.find().sort({name: 1}).exec((err, operators) => {
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
        operatorModel.findOneAndRemove({username: username}, (err, operator) =>{
            if(err)
                res.render('hr/operators', {error: err});
            else if(!operator)
                res.render('hr/operators', {error: 'No operator exists with such name'});
            else{
                operatorModel.find().sort({name: 1}).exec((errs, operators) => {
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

    adminSignup: (req, res) =>{
        res.render('admin/adminSignup');
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
                // bcrypt.compare(password, admin.password, function(err, resp) {
                //     if(err)
                //     res.render('admin/adminLogin', {error: `Password is incorrect`});
                //     else{
                //         req.adminsession.user = admin;
                //         res.redirect('/admin'); 
                //     }
                // });
                req.adminsession.user = admin;
                res.redirect('/admin');

            }
        });
    },

    //Post requests
    addAdmin: (req, res) =>{
        let password    = req.body.password;
        let username      = req.body.username;

        // bcrypt.hash(password, 10, function(err, hash) {
        //     let newAdmin = new adminModel({
        //         password: hash,
        //         username
        //     });
    
        //     newAdmin.save((err) =>{
        //         if(err)
        //             res.render('admin/adminLogin', {error: "Error"});
        //         else
        //             res.redirect('/admin');
        //     });
        // });
        let newAdmin = new adminModel({
            password,
            username
        });

        newAdmin.save((err) =>{
            if(err)
                res.render('admin/adminSignup', {error: "Error"});
            else
                res.redirect('/admin');
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
        operatorModel.findOne({username: username}, (err, operator) =>{
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