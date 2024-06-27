const AuthCtrl = require('../controller/auth.controller');
const UserCtrl = require('../controller/user.controller');
const Router = require('express').Router();


Router.route('/v1/users/:userId')
    .get(AuthCtrl.requireSignin, UserCtrl.getUserDetailsTrimmed)

Router.route('/v1/user/all')
    .get(UserCtrl.getAllUsers)

Router.route('/v1/users/:userId')
    .put(AuthCtrl.requireSignin, AuthCtrl.attachUser, AuthCtrl.hasAuthorization, UserCtrl.updateUserByID);

Router.route('/v1/user/single')
    .get(AuthCtrl.requireSignin, UserCtrl.getUserByToken)

Router.route('/v1/user/watchlist')
    .get(AuthCtrl.requireSignin,AuthCtrl.attachUser, UserCtrl.getAllWatchListByUser)

Router.route('/v1/user/watchlist/:watchId/add/stock/:stockId')
    .post(AuthCtrl.requireSignin,AuthCtrl.attachUser, UserCtrl.addStockToWatchList)

Router.route('/v1/user/watchlist/:watchId/single')
    .get(AuthCtrl.requireSignin,AuthCtrl.attachUser,UserCtrl.getWatchListByID)

Router.route('/v1/user/watchlist/:watchId/delete/stock/:stockId')
    .post(AuthCtrl.requireSignin,AuthCtrl.attachUser,UserCtrl.deleteStockFromWatchList)


Router.route('/v1/user/watchlist/update/:watchId')
    .put(AuthCtrl.requireSignin, AuthCtrl.attachUser, UserCtrl.updateWatchListByID)




module.exports = Router;