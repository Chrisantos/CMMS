const bodyParser            = require('body-parser');
const session               = require('client-sessions');
const inventoryController    = require('../controllers/inventoryController');
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

router.get('/equipment', adminSessionChecker, inventoryController.allEquipts);
router.get('/spare', adminSessionChecker, inventoryController.allSpares);
router.get('/accessory', adminSessionChecker, inventoryController.allAccessories);
router.get('/equipment/:inv_id', adminSessionChecker, inventoryController.anEquipt);
router.get('/spare/:sn', adminSessionChecker, inventoryController.aSpare);
router.get('/accessory/:sn', adminSessionChecker, inventoryController.anAccessory);
router.get('/new-equipment', adminSessionChecker, inventoryController.newEquipt);
router.get('/new-spare', adminSessionChecker, inventoryController.newSpare);
router.get('/new-accessory', adminSessionChecker, inventoryController.newAccessory);
router.get('/edit-equipment/:inv_id', adminSessionChecker, inventoryController.editEquipt);
router.get('/edit-spare/:sn', adminSessionChecker, inventoryController.editSpare);
router.get('/edit-accessory/:sn', adminSessionChecker, inventoryController.editAccessory);

router.get('/remove-equipment/:inv_id', adminSessionChecker, inventoryController.removeEquipt);
router.get('/remove-spare/:sn', adminSessionChecker, inventoryController.removeSpare);
router.get('/remove-accessory/:sn', adminSessionChecker, inventoryController.removeAccessory);

router.post('/add-equipment', inventoryController.addEquipt);
router.post('/add-spare', inventoryController.addSpare);
router.post('/add-accessory', inventoryController.addAccessory);
router.post('/update-equipment', inventoryController.updateEquipt);
router.post('/update-spare', inventoryController.updateSpare);
router.post('/update-accessory', inventoryController.updateAccessory);

module.exports = router;