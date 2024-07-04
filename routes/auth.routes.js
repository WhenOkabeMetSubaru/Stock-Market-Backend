const AuthCtrl = require('../controller/auth.controller')
const Router = require('express').Router();


Router.route('/v1/signup')
    .post(AuthCtrl.signUp)

Router.route('/v1/signin')
    .post(AuthCtrl.signin)



module.exports = Router;