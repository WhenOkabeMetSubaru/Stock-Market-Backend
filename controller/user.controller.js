const User = require('../model/user.model');
const jwt = require('jsonwebtoken')
const WatchList = require('../model/watchlist.model')



const getUserByID = async (req, res, next, id) =>
{
    try
    {


        let userDetails = await User.findById({ _id: id });

        if (!userDetails)
        {
            return res.status(404).json({
                error: true,
                info: 'User not found'
            })
        }

        req.user = userDetails;

        next();

    } catch (error)
    {

        return res.status(400).json({
            error: true,
            info: 'Could not fetch user information for some unknown reason'
        })
    }
}

const getUserDetailsTrimmed = async (req, res) =>
{
    req.user.hashed_password = undefined;

    res.status(200).json({
        error: false,
        info: 'User Found',
        data: req.user
    })
}

const getUserByToken = async (req, res) =>
{

    try
    {

        let decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_HASH_KEY);


        let userDetails = await User.findById({ _id: decoded._id });

        if (!userDetails)
        {
            return res.status(404).json({
                error: true,
                info: 'User not found'
            })
        }


        userDetails.hashed_password = undefined;
        res.status(200).json({
            error: false,
            info: 'User Found',
            data: userDetails
        })



    } catch (error)
    {

        return res.status(400).json({
            error: true,
            info: 'Could not fetch user  unknown reason'
        })
    }
}


const updateUserByID = async (req, res, id) =>
{

    try
    {


        let userDetails = await User.findByIdAndUpdate({ _id: req.user._id }, req.body, { new: true });

        if (!userDetails)
        {
            return res.status(404).json({
                error: true,
                info: 'User not found'
            })
        }

        return res.status(200).json({
            error: false,
            info: 'User updated',
            data: userDetails._doc
        })

    } catch (error)
    {

        return res.status(400).json({
            error: true,
            info: 'Could not fetch user information for some unknown reason'
        })
    }
}

const getAllUsers = async (req, res) =>
{

    try
    {



        let userDetails = await User.find({}).select('-hashed_password');

        if (!userDetails?.length > 0)
        {
            return res.status(400).json({
                error: true,
                info: 'Users Not Found',
                data: []
            })
        }

        return res.status(200).json({
            error: false,
            info: 'User Found',
            data: userDetails
        })
    } catch (error)
    {

        return res.status(400).json({
            error: true,
            info: 'Could not fetch user  unknown reason'
        })
    }
}

const getAllWatchListByUser = async (req, res) =>
{

    try
    {


        let watchListData = await WatchList.find({ created_by: req.user._id }).lean();

        if (!watchListData?.length > 0)
        {
            return res.status(404).json({
                error: true,
                info: "Not Found"
            })
        }

        return res.json({
            error: false,
            info: "Data Found",
            data: watchListData
        })


    } catch (error)
    {

        return res.status(500).json({
            error: true,
            info: error.message
        })
    }
}

const getWatchListByID = async (req, res) =>
{

    try
    {


        let watchListData = await WatchList.findById({_id:req.params.watchId}).lean();

        if (!watchListData)
        {
            return res.status(404).json({
                error: true,
                info: "Not Found"
            })
        }

        return res.json({
            error: false,
            info: "Data Found",
            data: watchListData
        })


    } catch (error)
    {

        return res.status(500).json({
            error: true,
            info: error.message
        })
    }
}


const addStockToWatchList = async (req, res) =>
{
    try
    {
      
        let checkExists = await WatchList.findOne({ _id: req.params.Id, stocks: { $in: [req.params.stockId] } })


        let updateWatchList;

        if (!checkExists)
        {
            updateWatchList = await WatchList.findByIdAndUpdate({ _id: req.params.watchId }, {
                $push: {
                    stocks: req.params.stockId
                }
            })
        }

        return res.json({
            error: false,
            info: "Success",
            data: updateWatchList
        })

    } catch (error)
    {
        return res.status(500).json({
            error: true,
            info: error.message
        })
    }
}

const updateWatchListByID = async (req, res) =>
{
    try
    {

     

        let updateWatchList = await WatchList.findByIdAndUpdate({ _id: req.params.watchId },req.body,{new:true})


        return res.json({
            error: false,
            info: "Success",
            data: updateWatchList
        })

    } catch (error)
    {
        return res.status(500).json({
            error: true,
            info: error.message
        })
    }
}



const deleteStockFromWatchList = async (req, res) =>
{
    try
    {

        let checkExists = await WatchList.findOne({ _id: req.params.watchId, stocks: { $in: [req.params.stockId] } })


        let updateWatchList;

        if (checkExists)
        {
            updateWatchList = await WatchList.findByIdAndUpdate({ _id: req.params.watchId }, {
                $pull: {
                    stocks: req.params.stockId
                }
            })
        }

        return res.json({
            error: false,
            info: "Success",
            data: updateWatchList
        })

    } catch (error)
    {
        return res.status(500).json({
            error: true,
            info: error.message
        })
    }
}



module.exports = {
    getUserByID,
    updateUserByID,
    getUserDetailsTrimmed,
    getUserByToken,
    getAllUsers,
    getAllWatchListByUser,
    addStockToWatchList,
    deleteStockFromWatchList,
    updateWatchListByID,
    getWatchListByID
}
