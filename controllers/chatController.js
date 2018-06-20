const chatModel         = require('./model/chatSchema');
const workOrderModel    = require('./model/workOrderSchema');
const cmRequestModel    = require('./model/cmRequestSchema');
const engineerModel     = require('./model/engineerSchema');
const operatorModel     = require('./model/operatorSchema');
const departmentModel   = require('./model/departmentSchema');
const equipmentModel    = require('./model/equiptSchema');
const notifModel        = require('./model/notificationSchema');

module.exports = {
    chat: (req, res) =>{
        let chatMessagesTo = null;
        let chatMessagesFrom = null;
        let workOrders   = null;
        let cmRequests   = null;

        workOrderModel.find({}, (err, wos) =>{
            if(err) throw err;
            else{
                workOrders = wos;
                cmRequestModel.find({}, (err, cmrequests) =>{
                    if(err) throw err;
                    else{
                        cmRequests = cmrequests;
                        chatModel.find({to: req.adminsession.user.username}, (err, chats) =>{
                            if(err) throw err;
                            else{
                                chatMessagesTo = chats;
                                chatModel.find({from: req.adminsession.user.username}, (err, chatss) =>{
                                    if(err) throw err;
                                    else{
                                        operatorModel.find().sort({name: 1}).exec((err, operators) =>{
                                            if(err) throw err;
                                            else{
                                                engineerModel.find().sort({name: 1}).exec((err, engineers) =>{
                                                    if(err) throw err;
                                                    else{
                                                        departmentModel.find().sort({name: 1}).exec((err, departments) =>{
                                                            if(err) throw err;
                                                            else{
                                                                equipmentModel.find().sort({name: 1}).exec((err, equipments) =>{
                                                                    if(err) throw err;
                                                                    else{
                                                                        chatMessagesFrom = chatss;                                        
                                                                        res.render('chat/chat', 
                                                                                {
                                                                                    messages_other: chatMessagesTo, 
                                                                                    messages_me: chatMessagesFrom, 
                                                                                    workOrders: workOrders, 
                                                                                    requests: cmRequests,
                                                                                    operators,
                                                                                    engineers,
                                                                                    departments,
                                                                                    equipments
                                                                                });
                                                                    
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });                
    },
    chatEngineer: (req, res) =>{
        let chatMessagesFrom = null;
        let chatMessagesTo   = null;
        let workOrders       = null;
        let username         = req.engineersession.user.username;  //To be replaced with session data
        let name             = req.engineersession.user.name;

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
                
                chatModel.find({to: username}, (err, chats) =>{
                    if(err) throw err;
                    else{
                        chatMessagesTo = chats;
                        workOrderModel.find({engineer_username: username}, (err, wos) =>{
                            if(err) throw err;
                            else{
                                workOrders = wos;
                                chatModel.find({from: username}, (err, chatss) =>{
                                    if(err) throw err;
                                    else{
                                        chatMessagesFrom = chatss;
                                        res.render('hr/engineerIndex', 
                                                {
                                                    name,
                                                    username, 
                                                    messages_other: chatMessagesTo, 
                                                    messages_me: chatMessagesFrom, 
                                                    workOrders: workOrders,
                                                    notifications: notifs, 
                                                    num
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
    chatOperator: (req, res) =>{
        let chatMessages = null;
        let cmRequests   = null;
        let username  = req.operatorsession.user.username;
        let name  = req.operatorsession.user.name;

        chatModel.find({to: username} , (err, chats) =>{
            if(err) throw err;
            else{
                chatMessages = chats;
                cmRequestModel.find({operator_username: username}, (err, cmrequests) =>{
                    if(err) throw err;
                    else{
                        cmRequests = cmrequests;
                        departmentModel.find().sort({name: 1}).exec((err, departments) =>{
                            if(err) throw err;
                            else{
                                equipmentModel.find().sort({name: 1}).exec((err, equipments) =>{
                                    if(err) throw err;
                                    else{
                                        res.render('hr/operatorIndex', 
                                                {
                                                    name, 
                                                    username,
                                                    requests: cmRequests, 
                                                    messages_other: chatMessages,
                                                    departments,
                                                    equipments
                                                });  
                                    
                                    }
                                });
                            }
                        })
                    }
                    
                });
            }
        });
        
    },
    
    workOrder: (req, res) =>{
        workOrderModel.find().sort({wo_id: 1}).exec((err, wos) =>{
            if(err) throw err;
            res.render('others/workOrders', {workOrders: wos});
        })
    },
    //Post request
    sendWorkOrder: (req, res) =>{
        let equipt          = req.body.equipt;
        let equipt_loc      = req.body.equipt_loc;
        let department      = req.body.department;
        let spares          = req.body.spares;
        let accessories     = req.body.accessories;
        let fault           = req.body.fault;
        let engineer_username   = req.body.engineer_username;
        let to              = req.body.to; //Who the message is meant for.

        let date            = new Date();
        let wo_id           = date.getDay() + date.getMonth();

        let newWO           = new workOrderModel({
            wo_id,
            equipt_loc,
            equipt,
            spares,
            department,
            accessories,
            fault,
            engineer_username
        });

        newWO.save((err) =>{
            if(err) throw err;
            else{
                res.redirect(`/chat`)
            }
        });
    },

    sendReply: (req, res) =>{
        let message     = req.body.message;
        let to          = req.body.to;
        let date        = new Date();
        let chat_date   = date.getTime();

        let newMessage  = new chatModel({
            from:   req.adminsession.user.username,
            to,
            message,
            chat_date
        });

        newMessage.save((err) =>{
            if(err) throw err;
            else{
                res.redirect('/chat');
            }
        });
    },
    
    operatorRequest: (req, res) =>{
        let equipt              = req.body.equipt;
        let department          = req.body.department;
        let location            = req.body.location;
        let fail_date           = req.body.fail_date;
        let statement           = req.body.statement;
        let username            = req.operatorsession.user.username;
        let name                = req.operatorsession.user.name;
        
        // let operator_id     = req.body.operator_id;   //use session to change this
        let date            = new Date();
        let time            = date.getTime();

        let newRequest      = new cmRequestModel({
            equipt,
            department,
            location,
            fail_date,
            statement,
            operator_username: username,
            time,
        });

        newRequest.save((err) =>{
            if(err) throw err;
            else{
                res.redirect(`/operator/${username}`);
            }
        });
    },

    engineerReply: (req, res) =>{
        let message             = req.body.message;
        let date                = new Date();
        let chat_date           = date.getTime();
        let username            = req.engineersession.user.username;
        let name                = req.engineersession.user.name;
        
        let newMessage  = new chatModel({
            from:   username,   //change it using session
            to:     'admin',
            message,
            chat_date
        });

        newMessage.save((err) =>{
            if(err) throw err;
            else{
                res.redirect(`/engineer/${username}`);
            }
        });
 
    }

};
