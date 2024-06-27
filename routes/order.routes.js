JavaScript
const Router = require('express').Router();
const OrderCtrl = require('../controller/order.controller'); // Update path if needed
const AuthCtrl = require('../controller/auth.controller'); // Assuming separate auth controller (optional)

// **Routes for user-specific order retrieval**

Router.get('/v1/orders', AuthCtrl.attachUser, AuthCtrl.isValidUserAny, OrderCtrl.getAllOrdersByUser);

Router.get('/v1/orders/holding', AuthCtrl.attachUser, AuthCtrl.isValidUserAny, OrderCtrl.getAllHoldingOrdersByUser);

Router.get('/v1/orders/positions', AuthCtrl.attachUser, AuthCtrl.isValidUserAny, OrderCtrl.getAllPositionOrdersByUser);

// **Similarly, define a route for pending orders based on your status logic**

// **Other routes**

Router.get('/v1/orders/:orderId',AuthCtrl.attachUser,AuthCtrl.isValidUserAny, OrderCtrl.getOrderByID); 

Router.post('/v1/orders/add', AuthCtrl.attachUser, AuthCtrl.isValidUserAny, OrderCtrl.addNewOrder); 

Router.put('/v1/orders/:orderId/update', AuthCtrl.requireSignin, AuthCtrl.attachUser, AuthCtrl.isValidUserAny, AuthCtrl.requireSignin, OrderCtrl.updateOrderByID);

Router.delete('/v1/orders/:orderId/delete', AuthCtrl.requireSignin, AuthCtrl.attachUser, AuthCtrl.isValidUserAny, OrderCtrl.deleteOrderByID); 

module.exports = Router;