const bodyParser            = require('body-parser');
const session               = require('client-sessions');
const scheduleController    = require('../controllers/scheduleController');
const adminModel            = require('../controllers/model/adminSchema');
const express               = require('express');

const router                = express.Router();

router.use(bodyParser.urlencoded({extended: true}));

router.use(session({
    cookieName: 'adminsession',
    secret: 'abcdefghijk',
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


router.get('/preventive-maintenance', adminSessionChecker, scheduleController.preventiveMaint);
router.get('/preventive-maintenance/:maint_id', adminSessionChecker, scheduleController.aPrevMaint);
router.get('/schedule/:schedule_id', adminSessionChecker, scheduleController.aSchedule);
router.get('/schedule', adminSessionChecker, scheduleController.schedule);
router.get('/new-schedule', adminSessionChecker, scheduleController.addSchedule);
router.get('/new-preventive', adminSessionChecker, scheduleController.addPrevMaint);
router.get('/edit-schedule/:schedule_id', adminSessionChecker, scheduleController.editSchedule);
router.get('/edit-preventive/:maint_id', adminSessionChecker, scheduleController.editPrevMaint);
router.get('/delete-schedule/:schedule_id', adminSessionChecker, scheduleController.deleteSchedule);
router.get('/delete-schedule-admin/:schedule_id', adminSessionChecker, scheduleController.deleteScheduleAdmin);

router.get('/procedures', scheduleController.procedures);

router.post('/add-schedule', scheduleController.saveSchedule);
router.post('/add-preventive', scheduleController.savePrevMaint);
router.post('/update-preventive', scheduleController.updatePrevMaint);
router.post('/update-schedule', scheduleController.updateSchedule);
    
module.exports = router;