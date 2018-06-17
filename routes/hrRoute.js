const bodyParser            = require('body-parser');
const session               = require('client-sessions');
const hrController          = require('../controllers/hrController');
const adminModel            = require('../controllers/model/adminSchema');
const engineerModel         = require('../controllers/model/engineerSchema');
const operatorModel         = require('../controllers/model/operatorSchema');
const express               = require('express');

const router                = express.Router();
router.use(bodyParser.urlencoded({extended: true}));

router.use(session({
    cookieName: 'adminsession',
    secret: 'abcdefghijk',
    duration: 100*60*1000,
    activeDuration: 50*60*1000
}));
router.use(session({
    cookieName: 'operatorsession',
    secret: 'abcdefghij',
    duration: 100*60*1000,
    activeDuration: 50*60*1000
}));
router.use(session({
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
};

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

router.get('/engineers', adminSessionChecker, hrController.allEngs);
router.get('/operators', adminSessionChecker, hrController.allOps);
router.get('/engineer/:username', adminSessionChecker, hrController.anEngineer);
router.get('/operator/:username', adminSessionChecker, hrController.anOperator);
router.get('/new-engineer', adminSessionChecker, hrController.newEng);
router.get('/new-operator', adminSessionChecker, hrController.newOp);
router.get('/edit-engineer/:username', adminSessionChecker, hrController.editEng);
router.get('/edit-operator/:username', adminSessionChecker, hrController.editOp);
router.get('/remove-engineer/:username', adminSessionChecker, hrController.removeEng);
router.get('/remove-engineer-admin/:username', adminSessionChecker, hrController.removeEngAdmin);
router.get('/remove-operator/:username', adminSessionChecker, hrController.removeOp);

router.get('/engineer-logout', engineerSessionChecker, hrController.engLogout);
router.get('/operator-logout', operatorSessionChecker, hrController.opLogout);

router.post('/add-engineer', hrController.addEng);
router.post('/add-operator', hrController.addOp);
router.post('/update-engineer', hrController.updateEng);
router.post('/update-operator', hrController.updateOp);

module.exports = router;