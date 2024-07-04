const Router = require('express').Router();
const StockCtrl = require('../controller/stock.controller'); // Update path if needed
const AuthCtrl = require('../controller/auth.controller'); // Assuming separate auth controller (optional)



Router.get('/v1/stocks/all', AuthCtrl.attachUser, AuthCtrl.isValidUserAny, StockCtrl.getAllStocks);

Router.get('/v1/stocks/single/:stockId',AuthCtrl.attachUser,AuthCtrl.isValidUserAny, StockCtrl.getStockByID); // Adjust path if needed



Router.route('/v1/stocks/watchlist/:watchId').get(AuthCtrl.requireSignin, AuthCtrl.attachUser, AuthCtrl.isValidUserAny, StockCtrl.getAllStocksByWatchList)


Router.get('/v1/stocks/search/new', AuthCtrl.attachUser,  StockCtrl.getSearchStockByName); // Adjust path if needed


// Router.post('/v1/stocks/add',  StockCtrl.addNewStock); // Adjust path if needed


Router.put('/v1/stocks/:stockId/update',AuthCtrl.requireSignin, AuthCtrl.attachUser, AuthCtrl.isValidUserAny, AuthCtrl.requireSignin, StockCtrl.updateStockByID); // Adjust path if needed


Router.delete('/v1/stocks/:stockId/delete', AuthCtrl.requireSignin, AuthCtrl.attachUser, AuthCtrl.isValidUserAny, StockCtrl.deleteStockByID); // Adjust path if needed




module.exports = Router;