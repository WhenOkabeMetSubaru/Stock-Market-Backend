const express = require('express');
const router = express.Router();
const holdingController = require('../controller/holding.controller'); 
const AuthCtrl  = require('../controller/auth.controller')

router.post('/v1/holdings/add/new',AuthCtrl.requireSignin,AuthCtrl.attachUser, holdingController.addNewHolding);
router.get('/v1/holdings/data/all', AuthCtrl.requireSignin, AuthCtrl.attachUser, holdingController.getAllHoldings);
router.get('/v1/holdings/:holdingId', AuthCtrl.requireSignin, AuthCtrl.attachUser, holdingController.getHoldingById);
router.get('/v1/holdings/user/bought',AuthCtrl.requireSignin,AuthCtrl.attachUser,holdingController.getUserHoldingData);

router.put('/v1/holdings/:holdingId', AuthCtrl.requireSignin, AuthCtrl.attachUser, holdingController.updateHolding); 
router.delete('/v1/holdings/:holdingId', AuthCtrl.requireSignin, AuthCtrl.attachUser, holdingController.deleteHolding);

module.exports = router;