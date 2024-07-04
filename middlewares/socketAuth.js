const jwt = require('jsonwebtoken');
const User = require('../model/user.model')


const socketAuth = async (req,res,next) =>
{

    try
    {

        const token = socket.handshake.headers.authorization.split(" ")[1];

        if (!token)
        {
            return res.status(401).json({
                error: true,
                info: "Not Authorized"
            })
        }

        const decoded = jwt.verify(token, process.env.SECRET_HASH_KEY);

        if (!decoded)
        {
            return res.status(401).json({
                error: true,
                info: "Invalid token"
            })
        }

        req.user  = decoded;
        next();

    } catch (error)
    {
        console.log(error.message)
        return res.status(500).json({
            error: true,
            info: error.message
        })
    }
}

const authenticateSocketUserHandshake = async (socket, next) =>
{

    try
    {

        const token = socket.handshake.headers.authorization.split(" ")[1];

        if (!token)
        {
            return res.status(401).json({
                error: true,
                info: "Not Authorized"
            })
        }

        const decoded = jwt.verify(token, process.env.SECRET_HASH_KEY);

        if (!decoded)
        {
            return res.status(401).json({
                error: true,
                info: "Invalid token"
            })
        }

        let userDetails = await User.findById({ _id: decoded._id });

        if (!userDetails)
        {
            return res.status(404).json({
                error: true,
                info: "user not found"
            })
        }

        socket.user = userDetails;
        next();

    } catch (error)
    {
        console.log(error.message)
        return res.status(500).json({
            error: true,
            info: error.message
        })
    }
}

module.exports = {
    socketAuth,
    authenticateSocketUserHandshake
}