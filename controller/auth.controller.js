const User = require('../model/user.model')
var jsonwt = require('jsonwebtoken')
const WatchList  = require('../model/watchlist.model')
// const expressJwt = require('express-jwt')
var { expressjwt: jwt } = require("express-jwt");



const signUp = async (req, res) =>
{
    try
    {

        let userCheck = await User.findOne({email:req.body.email});

        if(userCheck){
            return res.status(403).json({
                error:true,
                message:"User Already Exists"
            })
        }
       
        let addedUser = new User(req.body);

        let result = await addedUser.save();

        for(let i = 0;i<7;i++){
             await WatchList.create({
                title:'Watchlist ' + (i+1),
                stocks:[],
                stocks_count:0,
                created_by:result?._id
            })
        }

        if (!result)
        {
            return res.status(400).json({
                error: true,
                info: 'Could not add user for some unknown reason'
            })
        }

        return res.status(200).json({
            error: false,
            info: 'User Created Successfully',
            data: result._doc
        })

    } catch (error)
    {

        return res.status(400).json({
            error: true,
            info: error.message
        })
    }
}


const signin = async (req, res) =>
{
    try
    {
        let user = await User.findOne({ "email": req.body.email })
        if (!user)
        {
            return res.status('401').json({ error: "User not found" })

        }
        if (!user.authenticate(req.body.password))
        {
            return res.status(401).send({ error: "Email and password don't match." })
        }

        const token = jsonwt.sign({ _id: user._id }, process.env.SECRET_HASH_KEY)
        let date = new Date();
        date.setDate(date.getDate() + 7)
        res.cookie("secret_token", token, { expire: date, sameSite: 'none' })

        return res.json({
            token
        })
    } catch (err)
    {
        return res.status(401).json({ error: "Could not sign in" })
    }
}
const signout = (req, res) =>
{
    res.clearCookie("secret_token");
    return res.status('200').json({
        info: "signed out"
    })
}
const requireSignin = jwt({
    secret: process.env.SECRET_HASH_KEY,
    userProperty: 'auth',
    algorithms: ['RS256', 'sha1', 'HS256']
})

const hasAuthorization = (req, res, next) =>
{

    // if(req.headers.authorization.includes("Bearer")){
    //     return res.status(401).json({
    //         error:'Invalid token'
    //     })
    // }

    const authorized = req.user && req.auth && req.user._id == req.auth._id

    if (!(authorized))
    {
        return res.status('403').json({
            error: "User is not authorized"
        })

    }

    next()
}

const attachUser = async (req, res, next) =>
{
    let decoded = jsonwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_HASH_KEY);
   
  
    if(!decoded){
        return res.status(404).json({
            error:true,
            info:"Not Found"
        })
    }

    let userDetails = await User.findById({ _id: decoded._id });
    if (!userDetails)
    {
        return res.status(403).json({
            error: true,
            info: 'No User Found'
        })
    }

    userDetails.hashed_password = undefined;
    userDetails.salt = undefined;
    req.user = userDetails;
    
    next()
}

const isUser = async (req, res, next) =>
{
    if (req.user.user_type !== 'user')
    {
        return res.status(401).json({
            error: true,
            info: "User Not Authorized"
        })
    }
    next();
}

const isOwner = async (req, res, next) =>
{
    if (req.user.user_type !== 'owner')
    {
        return res.status(401).json({
            error: true,
            info: "User Not Authorized"
        })
    }

    next()
}

const isAdmin = async (req, res, next) =>
{
    if (req.user.user_type !== 'admin')
    {
        return res.status(401).json({
            error: true,
            info: "User Not Authorized"
        })
    }

    next()
}

const isValidUserAny = async (req, res, next) =>
{
    
    if(!req.user){
        return res.status(401).json({
            error:true,
            info:"Not Authorized user"
        })
    }
    next()
}

module.exports = { signin, signout, requireSignin, hasAuthorization, signUp, attachUser, isUser, isAdmin, isOwner, isValidUserAny }