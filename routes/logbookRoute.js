const bodyParser            = require('body-parser');
const session               = require('client-sessions');
const logbookController     = require('../controllers/logbookController');
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

router.get('/', adminSessionChecker, logbookController.logbook);
router.get('/new', adminSessionChecker, logbookController.newLog);
router.get('/edit/:logbook_id', adminSessionChecker, logbookController.editLog);
router.get('/delete/:logbook_id', adminSessionChecker, logbookController.removeLog);


router.post('/add', logbookController.registerLog);
router.post('/update', logbookController.updateLog);

module.exports = router;