const bodyParser            = require('body-parser');
const session               = require('client-sessions');
const otherController       = require('../controllers/otherController')
const hrController          = require('../controllers/hrController')
const logbookController     = require('../controllers/logbookController')
const adminModel            = require('../controllers/model/adminSchema');
const operatorModel         = require('../controllers/model/operatorSchema');
const engineerModel         = require('../controllers/model/engineerSchema');
const chatController        = require('../controllers/chatController');
const multipart             = require('connect-multiparty');
const multipartMiddleware   = multipart();
const scheduleController    = require('../controllers/scheduleController');


module.exports = (app) =>{
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(session({
        cookieName: 'adminsession',
        secret: 'abcdefghijk',
        duration: 100*60*1000,
        activeDuration: 50*60*1000
    }));
    app.use(session({
        cookieName: 'operatorsession',
        secret: 'abcdefghij',
        duration: 100*60*1000,
        activeDuration: 50*60*1000
    }));
    app.use(session({
        cookieName: 'engineersession',
        secret: 'abcdefghij',
        duration: 100*60*1000,
        activeDuration: 50*60*1000
    }));

    // middleware function to check for logged-in users
    let adminSessionChecker = (req, res, next) =>{
        if(!req.adminsession.user){
            res.redirect('/admin-signin');
        } else{
            adminModel.findOne({username: req.adminsession.user.username}, (err, admin) =>{
                if(err){
                    res.redirect('/admin-signin');
                }
                else if(admin === null){
                    res.redirect('/admin-signin');
                }
                else if(req.adminsession.user.password !== admin.password){
                    res.render('admin/adminLogin', {error: 'Some details have changed since last login, please verify your login details'});
                }
                else{
                    next();
                }
            });
        }
    }

    let operatorSessionChecker = (req, res, next) =>{
        if(!req.operatorsession.user){
            res.redirect('/operator-signin');
        } else{
            operatorModel.findOne({username: req.operatorsession.user.username}, (err, operator) =>{
                if(err){
                    res.redirect('/operator-signin');
                }
                else if(operator === null){
                    res.redirect('/operator-signin');
                }
                else if(req.operatorsession.user.password !== operator.password){
                    res.render('hr/opLogin', {error: 'Some details have changed since last login, please verify your login details'});
                }
                else{
                    next();
                }
            });
        }
    };

    let engineerSessionChecker = (req, res, next) =>{
        if(!req.engineersession.user){
            res.redirect('/engineer-signin');
        } else{
            engineerModel.findOne({username: req.engineersession.user.username}, (err, engineer) =>{
                if(err){
                    res.redirect('/engineer-signin');
                }
                else if(engineer === null){
                    res.redirect('/engineer-signin');
                }
                else if(req.engineersession.user.password !== engineer.password){
                    res.render('hr/engLogin', {error: 'Some details have changed since last login, please verify your login details'});
                }
                else{
                    next();
                }
            });
        }
    };

    app.get('/', (req, res) =>{
        res.render('admin/home');
    });
    app.get('/admin', adminSessionChecker, hrController.admin);

    //Chat routes
    app.get('/engineer/:engineer_id', engineerSessionChecker, chatController.chatEngineer);
    app.get('/operator/:operator_id', operatorSessionChecker, chatController.chatOperator);
    // app.get('/chat', adminSessionChecker, chatController.chat);
    // app.get('/work-order', adminSessionChecker, chatController.workOrder);


    // app.get('/admin-logout', adminSessionChecker, hrController.adminLogout);
    

    // app.get('/reports', adminSessionChecker, logbookController.getReport);
    // app.get('/reports/:month', adminSessionChecker, logbookController.getReport);
    
    // app.get('/departments', adminSessionChecker, otherController.department);
    // app.get('/new-department', adminSessionChecker, otherController.newDepartment);
    // app.get('/duty-roaster', adminSessionChecker, otherController.dutyRoaster);
    // app.get('/new-duty-roaster', adminSessionChecker, otherController.newDutyRoaster);

    app.get('/chat', chatController.chat);
    app.get('/work-order', chatController.workOrder);


    app.get('/admin-logout', hrController.adminLogout);
    

    app.get('/reports', logbookController.getReport);
    app.get('/reports/:month', logbookController.getReport);
    
    app.get('/departments', otherController.department);
    app.get('/new-department', otherController.newDepartment);
    app.get('/duty-roaster', otherController.dutyRoaster);
    app.get('/new-duty-roaster', otherController.newDutyRoaster);
    
    app.get('/engineer-signin', hrController.engSignin);
    app.get('/operator-signin', hrController.opSignin);
    app.get('/admin-signin', hrController.adminSignin);
    app.get('/admin-signup', hrController.adminSignup);

    app.get('/corrective-maintenance', scheduleController.engCorrective);
    app.get('/preventive-maintenance', scheduleController.engPreventive);

    app.post('/engineer-login', hrController.engLogin);
    app.post('/operator-login', hrController.opLogin);
    app.post('/admin-login', hrController.adminLogin);
    app.post('/admin-signup', hrController.addAdmin);

    app.get('/work-order', otherController.workOrder);
    app.get('/edit-workorder/:id', otherController.editWorkOrder);
    app.get('/work-order/:id', otherController.deleteWorkOrder);

    app.get('/procedure', scheduleController.procedures);
    app.get('/eng_duty-roaster', scheduleController.dutyRoaster);
    
    app.post('/add-department', otherController.addDepartment);

    app.post('/add-duty-roaster', otherController.addDutyRoaster);

    app.post('/admin_w', chatController.sendWorkOrder);
    app.post('/update-work-order', otherController.updateWorkOrder);
    app.post('/admin_r', chatController.sendReply);
    app.post('/operator_r', chatController.operatorRequest);
    app.post('/engineer_r', chatController.engineerReply);
};