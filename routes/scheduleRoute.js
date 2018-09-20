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


router.get('/preventive-maintenance', adminSessionChecker, scheduleController.preventive);
router.get('/corrective-maintenance', adminSessionChecker, scheduleController.corrective);
router.get('/procedures', adminSessionChecker, scheduleController.procedure);

// router.get('/preventive/:schedule_id', adminSessionChecker, scheduleController.aPreventive);
// router.get('/corrective/:schedule_id', adminSessionChecker, scheduleController.aCorrective);

router.get('/procedure/:maint_id', adminSessionChecker, scheduleController.aProcedure);

router.get('/new-corrective', adminSessionChecker, scheduleController.addCorrective);
router.get('/new-preventive', adminSessionChecker, scheduleController.addPreventive);
router.get('/new-procedure', adminSessionChecker, scheduleController.addProcedure);

router.get('/edit-preventive/:schedule_id', adminSessionChecker, scheduleController.editPreventive);
router.get('/edit-corrective/:schedule_id', adminSessionChecker, scheduleController.editCorrective);
router.get('/edit-procedure/:maint_id', adminSessionChecker, scheduleController.editProcedure);

router.get('/delete-corrective/:schedule_id', adminSessionChecker, scheduleController.deleteCorrective);
router.get('/delete-preventive/:schedule_id', adminSessionChecker, scheduleController.deletePreventive);
router.get('/delete-corrective-admin/:schedule_id', adminSessionChecker, scheduleController.deleteCorrectiveAdmin);

router.post('/add-procedure', scheduleController.saveProcedure);
router.post('/add-corrective', scheduleController.saveCorrective);
router.post('/add-preventive', scheduleController.savePreventive);

router.post('/update-corrective', scheduleController.updateCorrective);
router.post('/update-preventive', scheduleController.updatePreventive);
router.post('/update-procedure', scheduleController.updateProcedure);
    
module.exports = router;